import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  hashTokenString,
  verifyRefreshToken,
} from "../lib/auth";
import { getUserPermissions } from "../lib/permissions";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateMiddleware";
import { getOrCreateCustomerRole } from "../lib/roles";

const router = Router();

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// POST /api/auth/register
router.post("/register", validateBody(registerSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: "EMAIL_EXISTS", message: "An account with this email already exists." },
      });
    }

    const customerRole = await getOrCreateCustomerRole();

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        roleId: customerRole.id,
        status: "ACTIVE",
      },
    });

    const permissions = await getUserPermissions(user.id);
    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: "CUSTOMER", permissions });
    const { token: refreshToken, hash: refreshHash } = generateRefreshToken({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        tokenHash: refreshHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: "CUSTOMER", permissions },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// POST /api/auth/login
router.post("/login", validateBody(loginSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || user.status === "DISABLED") {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." },
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." },
      });
    }

    const permissions = await getUserPermissions(user.id);
    const roleName = user.role?.name || "CUSTOMER";
    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: roleName, permissions });
    const { token: refreshToken, hash: refreshHash } = generateRefreshToken({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        tokenHash: refreshHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setRefreshCookie(res, refreshToken);

    return res.json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: roleName, permissions },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: { code: "NO_REFRESH_TOKEN", message: "Refresh token cookie missing." } });
    }

    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, error: { code: "INVALID_REFRESH_TOKEN", message: "Refresh token expired or invalid." } });
    }

    const hash = hashTokenString(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({ where: { tokenHash: hash } });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, error: { code: "REVOKED_REFRESH_TOKEN", message: "Refresh token revoked or expired." } });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId }, include: { role: true } });
    if (!user || user.status === "DISABLED") {
      clearRefreshCookie(res);
      return res.status(401).json({ success: false, error: { code: "USER_DISABLED", message: "User account disabled." } });
    }

    // Token Rotation: revoke old refresh token, generate new pair
    await prisma.refreshToken.update({ where: { id: storedToken.id }, data: { revoked: true } });

    const permissions = await getUserPermissions(user.id);
    const roleName = user.role?.name || "CUSTOMER";
    const newAccessToken = generateAccessToken({ userId: user.id, email: user.email, role: roleName, permissions });
    const { token: newRefreshToken, hash: newHash } = generateRefreshToken({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        tokenHash: newHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setRefreshCookie(res, newRefreshToken);

    return res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: roleName, permissions },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// POST /api/auth/logout
router.post("/logout", async (req: AuthenticatedRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    const hash = hashTokenString(refreshToken);
    await prisma.refreshToken.updateMany({ where: { tokenHash: hash }, data: { revoked: true } }).catch(() => {});
  }
  clearRefreshCookie(res);
  return res.json({ success: true, message: "Logged out successfully." });
});

// GET /api/auth/me
router.get("/me", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found." } });
    }

    const permissions = await getUserPermissions(user.id);
    const roleName = user.role?.name || "CUSTOMER";

    return res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: roleName, permissions },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
  }
});

export default router;
