-- CreateTable
CREATE TABLE "shop_items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "price" INTEGER NOT NULL,
    "badge" TEXT,
    "images" JSONB NOT NULL,
    "sizes" JSONB,
    "description" TEXT NOT NULL,
    "payment" TEXT,
    "shipping" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shop_items_pkey" PRIMARY KEY ("id")
);
