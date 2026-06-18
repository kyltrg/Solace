-- CreateEnum
CREATE TYPE "DreamStatus" AS ENUM ('PLANNING', 'SAVING', 'BOOKED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Dream" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "DreamStatus" NOT NULL DEFAULT 'PLANNING',
    "targetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dream_pkey" PRIMARY KEY ("id")
);
