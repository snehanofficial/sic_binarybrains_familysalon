import { prisma } from "./prisma";

export async function getOrCreateCustomerRole() {
  let customerRole = await prisma.role.findUnique({ where: { name: "CUSTOMER" } });
  if (!customerRole) {
    customerRole = await prisma.role.upsert({
      where: { name: "CUSTOMER" },
      update: {},
      create: {
        name: "CUSTOMER",
        description: "Standard salon customer",
      },
    });

    const defaultCustomerPerms = [
      { name: "booking:create", description: "Create new bookings" },
      { name: "booking:view_own", description: "View own bookings" },
      { name: "booking:cancel_own", description: "Cancel own bookings" },
      { name: "profile:update", description: "Update own profile" },
      { name: "service:view", description: "View service catalog" },
      { name: "queue:view", description: "View live queue status" },
    ];

    for (const p of defaultCustomerPerms) {
      const perm = await prisma.permission.upsert({
        where: { name: p.name },
        update: {},
        create: p,
      });

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: customerRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: customerRole.id, permissionId: perm.id },
      });
    }
  }
  return customerRole;
}
