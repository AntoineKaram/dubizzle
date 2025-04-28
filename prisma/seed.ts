import { prisma } from "@/lib/prisma";

async function main() {
  const vehicles = await prisma.category.create({
    data: {
      name: "Vehicles",
      subcategories: {
        create: [{ name: "Cars" }, { name: "Motorcycles" }, { name: "Trucks" }],
      },
    },
  });

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      subcategories: {
        create: [{ name: "Phones" }, { name: "Laptops" }, { name: "TVs" }],
      },
    },
  });

  console.log({ vehicles, electronics });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
