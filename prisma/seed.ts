import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "System Administrator with full access" },
  });

  const stylistRole = await prisma.role.upsert({
    where: { name: "STYLIST" },
    update: {},
    create: { name: "STYLIST", description: "Salon Stylist with appointment & queue management access" },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER", description: "Standard salon customer" },
  });

  // 2. Permissions
  const permissionsList = [
    // Customer
    { name: "booking:create", description: "Create new bookings" },
    { name: "booking:view_own", description: "View own bookings" },
    { name: "booking:cancel_own", description: "Cancel own bookings" },
    { name: "profile:update", description: "Update own profile" },
    { name: "service:view", description: "View service catalog" },
    { name: "queue:view", description: "View live queue status" },

    // Stylist
    { name: "booking:view_assigned", description: "View assigned appointments" },
    { name: "booking:update_status", description: "Update booking status" },
    { name: "service:mark_completed", description: "Mark service as completed" },
    { name: "queue:register_walkin", description: "Register walk-in customer" },
    { name: "stylist:update_availability", description: "Toggle availability" },
    { name: "notes:view_customer", description: "View customer service notes" },

    // Admin
    { name: "customer:manage", description: "Manage customer accounts" },
    { name: "stylist:manage", description: "Manage stylists and schedules" },
    { name: "service:manage", description: "Manage service catalog and prices" },
    { name: "offer:manage", description: "Manage discount offers and packages" },
    { name: "reports:view", description: "View revenue and business analytics" },
    { name: "queue:manage", description: "Manage live queue entries" },
    { name: "audit:view", description: "View security audit logs" },
    { name: "settings:manage", description: "Manage salon business settings" },
  ];

  const permMap: Record<string, string> = {};
  for (const p of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
    permMap[p.name] = perm.id;
  }

  // 3. Assign Role Permissions
  // Admin permissions (all)
  for (const permId of Object.values(permMap)) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permId } },
      update: {},
      create: { roleId: adminRole.id, permissionId: permId },
    });
  }

  // Stylist permissions
  const stylistPerms = [
    "booking:view_assigned", "booking:update_status", "service:mark_completed",
    "queue:register_walkin", "stylist:update_availability", "notes:view_customer",
    "service:view", "queue:view", "profile:update",
  ];
  for (const pName of stylistPerms) {
    if (permMap[pName]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: stylistRole.id, permissionId: permMap[pName] } },
        update: {},
        create: { roleId: stylistRole.id, permissionId: permMap[pName] },
      });
    }
  }

  // Customer permissions
  const customerPerms = [
    "booking:create", "booking:view_own", "booking:cancel_own",
    "profile:update", "service:view", "queue:view",
  ];
  for (const pName of customerPerms) {
    if (permMap[pName]) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: customerRole.id, permissionId: permMap[pName] } },
        update: {},
        create: { roleId: customerRole.id, permissionId: permMap[pName] },
      });
    }
  }

  // 4. Default Business Settings
  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      openingHours: "09:00 AM",
      closingHours: "08:00 PM",
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      holidayDates: [],
      contactPhone: "+91 98765 43210",
      contactEmail: "hello@binarybrains.in",
      address: "42, 1st Cross, Koramangala 4th Block, Bangalore — 560034",
      maxConcurrentBookings: 4,
    },
  });

  // 5. Default Users & Password
  const passwordHash = await bcrypt.hash("Salon@12345", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@binarybrains.in" },
    update: {},
    create: {
      email: "admin@binarybrains.in",
      passwordHash,
      name: "Salon Admin",
      phone: "+91 98765 43210",
      roleId: adminRole.id,
      status: "ACTIVE",
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: "customer@binarybrains.in" },
    update: {},
    create: {
      email: "customer@binarybrains.in",
      passwordHash,
      name: "Priya Sharma",
      phone: "+91 98765 11111",
      roleId: customerRole.id,
      status: "ACTIVE",
    },
  });

  // 6. Stylists
  const stylistsData = [
    { name: "Preethi K", specialty: "Hair Colouring & Bridal", exp: "8 years", photo: "photo-1494790108377-be9c29b29330", email: "preethi@binarybrains.in" },
    { name: "Arjun M", specialty: "Grooming & Hair Cuts", exp: "6 years", photo: "photo-1500648767791-00dcc994a43e", email: "arjun@binarybrains.in" },
    { name: "Sneha R", specialty: "Skincare & Facials", exp: "5 years", photo: "photo-1438761681033-6461ffad8d80", email: "sneha@binarybrains.in" },
    { name: "Karthik S", specialty: "Beard & Men's Grooming", exp: "7 years", photo: "photo-1499996860823-5214fcc65f8f", email: "karthik@binarybrains.in" },
  ];

  for (const s of stylistsData) {
    const sUser = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        passwordHash,
        name: s.name,
        phone: "+91 98765 22222",
        roleId: stylistRole.id,
        status: "ACTIVE",
      },
    });

    await prisma.stylist.upsert({
      where: { userId: sUser.id },
      update: {},
      create: {
        userId: sUser.id,
        name: s.name,
        photoUrl: `https://images.unsplash.com/${s.photo}?w=80&h=80&fit=crop&auto=format`,
        experience: s.exp,
        specialization: s.specialty,
        rating: 4.9,
        isAvailable: true,
      },
    });
  }

  // 7. Categories & Services
  const categoriesData = [
    { name: "Hair", slug: "hair", description: "Cuts, colour, spa & styling for all hair types", icon: "Scissors" },
    { name: "Skin", slug: "skin", description: "Facials, cleanups & advanced skin treatments", icon: "Sparkles" },
    { name: "Grooming", slug: "grooming", description: "Beard styling, shaving & men's grooming packages", icon: "User" },
    { name: "Bridal", slug: "bridal", description: "Complete bridal packages for your most special day", icon: "Crown" },
    { name: "Kids", slug: "kids", description: "Gentle cuts with child-safe products by trained stylists", icon: "Baby" },
    { name: "Senior Care", slug: "senior", description: "Priority service with extra comfort for senior citizens", icon: "Heart" },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    catMap[c.slug] = cat.id;
  }

  const servicesData = [
    // Hair
    { name: "Hair Cut", categorySlug: "hair", durationMinutes: 45, price: 299, targetGender: "Unisex", targetAgeGroup: "All", image: "photo-1560066984-138dadb4c035", benefits: ["Precision cut", "Style consultation", "Blow dry finish"], description: "Professional hair cut tailored to your face shape." },
    { name: "Hair Spa", categorySlug: "hair", durationMinutes: 60, price: 599, targetGender: "Unisex", targetAgeGroup: "All", image: "photo-1522337360788-8b13dee7a37e", benefits: ["Deep conditioning", "Scalp massage", "Protein treatment"], description: "Nourishing spa treatment for healthy hair." },
    { name: "Hair Colour", categorySlug: "hair", durationMinutes: 90, price: 999, targetGender: "Unisex", targetAgeGroup: "Adult", image: "photo-1492106087820-71f1a00d2b11", benefits: ["Premium colour brands", "Patch test included", "Style finish"], description: "Vibrant and long-lasting hair coloring." },
    { name: "Smoothening", categorySlug: "hair", durationMinutes: 120, price: 2499, targetGender: "Female", targetAgeGroup: "Adult", image: "photo-1562322140-8baeececf3df", benefits: ["Frizz-free result", "Keratin treatment", "Long-lasting"], description: "Silky smoothening for sleek, manageable hair." },
    { name: "Hair Styling", categorySlug: "hair", durationMinutes: 30, price: 399, targetGender: "Unisex", targetAgeGroup: "All", image: "photo-1605497788044-5a32c7078486", benefits: ["Occasion styling", "Product included", "Expert finish"], description: "Occasion hair styling by expert hair artists." },

    // Skin
    { name: "Classic Facial", categorySlug: "skin", durationMinutes: 60, price: 799, targetGender: "Unisex", targetAgeGroup: "Adult", image: "photo-1570172619644-dfd03ed5d881", benefits: ["Deep cleansing", "Hydration boost", "Glow finish"], description: "Restorative facial for glowing, healthy skin." },
    { name: "Cleanup", categorySlug: "skin", durationMinutes: 30, price: 349, targetGender: "Unisex", targetAgeGroup: "All", image: "photo-1616394584738-fc6e612e71b9", benefits: ["Pore cleansing", "Blackhead removal", "Skin brightening"], description: "Quick refresh and blackhead removal." },
    { name: "De-tan Treatment", categorySlug: "skin", durationMinutes: 45, price: 499, targetGender: "Unisex", targetAgeGroup: "All", image: "photo-1596755389378-c31d21fd1273", benefits: ["Tan removal", "Even skin tone", "Nourishing mask"], description: "Effective sun tan removal therapy." },
    { name: "Skin Care Therapy", categorySlug: "skin", durationMinutes: 75, price: 1199, targetGender: "Female", targetAgeGroup: "Adult", image: "photo-1535914254981-b5012eebbd15", benefits: ["Customised treatment", "Anti-aging", "Vitamin infusion"], description: "Advanced skincare therapy tailored for your skin type." },

    // Grooming
    { name: "Beard Styling", categorySlug: "grooming", durationMinutes: 30, price: 199, targetGender: "Male", targetAgeGroup: "Adult", image: "photo-1503951914875-452162b0f3f1", benefits: ["Shape & define", "Beard oil treatment", "Clean edges"], description: "Precision beard trim and edge styling." },
    { name: "Clean Shave", categorySlug: "grooming", durationMinutes: 20, price: 149, targetGender: "Male", targetAgeGroup: "All", image: "photo-1621605815971-fbc98d665033", benefits: ["Hot towel prep", "Precision blade", "Aftercare lotion"], description: "Traditional hot towel clean shave." },
    { name: "Grooming Package", categorySlug: "grooming", durationMinutes: 90, price: 799, targetGender: "Male", targetAgeGroup: "Adult", image: "photo-1599351431202-1e0f0137899a", benefits: ["Cut + Beard + Facial", "Best value", "Complete grooming"], description: "Complete head-to-toe men's grooming combo." },

    // Bridal
    { name: "Bridal Makeup", categorySlug: "bridal", durationMinutes: 180, price: 8999, targetGender: "Female", targetAgeGroup: "Adult", image: "photo-1519741497674-611481863552", benefits: ["HD makeup", "Trial session included", "All-day lasting"], description: "Flawless HD bridal makeup with trial included." },
    { name: "Reception Look", categorySlug: "bridal", durationMinutes: 120, price: 5999, targetGender: "Female", targetAgeGroup: "Adult", image: "photo-1537633552985-df8429e8048b", benefits: ["Glamour finish", "Draping assistance", "Touch-up kit"], description: "Elegant reception makeup and hair styling." },

    // Kids
    { name: "Kids Haircut", categorySlug: "kids", durationMinutes: 30, price: 199, targetGender: "Unisex", targetAgeGroup: "Kids", image: "photo-1560869713-da86bd3b8c49", benefits: ["Child-safe products", "Fun environment", "Patient stylists"], description: "Gentle, fun haircut for toddlers and kids." },

    // Senior
    { name: "Senior Haircut", categorySlug: "senior", durationMinutes: 45, price: 249, targetGender: "Unisex", targetAgeGroup: "Senior", image: "photo-1573497701240-345a300b8d36", benefits: ["Comfort seating", "Gentle handling", "Priority service"], description: "Comfort-focused haircut service for senior citizens." },
  ];

  for (const s of servicesData) {
    const categoryId = catMap[s.categorySlug];
    if (categoryId) {
      await prisma.service.create({
        data: {
          name: s.name,
          categoryId,
          durationMinutes: s.durationMinutes,
          price: s.price,
          targetGender: s.targetGender,
          targetAgeGroup: s.targetAgeGroup,
          imageUrl: `https://images.unsplash.com/${s.image}?w=480&h=220&fit=crop&auto=format`,
          benefits: s.benefits,
          description: s.description,
          isEnabled: true,
        },
      });
    }
  }

  // 8. Offers
  const offersData = [
    { title: "Student Offer", code: "STUDENT20", desc: "20% off on all hair services with a valid student ID.", discountType: "PERCENTAGE" as const, discountValue: 20, badge: "Students", category: "Hair" },
    { title: "Family Package", code: "FAMILY15", desc: "Book 3+ services together and get 15% off the total.", discountType: "PERCENTAGE" as const, discountValue: 15, badge: "Family", category: "Combo" },
    { title: "Senior Discount", code: "SENIOR15", desc: "Flat 15% off for all senior citizens. Always.", discountType: "PERCENTAGE" as const, discountValue: 15, badge: "Seniors", category: "Senior" },
    { title: "Referral Rewards", code: "REFER200", desc: "Refer a friend and both get ₹200 off your next visit.", discountType: "FIXED_AMOUNT" as const, discountValue: 200, badge: "Referral", category: "All" },
  ];

  for (const o of offersData) {
    await prisma.offer.upsert({
      where: { code: o.code },
      update: {},
      create: {
        title: o.title,
        code: o.code,
        description: o.desc,
        discountType: o.discountType,
        discountValue: o.discountValue,
        badge: o.badge,
        category: o.category,
        isEnabled: true,
      },
    });
  }

  // 9. Initial Queue Entries
  const firstStylist = await prisma.stylist.findFirst();
  await prisma.queueEntry.create({
    data: {
      customerName: "Rahul Sharma (Walk-in)",
      customerPhone: "+91 98765 33333",
      serviceNames: ["Hair Cut", "Beard Styling"],
      stylistId: firstStylist?.id,
      entryType: "WALK_IN",
      status: "IN_SERVICE",
      position: 1,
      waitingTimeMinutes: 0,
      startedAt: new Date(),
    },
  });

  await prisma.queueEntry.create({
    data: {
      customerName: "Ananya Krishnan",
      customerPhone: "+91 98765 44444",
      serviceNames: ["Classic Facial"],
      entryType: "ONLINE",
      status: "WAITING",
      position: 2,
      waitingTimeMinutes: 25,
      estimatedStartTime: new Date(Date.now() + 25 * 60000),
    },
  });

  console.log("Seeding complete! Admin user: admin@binarybrains.in / Salon@12345");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
