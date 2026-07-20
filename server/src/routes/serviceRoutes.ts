import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/authMiddleware";
import { requirePermission } from "../middlewares/rbacMiddleware";

const router = Router();

// GET /api/services - Filterable by category, gender, ageGroup, search, maxPrice
router.get("/services", async (req: Request, res: Response) => {
  try {
    const { category, gender, ageGroup, search, maxPrice } = req.query;

    const where: any = { isEnabled: true };

    if (category) {
      where.category = { slug: String(category) };
    }
    if (gender && gender !== "All") {
      where.targetGender = { in: [String(gender), "Unisex"] };
    }
    if (ageGroup && ageGroup !== "All") {
      where.targetAgeGroup = { in: [String(ageGroup), "All"] };
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }
    if (maxPrice) {
      where.price = { lte: parseFloat(String(maxPrice)) };
    }

    const services = await prisma.service.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
    });

    return res.json({ success: true, data: services });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/categories
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { services: true } } },
    });
    return res.json({ success: true, data: categories });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/stylists
router.get("/stylists", async (_req: Request, res: Response) => {
  try {
    const stylists = await prisma.stylist.findMany({
      orderBy: { rating: "desc" },
    });
    return res.json({ success: true, data: stylists });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/offers
router.get("/offers", async (_req: Request, res: Response) => {
  try {
    const offers = await prisma.offer.findMany({
      where: { isEnabled: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: offers });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// GET /api/reviews
router.get("/reviews", async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: reviews });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// POST /api/services (Admin only)
router.post("/services", authenticateJWT, requirePermission("service:manage"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, categoryId, durationMinutes, price, targetGender, targetAgeGroup, imageUrl, benefits, description } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        categoryId,
        durationMinutes: parseInt(durationMinutes),
        price: parseFloat(price),
        targetGender: targetGender || "Unisex",
        targetAgeGroup: targetAgeGroup || "All",
        imageUrl,
        benefits: benefits || [],
        description: description || "",
      },
    });

    return res.status(201).json({ success: true, data: service });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

export default router;
