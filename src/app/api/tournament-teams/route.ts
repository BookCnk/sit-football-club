import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const departments = ["IT", "CS", "DSI"] as const;

const teamSelect = {
  id: true,
  name: true,
  generation: true,
  department: true,
  members: true,
} as const;

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
      select: teamSelect,
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

export async function GET() {
  try {
    const teams = await prisma.tournamentTeam.findMany({
      select: teamSelect,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error("[GET /api/tournament-teams]", error);
    return NextResponse.json({ error: "โหลดรายชื่อทีมไม่สำเร็จ" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    let isAdmin = false;
    try {
      requireAdmin(request);
      isAdmin = true;
    } catch {
      isAdmin = false;
    }

    if (isAdmin) {
      const { id, name, generation, department, members, password } = body ?? {};
      let targetTeam = null;

      if (typeof id === "number" || (typeof id === "string" && !isNaN(Number(id)))) {
        targetTeam = await prisma.tournamentTeam.findUnique({ where: { id: Number(id) } });
      } else if (typeof name === "string" && typeof generation === "string") {
        targetTeam = await prisma.tournamentTeam.findUnique({
          where: { name_generation: { name: name.trim(), generation: generation.trim() } },
        });
      }

      if (!targetTeam) {
        return NextResponse.json({ error: "ไม่พบทีมที่ต้องการแก้ไข" }, { status: 404 });
      }

      const cleanMembers = Array.isArray(members)
        ? members.filter((m): m is string => typeof m === "string").map((m) => m.trim()).filter(Boolean)
        : targetTeam.members;

      const updateData: { department?: (typeof departments)[number]; members?: string[]; passwordHash?: string } = {
        department: departments.includes(department) ? department : (targetTeam.department as (typeof departments)[number]),
        members: cleanMembers.length ? cleanMembers : targetTeam.members,
      };

      if (typeof password === "string" && password.length >= 6) {
        updateData.passwordHash = await hashPassword(password);
      }

      const updated = await prisma.tournamentTeam.update({
        where: { id: targetTeam.id },
        data: updateData,
        select: teamSelect,
      });

      return NextResponse.json(updated);
    }

    // Non-admin patch logic (requires password)
    const team = parseTeam(body);
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
      select: teamSelect,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/tournament-teams]", error);
    return NextResponse.json({ error: "แก้ไขทีมไม่สำเร็จ" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, generation, password } = body ?? {};

    // Check if request is from admin
    let isAdmin = false;
    try {
      requireAdmin(request);
      isAdmin = true;
    } catch {
      isAdmin = false;
    }

    if (isAdmin) {
      let targetId: number | undefined = typeof id === "number" ? id : undefined;
      if (!targetId && typeof id === "string" && !isNaN(Number(id))) {
        targetId = Number(id);
      }
      if (!targetId && typeof name === "string" && typeof generation === "string") {
        const existing = await prisma.tournamentTeam.findUnique({
          where: {
            name_generation: {
              name: name.trim(),
              generation: generation.trim(),
            },
          },
        });
        targetId = existing?.id;
      }

      if (!targetId) {
        return NextResponse.json({ error: "ไม่พบทีมที่ต้องการลบ" }, { status: 404 });
      }

      await prisma.tournamentTeam.delete({
        where: { id: targetId },
      });

      return NextResponse.json({ success: true, id: targetId });
    }

    // Non-admin delete logic (requires password)
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof generation !== "string" ||
      !generation.trim() ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return NextResponse.json(
        { error: "กรอกข้อมูลไม่ครบถ้วน หรือรหัสอย่างน้อย 6 ตัวอักษร" },
        { status: 400 },
      );
    }

    const existing = await prisma.tournamentTeam.findUnique({
      where: {
        name_generation: {
          name: name.trim(),
          generation: generation.trim(),
        },
      },
    });

    if (!existing || !(await verifyPassword(password, existing.passwordHash))) {
      return NextResponse.json(
        { error: "ไม่พบทีม หรือรหัสทีมไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    await prisma.tournamentTeam.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, id: existing.id });
  } catch (error) {
    console.error("[DELETE /api/tournament-teams]", error);
    return NextResponse.json({ error: "ลบทีมไม่สำเร็จ" }, { status: 500 });
  }
}

