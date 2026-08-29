import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const departments = ["IT", "CS", "DSI"] as const;

function parseTeam(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const { name, generation, department, members, password } = body as Record<string, unknown>;
  const cleanMembers = Array.isArray(members)
    ? members.filter((member): member is string => typeof member === "string").map((member) => member.trim()).filter(Boolean)
    : [];

  if (
    typeof name !== "string" || !name.trim() ||
    typeof generation !== "string" || !generation.trim() ||
    !departments.includes(department as (typeof departments)[number]) ||
    !cleanMembers.length || cleanMembers.length > 30 ||
    typeof password !== "string" || password.length < 6
  ) return null;

  return { name: name.trim(), generation: generation.trim(), department: department as (typeof departments)[number], members: cleanMembers, password };
}

export async function POST(request: NextRequest) {
  try {
    const team = parseTeam(await request.json());
    if (!team) return NextResponse.json({ error: "กรอกข้อมูลให้ครบ รหัสอย่างน้อย 6 ตัวอักษร และสมาชิกไม่เกิน 30 คน" }, { status: 400 });

    const created = await prisma.tournamentTeam.create({
      data: {
        name: team.name,
        generation: team.generation,
        department: team.department,
        members: team.members,
        passwordHash: await hashPassword(team.password),
      },
      select: { id: true, name: true, generation: true, department: true, members: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "มีทีมชื่อนี้ในรุ่นนี้แล้ว" }, { status: 409 });
    }
    console.error("[POST /api/tournament-teams]", error);
    return NextResponse.json({ error: "บันทึกทีมไม่สำเร็จ" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const team = parseTeam(await request.json());
    if (!team) return NextResponse.json({ error: "กรอกข้อมูลให้ครบ รหัสอย่างน้อย 6 ตัวอักษร และสมาชิกไม่เกิน 30 คน" }, { status: 400 });

    const existing = await prisma.tournamentTeam.findUnique({
      where: { name_generation: { name: team.name, generation: team.generation } },
    });
    if (!existing || !(await verifyPassword(team.password, existing.passwordHash))) {
      return NextResponse.json({ error: "ไม่พบทีม หรือรหัสทีมไม่ถูกต้อง" }, { status: 401 });
    }

    const updated = await prisma.tournamentTeam.update({
      where: { id: existing.id },
      data: { department: team.department, members: team.members },
      select: { id: true, name: true, generation: true, department: true, members: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/tournament-teams]", error);
    return NextResponse.json({ error: "แก้ไขทีมไม่สำเร็จ" }, { status: 500 });
  }
}
