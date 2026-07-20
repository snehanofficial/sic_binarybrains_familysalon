import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/rbacMiddleware";

const router = Router();

// GET /api/queue - Fetch live queue with position calculations and wait times
router.get("/", async (_req: Request, res: Response) => {
  try {
    const queueEntries = await prisma.queueEntry.findMany({
      where: { status: { in: ["WAITING", "IN_SERVICE"] } },
      include: { stylist: true, booking: true },
      orderBy: { position: "asc" },
    });

    const activeStylists = await prisma.stylist.count({ where: { isAvailable: true } });
    const currentlyServing = queueEntries.filter((q: any) => q.status === "IN_SERVICE");
    const waitingList = queueEntries.filter((q: any) => q.status === "WAITING");

    let accumulatedWaitTime = 0;
    const items = queueEntries.map((q: any, idx: number) => {
      if (q.status === "IN_SERVICE") {
        return { ...q, calculatedWaitMinutes: 0 };
      }
      accumulatedWaitTime += 15;
      return {
        ...q,
        calculatedWaitMinutes: Math.max(5, accumulatedWaitTime),
      };
    });

    return res.json({
      success: true,
      data: {
        totalWaiting: waitingList.length,
        currentlyServingCount: currentlyServing.length,
        availableStylistsCount: activeStylists || 4,
        averageWaitMinutes: waitingList.length > 0 ? Math.round((waitingList.length * 15) / Math.max(1, activeStylists)) : 0,
        entries: items,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// POST /api/queue/walkin - Stylist / Admin registers walk-in customer
router.post("/walkin", authenticateJWT, requirePermission("queue:register_walkin"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customerName, customerPhone, serviceNames, stylistId } = req.body;

    const waitingCount = await prisma.queueEntry.count({
      where: { status: { in: ["WAITING", "IN_SERVICE"] } },
    });

    const newEntry = await prisma.queueEntry.create({
      data: {
        customerName,
        customerPhone: customerPhone || null,
        serviceNames: serviceNames || ["Walk-in Service"],
        stylistId: stylistId || null,
        entryType: "WALK_IN",
        status: "WAITING",
        position: waitingCount + 1,
        waitingTimeMinutes: waitingCount * 15,
        estimatedStartTime: new Date(Date.now() + waitingCount * 15 * 60000),
      },
    });

    return res.status(201).json({ success: true, data: newEntry });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// PATCH /api/queue/:id/status - Update queue entry status (IN_SERVICE, COMPLETED, SKIPPED, CANCELLED)
router.patch("/:id/status", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // IN_SERVICE, COMPLETED, SKIPPED, CANCELLED

    const updated = await prisma.queueEntry.update({
      where: { id },
      data: {
        status,
        startedAt: status === "IN_SERVICE" ? new Date() : undefined,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    // Recalculate remaining positions
    if (["COMPLETED", "SKIPPED", "CANCELLED"].includes(status)) {
      const remaining = await prisma.queueEntry.findMany({
        where: { status: "WAITING" },
        orderBy: { createdAt: "asc" },
      });

      for (let i = 0; i < remaining.length; i++) {
        await prisma.queueEntry.update({
          where: { id: remaining[i].id },
          data: { position: i + 1, waitingTimeMinutes: i * 15 },
        });
      }
    }

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

export default router;
