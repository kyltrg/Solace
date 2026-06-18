import { prisma } from "@/lib/prisma";

async function main() {
  const result = await prisma.dream.deleteMany({});

  console.log(`Deleted ${result.count} dream(s)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });