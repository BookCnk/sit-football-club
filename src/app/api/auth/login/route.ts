import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

async function parseCredentials(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return request.json();
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData();
    return {
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    };
  }

  return request.json();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await parseCredentials(request);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const redirectTo = user.role === 'admin' ? '/dashboard' : '/';
    const forceRedirect = request.nextUrl.searchParams.get('redirect') === 'true';
    const acceptsHtml = (request.headers.get('accept') || '').includes('text/html');
    const secFetchMode = request.headers.get('sec-fetch-mode');
    const secFetchDest = request.headers.get('sec-fetch-dest');
    const contentType = request.headers.get('content-type') || '';
    const shouldRedirect =
      forceRedirect ||
      ((acceptsHtml || secFetchMode === 'navigate' || secFetchDest === 'document') &&
        !contentType.includes('application/json'));

    const response = shouldRedirect
      ? NextResponse.redirect(new URL(redirectTo, request.url), 303)
      : NextResponse.json({
          message: 'Login successful',
          redirectTo,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
