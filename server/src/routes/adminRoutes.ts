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

// GET /api/admin/stylists - Get all stylists (Admin Only)
router.get("/stylists", authenticateJWT, requirePermission("stylist:manage"), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stylists = await prisma.stylist.findMany({
      orderBy: { name: "asc" },
    });
    return res.json({ success: true, data: stylists });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// POST /api/admin/stylists - Create new stylist
router.post("/stylists", authenticateJWT, requirePermission("stylist:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, photoUrl, experience, specialization, rating, isAvailable, workingHours } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Name is required" } });
    }
    const stylist = await prisma.stylist.create({
      data: {
        name,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
        experience: experience || "1 year",
        specialization: specialization || "General Hair",
        rating: rating !== undefined ? parseFloat(rating) : 5.0,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        workingHours: workingHours || "9:00 AM - 8:00 PM",
      },
    });
    return res.status(201).json({ success: true, data: stylist });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PUT /api/admin/stylists/:id - Update stylist
router.put("/stylists/:id", authenticateJWT, requirePermission("stylist:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, photoUrl, experience, specialization, rating, isAvailable, workingHours } = req.body;
    const updated = await prisma.stylist.update({
      where: { id },
      data: {
        name,
        photoUrl,
        experience,
        specialization,
        rating: rating !== undefined ? parseFloat(rating) : undefined,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
        workingHours,
      },
    });
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// DELETE /api/admin/stylists/:id - Delete stylist
router.delete("/stylists/:id", authenticateJWT, requirePermission("stylist:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.stylist.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/admin/services - Get all services (Admin Only)
router.get("/services", authenticateJWT, requirePermission("service:manage"), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });
    return res.json({ success: true, data: services });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// POST /api/admin/services - Create service
router.post("/services", authenticateJWT, requirePermission("service:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, categoryId, durationMinutes, price, targetGender, targetAgeGroup, imageUrl, benefits, description, isEnabled } = req.body;
    if (!name || !categoryId || durationMinutes === undefined || price === undefined) {
      return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Name, categoryId, durationMinutes, and price are required." } });
    }
    const service = await prisma.service.create({
      data: {
        name,
        categoryId,
        durationMinutes: parseInt(durationMinutes),
        price: parseFloat(price),
        targetGender: targetGender || "Unisex",
        targetAgeGroup: targetAgeGroup || "All",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=480&h=220&fit=crop&auto=format",
        benefits: benefits || [],
        description: description || "",
        isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
      },
      include: { category: true },
    });
    return res.status(201).json({ success: true, data: service });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PUT /api/admin/services/:id - Update service
router.put("/services/:id", authenticateJWT, requirePermission("service:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, categoryId, durationMinutes, price, targetGender, targetAgeGroup, imageUrl, benefits, description, isEnabled } = req.body;
    const updated = await prisma.service.update({
      where: { id },
      data: {
        name,
        categoryId,
        durationMinutes: durationMinutes !== undefined ? parseInt(durationMinutes) : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        targetGender,
        targetAgeGroup,
        imageUrl,
        benefits,
        description,
        isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : undefined,
      },
      include: { category: true },
    });
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// DELETE /api/admin/services/:id - Delete service
router.delete("/services/:id", authenticateJWT, requirePermission("service:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/admin/offers - Get all offers (Admin Only)
router.get("/offers", authenticateJWT, requirePermission("offer:manage"), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: offers });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// POST /api/admin/offers - Create offer
router.post("/offers", authenticateJWT, requirePermission("offer:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, code, description, discountType, discountValue, badge, category, isEnabled, validUntil } = req.body;
    if (!title || !code || discountType === undefined || discountValue === undefined) {
      return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Title, code, discountType, and discountValue are required." } });
    }
    const offer = await prisma.offer.create({
      data: {
        title,
        code,
        description: description || "",
        discountType: discountType || "PERCENTAGE",
        discountValue: parseFloat(discountValue),
        badge: badge || "Promo",
        category: category || "All",
        isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });
    return res.status(201).json({ success: true, data: offer });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PUT /api/admin/offers/:id - Update offer
router.put("/offers/:id", authenticateJWT, requirePermission("offer:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, code, description, discountType, discountValue, badge, category, isEnabled, validUntil } = req.body;
    const updated = await prisma.offer.update({
      where: { id },
      data: {
        title,
        code,
        description,
        discountType,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        badge,
        category,
        isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : undefined,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// DELETE /api/admin/offers/:id - Delete offer
router.delete("/offers/:id", authenticateJWT, requirePermission("offer:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.offer.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

export default router;
