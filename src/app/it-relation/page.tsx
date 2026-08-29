"use client";

import { FormEvent, useState } from "react";
import { Plus, Trash2, UsersRound } from "lucide-react";
import { useToast } from "@/hooks/useToast";

const departments = ["IT", "CS", "DSI"] as const;
type Department = (typeof departments)[number];

export default function ItRelationPage() {
  const toast = useToast();
  const [mode, setMode] = useState<"register" | "edit">("register");
  const [name, setName] = useState("");
  const [generation, setGeneration] = useState("");
  const [department, setDepartment] = useState<Department>("IT");
  const [members, setMembers] = useState([""]);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateMember = (index: number, value: string) => setMembers((current) => current.map((member, i) => i === index ? value : member));
  const removeMember = (index: number) => setMembers((current) => current.length === 1 ? current : current.filter((_, i) => i !== index));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/tournament-teams", {
        method: mode === "register" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, generation, department, members, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
      toast.success(mode === "register" ? "ลงทะเบียนทีมเรียบร้อย" : "บันทึกการแก้ไขแล้ว", "IT Relation Tournament");
      if (mode === "register") setPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาด", "บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-5">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-white/15 pb-10 mb-8">
          <p className="font-mono text-xs tracking-[0.25em] text-red-500">SIT FOOTBALL CLUB · 2026</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">IT RELATION<br /><span className="text-neutral-500">TOURNAMENT</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-400">ลงทะเบียนทีมของคุณ เลือกรุ่นและสาขา พร้อมเพิ่มรายชื่อผู้เล่นได้ทันที</p>
        </header>

        <div className="grid gap-8 md:grid-cols-[1fr_220px]">
          <form onSubmit={submit} className="space-y-6">
            <div className="flex border-b border-white/10">
              {(["register", "edit"] as const).map((value) => (
                <button key={value} type="button" onClick={() => setMode(value)} className={`px-4 py-3 text-xs font-bold tracking-widest ${mode === value ? "border-b-2 border-red-500 text-white" : "text-neutral-500 hover:text-white"}`}>
                  {value === "register" ? "สมัครทีม" : "แก้ไขทีม"}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium">ชื่อทีม<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500" placeholder="เช่น SIT United" /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">รุ่น<input required value={generation} onChange={(event) => setGeneration(event.target.value)} className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500" placeholder="เช่น 66" /></label>
              <label className="block text-sm font-medium">Department<select value={department} onChange={(event) => setDepartment(event.target.value as Department)} className="mt-2 w-full border border-white/15 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-red-500">{departments.map((value) => <option key={value}>{value}</option>)}</select></label>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between"><label className="text-sm font-medium">รายชื่อสมาชิก</label><button type="button" onClick={() => setMembers((current) => [...current, ""])} disabled={members.length >= 30} className="flex items-center gap-1 text-xs text-red-400 disabled:text-neutral-600"><Plus className="h-3.5 w-3.5" /> เพิ่มชื่อ</button></div>
              <div className="space-y-2">{members.map((member, index) => <div key={index} className="flex gap-2"><input required value={member} onChange={(event) => updateMember(index, event.target.value)} className="min-w-0 flex-1 border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500" placeholder={`สมาชิกคนที่ ${index + 1}`} /><button type="button" onClick={() => removeMember(index)} aria-label={`ลบสมาชิกคนที่ ${index + 1}`} className="border border-white/10 px-3 text-neutral-500 hover:border-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button></div>)}</div>
            </div>

            <label className="block text-sm font-medium">รหัสทีม<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500" placeholder="อย่างน้อย 6 ตัวอักษร" /></label>
            {mode === "edit" && <p className="-mt-3 text-xs leading-5 text-neutral-500">ใช้ชื่อทีม รุ่น และรหัสเดิมเพื่อแก้ไข Department หรือรายชื่อสมาชิก</p>}
            <button disabled={submitting} className="w-full bg-red-600 px-5 py-4 text-xs font-bold tracking-[0.18em] text-white transition hover:bg-red-500 disabled:bg-neutral-700">{submitting ? "กำลังบันทึก..." : mode === "register" ? "ลงทะเบียนทีม" : "บันทึกการแก้ไข"}</button>
          </form>

          <aside className="h-fit border border-white/10 bg-white/[0.03] p-5">
            <UsersRound className="h-6 w-6 text-red-500" />
            <h2 className="mt-4 font-display text-lg font-semibold">ก่อนเริ่มสมัคร</h2>
            <ul className="mt-3 space-y-3 text-xs leading-5 text-neutral-400"><li>ตั้งรหัสทีมและเก็บไว้ให้ดี</li><li>รหัสนี้ใช้แก้ไขรายชื่อภายหลัง</li><li>หนึ่งชื่อทีมต่อหนึ่งรุ่น</li></ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
