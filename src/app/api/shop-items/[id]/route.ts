import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

type Params = { params: { id: string } };

// GET /api/shop-items/[id] — ดึงสินค้าตาม id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const item = await prisma.shopItem.findUnique({ where: { id } });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[GET /api/shop-items/:id]", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 },
    );
  }
}

// PATCH /api/shop-items/[id] — แก้ไขสินค้า (partial update)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    requireAdmin(req);
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await req.json();

    // ถ้ามี price แปลงเป็น number
    if (body.price !== undefined) body.price = Number(body.price);

    const item = await prisma.shopItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(item);
  } catch (error: unknown) {
    // P2025 = record not found
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[PATCH /api/shop-items/:id]", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 },
    );
  }
}

// DELETE /api/shop-items/[id] — ลบสินค้า
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    requireAdmin(_req);
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await prisma.shopItem.delete({ where: { id } });
    return NextResponse.json({ message: `Deleted item ${id}` });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[DELETE /api/shop-items/:id]", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 },
    );
  }
}
