import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateMiddleware";

const router = Router();

const bookingSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  customerPhone: z.string().min(10, "Phone number is required"),
  customerType: z.string().min(1, "Customer type is required"),
  serviceIds: z.array(z.string()).min(1, "At least one service must be selected"),
  stylistId: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  offerCode: z.string().optional(),
  notes: z.string().optional(),
});

// POST /api/bookings - Create Booking with Collision Lock
router.post("/", validateBody(bookingSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customerName, customerPhone, customerType, serviceIds, stylistId, date, timeSlot, offerCode, notes } = req.body;
    const customerId = req.user?.userId || null;

    const parsedDate = new Date(date);
    const businessSettings = await prisma.businessSettings.findUnique({ where: { id: "default" } });
    const maxChairs = businessSettings?.maxConcurrentBookings || 4;

    // 1. Check double booking collision for general salon chairs
    const existingBookings = await prisma.booking.count({
      where: {
        date: parsedDate,
        timeSlot,
        status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      },
    });

    if (existingBookings >= maxChairs) {
      return res.status(409).json({
        success: false,
        error: {
          code: "SLOT_FULLY_BOOKED",
          message: "This time slot is fully booked. Please select another slot.",
        },
      });
    }

    // 2. Check double booking collision for specific stylist if requested
    if (stylistId) {
      const stylistBooking = await prisma.booking.findFirst({
        where: {
          stylistId,
          date: parsedDate,
          timeSlot,
          status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
        },
      });

      if (stylistBooking) {
        return res.status(409).json({
          success: false,
          error: {
            code: "STYLIST_UNAVAILABLE",
            message: "The requested stylist is already booked for this time slot. Please choose another stylist or slot.",
          },
        });
      }
    }

    // 3. Fetch selected services & calculate total duration & price
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    if (services.length === 0) {
      return res.status(400).json({ success: false, error: { code: "INVALID_SERVICES", message: "Selected services not found." } });
    }

    let totalDuration = 0;
    let totalPrice = 0;

    for (const s of services) {
      totalDuration += s.durationMinutes;
      totalPrice += s.price;
    }

    // 4. Calculate discount if offer code provided
    let totalDiscount = 0;
    if (offerCode) {
      const offer = await prisma.offer.findUnique({ where: { code: offerCode } });
      if (offer && offer.isEnabled) {
        if (offer.discountType === "PERCENTAGE") {
          totalDiscount = (totalPrice * offer.discountValue) / 100;
        } else {
          totalDiscount = offer.discountValue;
        }
      }
    }

    const netPrice = Math.max(0, totalPrice - totalDiscount);

    // 5. Create Booking and Items in a Transaction
    const booking = await prisma.$transaction(async (tx: any) => {
      const createdBooking = await tx.booking.create({
        data: {
          customerId,
          customerName,
          customerPhone,
          customerType,
          date: parsedDate,
          timeSlot,
          status: "CONFIRMED",
          stylistId: stylistId || null,
          totalDuration,
          totalPrice,
          totalDiscount,
          netPrice,
          notes: notes || null,
          bookingItems: {
            create: services.map((s: any) => ({
              serviceId: s.id,
              serviceName: s.name,
              duration: s.durationMinutes,
              price: s.price,
            })),
          },
        },
        include: { bookingItems: true, stylist: true },
      });

      // 6. Create Queue entry automatically for today's bookings
      const isToday = new Date().toDateString() === parsedDate.toDateString();
      if (isToday) {
        const queueCount = await tx.queueEntry.count({
          where: { status: { in: ["WAITING", "IN_SERVICE"] } },
        });

        await tx.queueEntry.create({
          data: {
            bookingId: createdBooking.id,
            customerName: createdBooking.customerName,
            customerPhone: createdBooking.customerPhone,
            serviceNames: services.map((s: any) => s.name),
            stylistId: createdBooking.stylistId,
            entryType: "ONLINE",
            status: "WAITING",
            position: queueCount + 1,
            waitingTimeMinutes: queueCount * 20,
            estimatedStartTime: new Date(Date.now() + queueCount * 20 * 60000),
          },
        });
      }

      return createdBooking;
    });

    return res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/bookings - Get customer's own bookings or all bookings for Admin/Stylist
router.get("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    let where: any = {};
    if (userRole === "CUSTOMER") {
      where.customerId = userId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { bookingItems: true, stylist: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: bookings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PATCH /api/bookings/:id/status
router.patch("/:id/status", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { bookingItems: true, stylist: true },
    });

    // Sync with queue entry status
    if (status === "COMPLETED" || status === "CANCELLED") {
      await prisma.queueEntry.updateMany({
        where: { bookingId: id },
        data: { status: status === "COMPLETED" ? "COMPLETED" : "CANCELLED" },
      });
    }

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

export default router;
