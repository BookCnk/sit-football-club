import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminErrorResponse, requireAdmin } from "@/lib/requireAdmin";

// GET /api/shop-items — ดึงรายการสินค้าทั้งหมด
export async function GET() {
  try {
    const items = await prisma.shopItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[GET /api/shop-items]", error);
    return NextResponse.json(
      { error: "Failed to fetch shop items" },
      { status: 500 },
    );
  }
}

// POST /api/shop-items — สร้างสินค้าใหม่
export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const {
      name,
      subtitle,
      price,
      badge,
      images,
      sizes,
      description,
      payment,
      shipping,
    } = body;

    if (!name || price === undefined || !images || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, images, description" },
        { status: 400 },
      );
    }

    const item = await prisma.shopItem.create({
      data: {
        name,
        subtitle,
        price: Number(price),
        badge,
        images,
        sizes,
        description,
        payment,
        shipping,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[POST /api/shop-items]", error);
    return adminErrorResponse(error, "Failed to create shop item");
  }
}
