import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminErrorResponse, requireAdmin } from '@/lib/requireAdmin';
import { createAdminClient, ensurePublicBucket } from '@/lib/supabase/admin';

const ORDER_SLIP_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_ORDER_SLIP_BUCKET || 'payment-slips';
const MAX_SLIP_SIZE_BYTES = 5 * 1024 * 1024;

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function getSizeList(sizes: unknown) {
  if (!Array.isArray(sizes)) {
    return [];
  }

  return sizes
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);
}

function getSafeFileExtension(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || 'png';
  return extension.replace(/[^a-z0-9]/g, '') || 'png';
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') || '10')));
    const status = normalizeText(searchParams.get('status'));
    const search = normalizeText(searchParams.get('search'));

    const where = {
      ...(status && status !== 'all' ? { status } : {}),
      ...(search
        ? {
            OR: [
              { contactPhone: { contains: search, mode: 'insensitive' as const } },
              { contactEmail: { contains: search, mode: 'insensitive' as const } },
              { screenName: { contains: search, mode: 'insensitive' as const } },
              { shopItem: { name: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };

    const [total, orders] = await Promise.all([
      prisma.shopOrder.count({ where }),
      prisma.shopOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
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
      }),
    ]);

    return NextResponse.json({
      data: orders,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (error) {
    console.error('[GET /api/orders]', error);
    return adminErrorResponse(error, 'Failed to fetch orders.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const shopItemId = Number(normalizeText(formData.get('shopItemId')));
    const contactPhone = normalizeText(formData.get('contactPhone'));
    const contactEmail = normalizeText(formData.get('contactEmail'));
    const selectedSize = normalizeText(formData.get('selectedSize'));
    const screenName = normalizeText(formData.get('screenName'));
    const screenNumber = normalizeText(formData.get('screenNumber'));
    const slipFile = formData.get('slipFile');

    if (!Number.isInteger(shopItemId) || shopItemId <= 0) {
      return NextResponse.json({ error: 'Invalid shop item.' }, { status: 400 });
    }

    if (!contactPhone || contactPhone.length < 8) {
      return NextResponse.json({ error: 'Contact phone is required.' }, { status: 400 });
    }

    if (!contactEmail || !contactEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid contact email is required.' }, { status: 400 });
    }

    if (!(slipFile instanceof File) || slipFile.size <= 0) {
      return NextResponse.json({ error: 'Slip image is required.' }, { status: 400 });
    }

    if (!slipFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Slip must be an image file.' }, { status: 400 });
    }

    if (slipFile.size > MAX_SLIP_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Slip image must be 5MB or smaller.' },
        { status: 400 },
      );
    }

    const item = await prisma.shopItem.findUnique({
      where: { id: shopItemId },
      select: {
        id: true,
        sizes: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Shop item not found.' }, { status: 404 });
    }

    const availableSizes = getSizeList(item.sizes);
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      return NextResponse.json({ error: 'Please select a valid size.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    await ensurePublicBucket(supabase, ORDER_SLIP_BUCKET);
    const fileExtension = getSafeFileExtension(slipFile.name);
    const filePath = `shop-orders/${shopItemId}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(ORDER_SLIP_BUCKET)
      .upload(filePath, slipFile, {
        contentType: slipFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[POST /api/orders] slip upload failed', uploadError);
      return NextResponse.json(
        {
          error: `Slip upload failed for bucket "${ORDER_SLIP_BUCKET}". Check SUPABASE_SERVICE_ROLE_KEY and Supabase storage access.`,
        },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(ORDER_SLIP_BUCKET)
      .getPublicUrl(filePath);

    const order = await prisma.shopOrder.create({
      data: {
        shopItemId,
        contactPhone,
        contactEmail,
        selectedSize: selectedSize || null,
        screenName: screenName || null,
        screenNumber: screenNumber || null,
        slipImageUrl: publicUrlData.publicUrl,
        slipFilePath: filePath,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Order submitted successfully.',
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/orders]', error);
    if (
      error instanceof Error &&
      error.message.includes('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY')
    ) {
      return NextResponse.json(
        {
          error: 'Slip upload is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the server.',
        },
        { status: 500 },
      );
    }

    if (
      error instanceof Error &&
      error.message.includes('SUPABASE_SERVICE_ROLE_KEY is invalid')
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    if (error instanceof Error && error.message.includes('Supabase')) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit order.' },
      { status: 500 },
    );
  }
}
