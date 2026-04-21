import "dotenv/config";
import pg from "pg";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
//const { PrismaClient, Prisma } = pkg;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Creamos el adaptador
const adapter = new PrismaPg(pool);

// 3. Inicializamos el cliente con el adaptador
const prisma = new PrismaClient({ adapter });

async function main() {
  // Delete existing data to avoid duplicates and preserve referential integrity
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  await prisma.user.createMany({
    data: [
      {
        id: "de24a23d-c341-4383-bbe5-e22a4a992e50",
        username: "admin",
        role: "admin",
      },
      {
        id: "6f107eba-cc5e-411c-9d01-65b660b797d5",
        username: "employee",
        role: "employee",
      },
      {
        id: "0302b873-057f-4d61-962c-f95ca0c78bd1",
        username: "customer",
        role: "customer",
      },
    ],
  });

  // Create products
  const productsData = [
    {
      id: "124dccfb-3dd5-4939-9657-086d4d6bb193",
      name: "Basic Keyboard",
      price: new Prisma.Decimal("29.99"),
      current_stock: 25,
      min_stock: 5,
    },
    {
      id: "2f3e6082-ad4a-4a53-bfb4-50a24d5a4808",
      name: "Ergonomic Mouse",
      price: new Prisma.Decimal("19.99"),
      current_stock: 18,
      min_stock: 5,
    },
    {
      id: "3e4a7193-bc5b-4b64-c0c5-61b35e6b5919",
      name: "USB-C Cable",
      price: new Prisma.Decimal("9.99"),
      current_stock: 45,
      min_stock: 10,
    },
    {
      id: "4f5b8204-cd6c-5c75-d1d6-72c46f7c6020",
      name: "Wireless Charger",
      price: new Prisma.Decimal("34.99"),
      current_stock: 12,
      min_stock: 5,
    },
    {
      id: "5a6c9315-de7d-6d86-e2e7-83d5708d7131",
      name: "Webcam HD",
      price: new Prisma.Decimal("49.99"),
      current_stock: 10,
      min_stock: 3,
    },
    {
      id: "6b7d0426-ef8e-7e97-f3f8-94e6819e8242",
      name: "Laptop Stand",
      price: new Prisma.Decimal("39.99"),
      current_stock: 20,
      min_stock: 5,
    },
    {
      id: "7c8e1537-f09f-8fa8-0409-a5f792af9353",
      name: "Desk Lamp",
      price: new Prisma.Decimal("24.99"),
      current_stock: 30,
      min_stock: 5,
    },
    {
      id: "8d9f2648-01af-90b9-1510-b60803bf0464",
      name: "Noise-Cancelling Headset",
      price: new Prisma.Decimal("79.99"),
      current_stock: 8,
      min_stock: 3,
    },
    {
      id: "9e0a3759-12bf-01ca-2621-c71914c01575",
      name: "Smart Speaker",
      price: new Prisma.Decimal("59.99"),
      current_stock: 15,
      min_stock: 5,
    },
    {
      id: "0f1b4860-23ca-12db-3732-d82025d12686",
      name: "Portable SSD",
      price: new Prisma.Decimal("99.99"),
      current_stock: 14,
      min_stock: 5,
    },
  ];

  await prisma.product.createMany({ data: productsData });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed successfully.");
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
