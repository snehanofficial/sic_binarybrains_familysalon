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

export default router;
