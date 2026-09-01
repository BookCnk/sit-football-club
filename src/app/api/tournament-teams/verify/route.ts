import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, generation, password } = await request.json();
    if (!name || !generation || !password) {
      return NextResponse.json(
        { error: "กรอกข้อมูลไม่ครบ" },
        { status: 400 },
      );
    }

    const team = await prisma.tournamentTeam.findUnique({
      where: {
        name_generation: {
          name: String(name).trim(),
          generation: String(generation).trim(),
        },
      },
    });

    if (!team || !(await verifyPassword(String(password), team.passwordHash))) {
      return NextResponse.json(
        { error: "ไม่พบทีม หรือรหัสทีมไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        name: team.name,
        generation: team.generation,
        department: team.department,
        members: team.members,
      },
    });
  } catch (error) {
    console.error("[POST /api/tournament-teams/verify]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการตรวจสอบรหัส" },
      { status: 500 },
    );
  }
}
