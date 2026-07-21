import { prisma } from "./prisma";

export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.role) return [];
  return user.role.rolePermissions.map((rp: any) => rp.permission.name);
}

export function checkPermission(userPermissions: string[], requiredPermission: string): boolean {
  if (userPermissions.includes("admin:all") || userPermissions.includes("settings:manage")) {
    return true; // Admin bypass
  }
  return userPermissions.includes(requiredPermission);
}
