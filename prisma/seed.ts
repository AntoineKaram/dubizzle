import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

async function main() {
  await prisma.category.create({
    data: {
      name: "Vehicles",
      subcategories: {
        create: [{ name: "Cars" }, { name: "Motorcycles" }, { name: "Trucks" }],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Electronics",
      subcategories: {
        create: [{ name: "Phones" }, { name: "Laptops" }, { name: "TVs" }],
      },
    },
  });
  await prisma.user.createMany({
    data: [
      {
        email: "admin@admin.com",
        name: "Admin",
        password:
          "$2b$10$SF321AQmyMcxPxdYFma0MeoOXf5RuU7dnKBkbmlVN9sF9FVRhp9Pq",
        role: "MODERATOR",
      },
      {
        email: "user1@dubizzle.com",
        name: "User 1",
        password:
          "$2b$10$SF321AQmyMcxPxdYFma0MeoOXf5RuU7dnKBkbmlVN9sF9FVRhp9Pq",
        role: "USER",
      },
      {
        email: "user2@dubizzle.com",
        name: "User 2",
        password:
          "$2b$10$SF321AQmyMcxPxdYFma0MeoOXf5RuU7dnKBkbmlVN9sF9FVRhp9Pq",
        role: "USER",
      },
      {
        email: "user 3@dubizzle.com",
        name: "User 3",
        password:
          "$2b$10$SF321AQmyMcxPxdYFma0MeoOXf5RuU7dnKBkbmlVN9sF9FVRhp9Pq",
        role: "USER",
      },
    ],
  });
  const categories = await prisma.category.findMany({
    include: { subcategories: true },
  });
  const users = await prisma.user.findMany({
    where: { role: "USER" }, // Only normal users
    take: 5,
  });
  if (!users.length || !categories.length) {
    console.log("⚠️ Cannot seed ads: users or categories missing.");
    return;
  }
  for (let i = 0; i < 100; i++) {
    const category = faker.helpers.arrayElement(categories);
    const subcategory = faker.helpers.arrayElement(category.subcategories);
    const user = faker.helpers.arrayElement(users);

    await prisma.ad.create({
      data: {
        id: uuidv4(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price({ min: 10, max: 10000 })),
        location: faker.location.city(),
        images: faker.helpers.arrayElements(
          [
            "https://ikre1994bt.ufs.sh/f/cPmUWwIpLI7BK9Ea8ZGfeE2z4isWrh5YulFqRAyOv9Zo1pMa",
            "https://ikre1994bt.ufs.sh/f/cPmUWwIpLI7BHRkbr1y8BJM4xP9YFTXvyw31dSonjbI6tUmz",
            "https://ikre1994bt.ufs.sh/f/cPmUWwIpLI7BDNBn1PWE4LzqKm8ngN5W6s1oBaUcRftvSpJZ",
            "https://ikre1994bt.ufs.sh/f/cPmUWwIpLI7BBGnpmqTPmOyXTVNgUtWlqQ6a3EKFAo0kvxHp",
          ],
          2
        ),
        status: faker.helpers.arrayElement(["PENDING", "APPROVED", "REJECTED"]),
        paymentOption: faker.helpers.arrayElement([
          "Cash",
          "Installments",
          "Cheque",
          "Other",
        ]),
        createdAt: faker.date.recent({ days: 30 }),
        createdBy: user.id,
        subcategoryId: subcategory.id,
        modifiedAt: new Date(),
        modifiedBy: user.id,
      },
    });
  }
  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
