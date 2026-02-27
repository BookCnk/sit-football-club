import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type AdminTokenPayload = {
  userId: number;
  email: string;
  role: string;
};

export function requireAdmin(req: NextRequest): AdminTokenPayload {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET_MISSING");
  }

  const decoded = jwt.verify(token, secret) as AdminTokenPayload;

  if (decoded.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return decoded;
}

export function adminErrorResponse(error: unknown, fallbackMessage: string) {
  const code = error instanceof Error ? error.message : "";

  if (code === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  if (code === "FORBIDDEN") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  }

  if (code === "JWT_SECRET_MISSING") {
    return NextResponse.json(
      { error: "Server authentication is not configured" },
      { status: 500 },
    );
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
