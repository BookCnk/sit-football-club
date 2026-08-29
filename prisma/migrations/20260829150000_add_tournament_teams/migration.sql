-- CreateTable
CREATE TABLE "tournament_teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "generation" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "members" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tournament_teams_name_generation_key" ON "tournament_teams"("name", "generation");
