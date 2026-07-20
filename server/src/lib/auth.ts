import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Response } from "express";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "super-secret-access-key-binary-brains-2026";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super-secret-refresh-key-binary-brains-2026";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: { userId: string }): { token: string; hash: string } => {
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
};

export const hashTokenString = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
    expires: new Date(0),
  });
};
