import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import { checkPermission } from "../lib/permissions";

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const hasAccess = checkPermission(req.user.permissions || [], permission);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Access denied. Permission '${permission}' is required to perform this action.`,
        },
      });
    }

    next();
  };
};
