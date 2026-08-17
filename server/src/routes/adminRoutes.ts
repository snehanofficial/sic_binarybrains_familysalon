import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/rbacMiddleware";
import { getOrCreateCustomerRole } from "../lib/roles";

const router = Router();

// GET /api/admin/metrics - Today's Revenue, Bookings Count, Waiting Customers, Peak Hours
router.get("/metrics", authenticateJWT, requirePermission("reports:view"), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: today } },
    });

    const todayRevenue = todayBookings.reduce((sum: number, b: any) => sum + (b.status === "COMPLETED" ? b.netPrice : 0), 0);
    const waitingCount = await prisma.queueEntry.count({ where: { status: "WAITING" } });
    const availableChairs = await prisma.stylist.count({ where: { isAvailable: true } });
    const totalStylists = await prisma.stylist.count();

    const popularServices = await prisma.bookingItem.groupBy({
      by: ["serviceName"],
      _count: { serviceName: true },
      orderBy: { _count: { serviceName: "desc" } },
      take: 5,
    });

    return res.json({
      success: true,
      data: {
        todayRevenue,
        todayBookingsCount: todayBookings.length,
        waitingCustomersCount: waitingCount,
        availableChairsCount: availableChairs,
        totalStylistsCount: totalStylists,
        peakHours: "2:00 PM - 5:00 PM",
        popularServices: popularServices.map((p: any) => ({ name: p.serviceName, count: p._count.serviceName })),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/admin/customers - Manage Customers
router.get("/customers", authenticateJWT, requirePermission("customer:manage"), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const customerRole = await getOrCreateCustomerRole();
    const customers = await prisma.user.findMany({
      where: { roleId: customerRole.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        status: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: customers });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PATCH /api/admin/customers/:id/status - Disable or Restore Customer
router.patch("/customers/:id/status", authenticateJWT, requirePermission("customer:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACTIVE or DISABLED

    const updated = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, email: true, name: true, status: true },
    });

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/admin/settings - Salon Operating Settings
router.get("/settings", async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await prisma.businessSettings.findUnique({ where: { id: "default" } });
    return res.json({ success: true, data: settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PUT /api/admin/settings - Update Settings
router.put("/settings", authenticateJWT, requirePermission("settings:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { openingHours, closingHours, workingDays, holidayDates, contactPhone, contactEmail, address, maxConcurrentBookings } = req.body;

    const updated = await prisma.businessSettings.upsert({
      where: { id: "default" },
      update: { openingHours, closingHours, workingDays, holidayDates, contactPhone, contactEmail, address, maxConcurrentBookings },
      create: { openingHours, closingHours, workingDays, holidayDates, contactPhone, contactEmail, address, maxConcurrentBookings },
    });

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/admin/audit-logs
router.get("/audit-logs", authenticateJWT, requirePermission("audit:view"), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });
    return res.json({ success: true, data: logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// Stylist CRUD
// POST /api/admin/stylists
router.post("/stylists", authenticateJWT, requirePermission("stylist:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, photoUrl, experience, specialization, workingHours, isAvailable } = req.body;

    const stylist = await prisma.stylist.create({
      data: {
        name,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
        experience,
        specialization,
        workingHours: workingHours || "9:00 AM - 8:00 PM",
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
    });

    return res.status(201).json({ success: true, data: stylist });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PUT /api/admin/stylists/:id
router.put("/stylists/:id", authenticateJWT, requirePermission("stylist:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, photoUrl, experience, specialization, workingHours, isAvailable } = req.body;

    const stylist = await prisma.stylist.update({
      where: { id },
      data: {
        name,
        photoUrl,
        experience,
        specialization,
        workingHours,
        isAvailable: isAvailable !== undefined ? isAvailable : undefined,
      },
    });

    return res.json({ success: true, data: stylist });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// DELETE /api/admin/stylists/:id
router.delete("/stylists/:id", authenticateJWT, requirePermission("stylist:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    try {
      const stylist = await prisma.stylist.delete({ where: { id } });
      return res.json({ success: true, data: stylist });
    } catch {
      // Soft deactivate if FK references exist
      const stylist = await prisma.stylist.update({
        where: { id },
        data: { isAvailable: false },
      });
      return res.json({ success: true, message: "Stylist has active appointments. Deactivated instead.", data: stylist });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// Offer CRUD
// POST /api/admin/offers
router.post("/offers", authenticateJWT, requirePermission("offer:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, code, description, discountType, discountValue, badge, category, isEnabled, validUntil } = req.body;

    const offer = await prisma.offer.create({
      data: {
        title,
        code,
        description,
        discountType: discountType || "PERCENTAGE",
        discountValue: parseFloat(discountValue),
        badge: badge || "Promo",
        category: category || "General",
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });

    return res.status(201).json({ success: true, data: offer });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PUT /api/admin/offers/:id
router.put("/offers/:id", authenticateJWT, requirePermission("offer:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, code, description, discountType, discountValue, badge, category, isEnabled, validUntil } = req.body;

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        title,
        code,
        description,
        discountType,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        badge,
        category,
        isEnabled: isEnabled !== undefined ? isEnabled : undefined,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });

    return res.json({ success: true, data: offer });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// DELETE /api/admin/offers/:id
router.delete("/offers/:id", authenticateJWT, requirePermission("offer:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const offer = await prisma.offer.delete({
      where: { id },
    });

    return res.json({ success: true, data: offer });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

export default router;
