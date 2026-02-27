import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminErrorResponse, requireAdmin } from '@/lib/requireAdmin';

const VALID_ORDER_STATUSES = new Set(['pending', 'verified', 'completed', 'cancelled']);

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    requireAdmin(request);

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const body = (await request.json()) as {
      status?: string;
    };

    const status = typeof body.status === 'string' ? body.status.trim().toLowerCase() : '';
    if (!VALID_ORDER_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 });
    }

    const order = await prisma.shopOrder.update({
      where: { id },
      data: { status },
      include: {
        shopItem: {
          select: {
            id: true,
            name: true,
            subtitle: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    console.error('[PATCH /api/orders/:id]', error);
    return adminErrorResponse(error, 'Failed to update order.');
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    requireAdmin(request);

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await prisma.shopOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: `Deleted order ${id}` });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    console.error('[DELETE /api/orders/:id]', error);
    return adminErrorResponse(error, 'Failed to delete order.');
  }
}
