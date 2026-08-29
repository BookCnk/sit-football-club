"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2, UsersRound } from "lucide-react";
import SystemModal from "@/components/ui/SystemModal";
import { useToast } from "@/hooks/useToast";

const departments = ["IT", "CS", "DSI"] as const;
type Department = (typeof departments)[number];
type Team = { id: number; name: string; generation: string; department: Department; members: string[] };

export default function ItRelationPage() {
  const toast = useToast();
  const [mode, setMode] = useState<"register" | "edit">("register");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [generation, setGeneration] = useState("");
  const [department, setDepartment] = useState<Department>("IT");
  const [members, setMembers] = useState([""]);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [listError, setListError] = useState(false);

  useEffect(() => {
    fetch("/api/tournament-teams")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setTeams)
      .catch(() => setListError(true));
  }, []);

  function openForm(nextMode: "register" | "edit", team?: Team) {
    setMode(nextMode);
    setPassword("");
    if (team) {
      setName(team.name);
      setGeneration(team.generation);
      setDepartment(team.department);
      setMembers(team.members.length ? team.members : [""]);
    } else if (nextMode === "register") {
      setName("");
      setGeneration("");
      setDepartment("IT");
      setMembers([""]);
    }
    setModalOpen(true);
  }

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
      setTeams((current) => [data, ...current.filter((team) => team.id !== data.id)]);
      setModalOpen(false);
      toast.success(mode === "register" ? "ลงทะเบียนทีมเรียบร้อย" : "บันทึกการแก้ไขแล้ว", "IT Relation Tournament");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "เกิดข้อผิดพลาด", "บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] px-5 pb-20 pt-28">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-white/15 pb-10">
          <p className="font-mono text-xs tracking-[0.25em] text-red-500">SIT FOOTBALL CLUB · 2026</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">IT RELATION<br /><span className="text-neutral-500">TOURNAMENT</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-400">ลงทะเบียนทีม เลือกรุ่นและสาขา พร้อมเพิ่มรายชื่อผู้เล่นได้ทันที</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => openForm("register")} className="bg-red-600 px-5 py-3 text-xs font-bold tracking-[0.15em] text-white transition hover:bg-red-500">สมัครทีม</button>
            <button onClick={() => openForm("edit")} className="border border-white/15 px-5 py-3 text-xs font-bold tracking-[0.15em] text-white transition hover:border-white/40">แก้ไขทีม</button>
          </div>
        </header>

        <section className="mt-14 border-t border-white/15 pt-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="font-mono text-xs tracking-[0.2em] text-red-500">REGISTERED TEAMS</p><h2 className="mt-2 font-display text-2xl font-semibold">รายชื่อทีมที่สมัครแล้ว</h2></div>
            <span className="text-sm text-neutral-500">{teams.length} ทีม</span>
          </div>
          {listError ? <p className="mt-5 text-sm text-red-400">โหลดรายชื่อทีมไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง</p> : teams.length ? <div className="mt-5 divide-y divide-white/10 border-y border-white/10">{teams.map((team) => <div key={team.id} className="flex items-center justify-between gap-4 py-4"><div><h3 className="font-medium text-white">{team.name}</h3><p className="mt-1 text-xs text-neutral-500">รุ่น {team.generation} · {team.department} · {team.members.length} คน</p></div><button onClick={() => openForm("edit", team)} className="border border-white/10 px-3 py-2 text-[10px] font-bold tracking-widest text-neutral-300 transition hover:border-red-500 hover:text-white">แก้ไข</button></div>)}</div> : <p className="mt-5 text-sm text-neutral-500">ยังไม่มีทีมสมัคร เป็นทีมแรกได้เลย</p>}
        </section>

        <aside className="mt-10 flex gap-4 border border-white/10 bg-white/[0.03] p-5">
          <UsersRound className="h-6 w-6 shrink-0 text-red-500" />
          <p className="text-xs leading-5 text-neutral-400">ตั้งรหัสทีมและเก็บไว้ให้ดี รหัสนี้ใช้แก้ไขรายชื่อภายหลังได้ โดยหนึ่งชื่อทีมสมัครได้หนึ่งครั้งต่อหนึ่งรุ่น</p>
        </aside>
      </div>

      <SystemModal open={modalOpen} onClose={() => !submitting && setModalOpen(false)} title={mode === "register" ? "สมัครทีม" : "แก้ไขทีม"} description={mode === "register" ? "กรอกข้อมูลทีมและตั้งรหัสสำหรับแก้ไขภายหลัง" : "กรอกรหัสทีมเพื่อยืนยันการแก้ไข"} maxWidthClassName="max-w-2xl">
        <form onSubmit={submit} className="max-h-[68vh] space-y-5 overflow-y-auto pr-1">
          <label className="block text-sm font-medium">ชื่อทีม<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500" placeholder="เช่น SIT United" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">รุ่น<input required value={generation} onChange={(event) => setGeneration(event.target.value)} className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500" placeholder="เช่น 66" /></label>
            <label className="block text-sm font-medium">Department<select value={department} onChange={(event) => setDepartment(event.target.value as Department)} className="mt-2 w-full border border-white/15 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-red-500">{departments.map((value) => <option key={value}>{value}</option>)}</select></label>
          </div>
          <div><div className="mb-2 flex items-center justify-between"><label className="text-sm font-medium">รายชื่อสมาชิก</label><button type="button" onClick={() => setMembers((current) => [...current, ""])} disabled={members.length >= 30} className="flex items-center gap-1 text-xs text-red-400 disabled:text-neutral-600"><Plus className="h-3.5 w-3.5" /> เพิ่มชื่อ</button></div><div className="space-y-2">{members.map((member, index) => <div key={index} className="flex gap-2"><input required value={member} onChange={(event) => updateMember(index, event.target.value)} className="min-w-0 flex-1 border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500" placeholder={`สมาชิกคนที่ ${index + 1}`} /><button type="button" onClick={() => removeMember(index)} aria-label={`ลบสมาชิกคนที่ ${index + 1}`} className="border border-white/10 px-3 text-neutral-500 hover:border-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>
          <label className="block text-sm font-medium">รหัสทีม<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500" placeholder="อย่างน้อย 6 ตัวอักษร" /></label>
          {mode === "edit" && <p className="text-xs leading-5 text-neutral-500">ชื่อทีมและรุ่นใช้ระบุทีม จึงต้องตรงกับข้อมูลเดิม</p>}
          <button disabled={submitting} className="w-full bg-red-600 px-5 py-4 text-xs font-bold tracking-[0.18em] text-white transition hover:bg-red-500 disabled:bg-neutral-700">{submitting ? "กำลังบันทึก..." : mode === "register" ? "ลงทะเบียนทีม" : "บันทึกการแก้ไข"}</button>
        </form>
      </SystemModal>
    </div>
  );
}
