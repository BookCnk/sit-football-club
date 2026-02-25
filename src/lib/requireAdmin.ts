import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { log } from "console";

export function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const cookies = req.cookies.getAll();
  console.log(cookies);
  console.log(req.cookies.get("token"));
  console.log(token);

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET_MISSING");
  }

  const decoded = jwt.verify(token, secret) as {
    userId: number;
    email: string;
    role: string;
  };

  if (decoded.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return decoded; // เผื่ออยากใช้ userId ต่อ
}
