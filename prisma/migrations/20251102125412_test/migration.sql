-- CreateEnum
CREATE TYPE "Cadence" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "bodyMd" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "meta" JSONB NOT NULL DEFAULT '{}',
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cadence" "Cadence" NOT NULL DEFAULT 'DAILY',
    "tz" TEXT NOT NULL DEFAULT 'Europe/Vienna',
    "graceDays" INTEGER NOT NULL DEFAULT 1,
    "lastHitOn" DATE,
    "currentLen" INTEGER NOT NULL DEFAULT 0,
    "longestLen" INTEGER NOT NULL DEFAULT 0,
    "startedOn" DATE,
    "endedOn" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreakHit" (
    "id" TEXT NOT NULL,
    "streakId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "source" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StreakHit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StreakHit_streakId_day_idx" ON "StreakHit"("streakId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "StreakHit_streakId_day_key" ON "StreakHit"("streakId", "day");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreakHit" ADD CONSTRAINT "StreakHit_streakId_fkey" FOREIGN KEY ("streakId") REFERENCES "Streak"("id") ON DELETE CASCADE ON UPDATE CASCADE;
