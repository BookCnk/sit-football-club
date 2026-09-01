"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, Globe, Plus, Trash2, User, UsersRound } from "lucide-react";
import SystemModal from "@/components/ui/SystemModal";
import { useToast } from "@/hooks/useToast";

const departments = ["IT", "CS", "DSI"] as const;
type Department = (typeof departments)[number];
type Team = {
  id: number;
  name: string;
  generation: string;
  department: Department;
  members: string[];
};

type Language = "th" | "en";

const content = {
  th: {
    tagline: "SIT FOOTBALL CLUB · 2026",
    titleMain: "IT RELATION",
    titleSub: "TOURNAMENT",
    description: "ลงทะเบียนทีม เลือกรุ่นและสาขา พร้อมเพิ่มรายชื่อผู้เล่นได้ทันที",
    btnRegister: "สมัครทีม",
    btnEdit: "แก้ไขทีม",
    sectionTag: "REGISTERED TEAMS",
    sectionTitle: "รายชื่อทีมที่สมัครแล้ว",
    teamsCount: (count: number) => `${count} ทีม`,
    loadError: "โหลดรายชื่อทีมไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง",
    emptyTeams: "ยังไม่มีทีมสมัคร เป็นทีมแรกได้เลย",
    teamMeta: (gen: string, dept: string, count: number) =>
      `รุ่น ${gen} · ${dept} · ${count} คน`,
    btnViewItem: "ดูรายชื่อ",
    btnEditItem: "แก้ไข",
    btnDeleteItem: "ลบ",
    noticeText:
      "ตั้งรหัสทีมและเก็บไว้ให้ดี รหัสนี้ใช้แก้ไขรายชื่อหรือลบทีมภายหลังได้ โดยหนึ่งชื่อทีมสมัครได้หนึ่งครั้งต่อหนึ่งรุ่น",
    // View Modal
    viewModalTitle: "รายชื่อผู้เล่น",
    viewModalTotal: (count: number) => `สมาชิกทั้งหมด ${count} คน`,
    // Edit Modal Step 1 & 2
    modalTitleRegister: "สมัครทีม",
    modalTitleEditStep1: "แก้ไขทีม (ขั้นตอนที่ 1/2: ยืนยันรหัส)",
    modalTitleEditStep2: "แก้ไขทีม (ขั้นตอนที่ 2/2: แก้ไขข้อมูล)",
    modalDescRegister: "กรอกข้อมูลทีมและตั้งรหัสสำหรับแก้ไขภายหลัง",
    modalDescEditStep1: "เลือกรุ่น/ทีม และกรอกรหัสทีมเพื่อยืนยันสิทธิ์แก้ไข",
    modalDescEditStep2: "แก้ไขสาขาและรายชื่อผู้เล่นของทีม",
    labelSelectTeam: "เลือกทีมที่ต้องการแก้ไข",
    selectTeamPlaceholder: "-- เลือกทีมจากรายการ --",
    labelTeamName: "ชื่อทีม",
    placeholderTeamName: "เช่น SIT United",
    labelGeneration: "รุ่น",
    placeholderGeneration: "เช่น 66",
    labelDepartment: "Department",
    labelMembers: "รายชื่อสมาชิก",
    btnAddMember: "เพิ่มชื่อ",
    placeholderMember: (index: number) => `สมาชิกคนที่ ${index}`,
    ariaRemoveMember: (index: number) => `ลบสมาชิกคนที่ ${index}`,
    labelPassword: "รหัสทีม",
    placeholderPassword: "อย่างน้อย 6 ตัวอักษร",
    editNote: "ชื่อทีมและรุ่นใช้ระบุทีม จึงไม่สามารถเปลี่ยนในขั้นตอนนี้ได้",
    submitting: "กำลังบันทึก...",
    verifying: "กำลังตรวจสอบ...",
    btnVerifyPassword: "ยืนยันรหัสเพื่อแก้ไข",
    btnSubmitRegister: "ลงทะเบียนทีม",
    btnSubmitEdit: "บันทึกการแก้ไข",
    btnBackStep1: "ย้อนกลับ / เลือกทีมอื่น",
    // Delete Modal
    deleteModalTitle: "ยืนยันลบทีม",
    deleteModalDesc: "กรอกรหัสทีมเพื่อยืนยันการลบทีมนี้ออกจากระบบ",
    deleteWarningText: (name: string, gen: string) =>
      `คุณกำลังจะลบทีม "${name}" (รุ่น ${gen}) การดำเนินการนี้ไม่สามารถยกเลิกได้`,
    btnConfirmDelete: "ยืนยันลบทีม",
    deleting: "กำลังลบทีม...",
    toastSuccessDelete: "ลบทีมเรียบร้อยแล้ว",
    toastDeleteError: "ลบทีมไม่สำเร็จ หรือรหัสทีมไม่ถูกต้อง",
    // Toasts
    toastSuccessRegister: "ลงทะเบียนทีมเรียบร้อย",
    toastSuccessEdit: "บันทึกการแก้ไขแล้ว",
    toastErrorTitle: "เกิดข้อผิดพลาด",
    toastDefaultError: "เกิดข้อผิดพลาดในการดำเนินการ",
    toastVerifySuccess: "ยืนยันรหัสผ่านเรียบร้อย",
    toastInvalidPassword: "ไม่พบทีม หรือรหัสทีมไม่ถูกต้อง",
  },
  en: {
    tagline: "SIT FOOTBALL CLUB · 2026",
    titleMain: "IT RELATION",
    titleSub: "TOURNAMENT",
    description:
      "Register your team, select batch and department, and add players instantly.",
    btnRegister: "REGISTER TEAM",
    btnEdit: "EDIT TEAM",
    sectionTag: "REGISTERED TEAMS",
    sectionTitle: "Registered Teams",
    teamsCount: (count: number) => `${count} ${count === 1 ? "team" : "teams"}`,
    loadError: "Failed to load registered teams. Please refresh the page.",
    emptyTeams: "No teams registered yet. Be the first to join!",
    teamMeta: (gen: string, dept: string, count: number) =>
      `Batch ${gen} · ${dept} · ${count} ${count === 1 ? "player" : "players"}`,
    btnViewItem: "View Roster",
    btnEditItem: "Edit",
    btnDeleteItem: "Delete",
    noticeText:
      "Keep your team password safe! This code is required for future edits or deletion. Each team name can register once per batch.",
    // View Modal
    viewModalTitle: "Team Roster",
    viewModalTotal: (count: number) =>
      `Total ${count} ${count === 1 ? "player" : "players"}`,
    // Edit Modal Step 1 & 2
    modalTitleRegister: "Register Team",
    modalTitleEditStep1: "Edit Team (Step 1/2: Verify Password)",
    modalTitleEditStep2: "Edit Team (Step 2/2: Update Details)",
    modalDescRegister:
      "Fill in team details and set a password for future edits",
    modalDescEditStep1: "Select team and enter password to unlock editing access",
    modalDescEditStep2: "Modify department and player roster",
    labelSelectTeam: "Select Team to Edit",
    selectTeamPlaceholder: "-- Select a team --",
    labelTeamName: "Team Name",
    placeholderTeamName: "e.g. SIT United",
    labelGeneration: "Batch",
    placeholderGeneration: "e.g. 66",
    labelDepartment: "Department",
    labelMembers: "Team Members",
    btnAddMember: "Add Member",
    placeholderMember: (index: number) => `Member #${index}`,
    ariaRemoveMember: (index: number) => `Remove member #${index}`,
    labelPassword: "Team Password",
    placeholderPassword: "At least 6 characters",
    editNote:
      "Team name and batch identify your team and cannot be changed here.",
    submitting: "Saving...",
    verifying: "Verifying...",
    btnVerifyPassword: "Verify Password & Edit",
    btnSubmitRegister: "Register Team",
    btnSubmitEdit: "Save Changes",
    btnBackStep1: "Back / Change Team",
    // Delete Modal
    deleteModalTitle: "Confirm Team Deletion",
    deleteModalDesc: "Enter team password to confirm deleting this team",
    deleteWarningText: (name: string, gen: string) =>
      `You are about to delete team "${name}" (Batch ${gen}). This action cannot be undone.`,
    btnConfirmDelete: "Confirm Delete Team",
    deleting: "Deleting...",
    toastSuccessDelete: "Team deleted successfully",
    toastDeleteError: "Failed to delete team or incorrect password",
    // Toasts
    toastSuccessRegister: "Team registered successfully",
    toastSuccessEdit: "Changes saved successfully",
    toastErrorTitle: "Action Failed",
    toastDefaultError: "An error occurred during operation",
    toastVerifySuccess: "Password verified! You may now edit the team.",
    toastInvalidPassword: "Team not found or incorrect password.",
  },
};

export default function ItRelationPage() {
  const toast = useToast();
  const [lang, setLang] = useState<Language>("th");
  const [mode, setMode] = useState<"register" | "edit">("register");
  const [editStep, setEditStep] = useState<1 | 2>(1);
  const [modalOpen, setModalOpen] = useState(false);

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewTeam, setSelectedViewTeam] = useState<Team | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteTeam, setSelectedDeleteTeam] = useState<Team | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [generation, setGeneration] = useState("");
  const [department, setDepartment] = useState<Department>("IT");
  const [members, setMembers] = useState([""]);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(false);

  const t = content[lang];

  useEffect(() => {
    fetch("/api/tournament-teams")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(setTeams)
      .catch(() => setListError(true))
      .finally(() => setLoading(false));
  }, []);

  function openForm(nextMode: "register" | "edit", team?: Team) {
    setMode(nextMode);
    setEditStep(1);
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
    } else {
      // Edit from header button
      setName("");
      setGeneration("");
      setDepartment("IT");
      setMembers([""]);
    }
    setModalOpen(true);
  }

  function openViewModal(team: Team) {
    setSelectedViewTeam(team);
    setViewModalOpen(true);
  }

  function openDeleteModal(team: Team) {
    setSelectedDeleteTeam(team);
    setDeletePassword("");
    setDeleteModalOpen(true);
  }

  const updateMember = (index: number, value: string) =>
    setMembers((current) =>
      current.map((member, i) => (i === index ? value : member)),
    );
  const removeMember = (index: number) =>
    setMembers((current) =>
      current.length === 1 ? current : current.filter((_, i) => i !== index),
    );

  // Handle Step 1 Verification
  async function handleVerifyPassword(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !generation.trim() || password.length < 6) {
      toast.error(t.toastInvalidPassword, t.toastErrorTitle);
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/tournament-teams/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          generation: generation.trim(),
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || t.toastInvalidPassword);
      }

      // Populate data from verified team
      const team: Team = data.team;
      setName(team.name);
      setGeneration(team.generation);
      setDepartment(team.department);
      setMembers(team.members.length ? team.members : [""]);

      toast.success(t.toastVerifySuccess, "IT Relation Tournament");
      setEditStep(2);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t.toastInvalidPassword,
        t.toastErrorTitle,
      );
    } finally {
      setVerifying(false);
    }
  }

  // Handle Final Submit (Register POST / Edit Step 2 PATCH)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/tournament-teams", {
        method: mode === "register" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          generation,
          department,
          members,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t.toastDefaultError);

      setTeams((current) => [
        data,
        ...current.filter((team) => team.id !== data.id),
      ]);
      setModalOpen(false);
      toast.success(
        mode === "register" ? t.toastSuccessRegister : t.toastSuccessEdit,
        "IT Relation Tournament",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t.toastDefaultError,
        t.toastErrorTitle,
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Handle Team Deletion
  async function handleDeleteTeam(event: FormEvent) {
    event.preventDefault();
    if (!selectedDeleteTeam || deletePassword.length < 6) {
      toast.error(t.toastDeleteError, t.toastErrorTitle);
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch("/api/tournament-teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedDeleteTeam.name,
          generation: selectedDeleteTeam.generation,
          password: deletePassword,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || t.toastDeleteError);
      }

      setTeams((current) => current.filter((item) => item.id !== data.id));
      setDeleteModalOpen(false);
      toast.success(t.toastSuccessDelete, "IT Relation Tournament");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t.toastDeleteError,
        t.toastErrorTitle,
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={`min-h-screen bg-[#050505] px-5 pb-20 pt-28 ${
        lang === "th" ? "font-kanit" : ""
      }`}>
      <div className="mx-auto max-w-3xl">
        <header className="pb-8">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs tracking-[0.25em] text-red-500">
              {t.tagline}
            </p>
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-[11px] font-semibold tracking-wider">
              <Globe className="ml-1.5 h-3.5 w-3.5 text-neutral-400" />
              <button
                onClick={() => setLang("th")}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  lang === "th"
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}>
                TH
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  lang === "en"
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}>
                EN
              </button>
            </div>
          </div>

          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {t.titleMain}
            <br />
            <span className="text-neutral-500">{t.titleSub}</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-400">
            {t.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => openForm("register")}
              className="bg-red-600 px-5 py-3 text-xs font-bold tracking-[0.15em] text-white transition hover:bg-red-500">
              {t.btnRegister}
            </button>
            <button
              onClick={() => openForm("edit")}
              className="border border-white/15 px-5 py-3 text-xs font-bold tracking-[0.15em] text-white transition hover:border-white/40">
              {t.btnEdit}
            </button>
          </div>
        </header>

        <section className="mt-8 pt-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-red-500">
                {t.sectionTag}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {t.sectionTitle}
              </h2>
            </div>
            <span className="text-sm text-neutral-500">
              {t.teamsCount(teams.length)}
            </span>
          </div>
          {loading ? (
            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-4 animate-pulse sm:flex-row sm:items-center">
                  <div className="space-y-2">
                    <div className="h-5 w-36 rounded bg-white/10 sm:w-48" />
                    <div className="h-3.5 w-44 rounded bg-white/5 sm:w-56" />
                  </div>
                  <div className="flex items-center gap-2 pt-1 sm:pt-0">
                    <div className="h-8 w-20 rounded border border-white/5 bg-white/5" />
                    <div className="h-8 w-14 rounded border border-white/5 bg-white/5" />
                    <div className="h-8 w-14 rounded border border-white/5 bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : listError ? (
            <p className="mt-5 text-sm text-red-400">{t.loadError}</p>
          ) : teams.length ? (
            <div className="mt-5 space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col justify-between gap-4 rounded-lg bg-white/[0.02] p-4 transition sm:flex-row sm:items-center hover:bg-white/[0.04]">
                  <div>
                    <h3 className="font-medium text-white">{team.name}</h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {t.teamMeta(
                        team.generation,
                        team.department,
                        team.members.length,
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openViewModal(team)}
                      className="flex items-center gap-1.5 border border-white/10 px-3 py-2 text-[10px] font-bold tracking-widest text-neutral-300 transition hover:border-white/30 hover:text-white">
                      <Eye className="h-3.5 w-3.5 text-neutral-400" />
                      {t.btnViewItem}
                    </button>
                    <button
                      onClick={() => openForm("edit", team)}
                      className="border border-white/10 px-3 py-2 text-[10px] font-bold tracking-widest text-neutral-300 transition hover:border-red-500 hover:text-white">
                      {t.btnEditItem}
                    </button>
                    <button
                      onClick={() => openDeleteModal(team)}
                      className="flex items-center gap-1 border border-red-500/20 bg-red-500/5 px-3 py-2 text-[10px] font-bold tracking-widest text-red-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white">
                      <Trash2 className="h-3.5 w-3.5" />
                      {t.btnDeleteItem}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-neutral-500">{t.emptyTeams}</p>
          )}
        </section>

        <aside className="mt-10 flex gap-4 border border-white/10 bg-white/[0.03] p-5">
          <UsersRound className="h-6 w-6 shrink-0 text-red-500" />
          <p className="text-xs leading-5 text-neutral-400">{t.noticeText}</p>
        </aside>
      </div>

      {/* VIEW ROSTER MODAL */}
      <SystemModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedViewTeam ? selectedViewTeam.name : t.viewModalTitle}
        description={
          selectedViewTeam
            ? `${t.teamMeta(
                selectedViewTeam.generation,
                selectedViewTeam.department,
                selectedViewTeam.members.length,
              )}`
            : ""
        }
        maxWidthClassName="max-w-md">
        {selectedViewTeam && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs text-red-400">
                {t.viewModalTitle}
              </span>
              <span className="text-xs text-neutral-400">
                {t.viewModalTotal(selectedViewTeam.members.length)}
              </span>
            </div>
            <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
              {selectedViewTeam.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded bg-white/[0.04] px-3 py-2.5 text-sm text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-red-600/20 font-mono text-xs font-bold text-red-400">
                    {index + 1}
                  </span>
                  <User className="h-4 w-4 text-neutral-400" />
                  <span>{member}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SystemModal>

      {/* DELETE TEAM MODAL */}
      <SystemModal
        open={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title={t.deleteModalTitle}
        description={t.deleteModalDesc}
        maxWidthClassName="max-w-md">
        {selectedDeleteTeam && (
          <form onSubmit={handleDeleteTeam} className="space-y-5">
            <div className="rounded bg-red-500/10 border border-red-500/20 p-3 text-xs leading-5 text-red-300">
              {t.deleteWarningText(
                selectedDeleteTeam.name,
                selectedDeleteTeam.generation,
              )}
            </div>

            <label className="block text-sm font-medium">
              {t.labelPassword}
              <input
                required
                minLength={6}
                type="password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
                placeholder={t.placeholderPassword}
              />
            </label>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="border border-white/15 px-4 py-3 text-xs font-bold tracking-wider text-neutral-300 transition hover:border-white/40 disabled:opacity-50">
                Cancel
              </button>
              <button
                disabled={deleting}
                type="submit"
                className="flex-1 bg-red-600 px-5 py-3.5 text-xs font-bold tracking-[0.15em] text-white transition hover:bg-red-500 disabled:bg-neutral-700">
                {deleting ? t.deleting : t.btnConfirmDelete}
              </button>
            </div>
          </form>
        )}
      </SystemModal>

      {/* REGISTER / EDIT MODAL */}
      <SystemModal
        open={modalOpen}
        onClose={() => !submitting && !verifying && setModalOpen(false)}
        title={
          mode === "register"
            ? t.modalTitleRegister
            : editStep === 1
              ? t.modalTitleEditStep1
              : t.modalTitleEditStep2
        }
        description={
          mode === "register"
            ? t.modalDescRegister
            : editStep === 1
              ? t.modalDescEditStep1
              : t.modalDescEditStep2
        }
        maxWidthClassName="max-w-2xl">
        {mode === "edit" && editStep === 1 ? (
          /* EDIT STEP 1: SELECT TEAM & VERIFY PASSWORD */
          <form onSubmit={handleVerifyPassword} className="space-y-5">
            {teams.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  {t.labelSelectTeam}
                </label>
                <select
                  onChange={(e) => {
                    const found = teams.find(
                      (item) => String(item.id) === e.target.value,
                    );
                    if (found) {
                      setName(found.name);
                      setGeneration(found.generation);
                    }
                  }}
                  className="mt-2 w-full border border-white/15 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-red-500">
                  <option value="">{t.selectTeamPlaceholder}</option>
                  {teams.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (รุ่น {item.generation} · {item.department})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                {t.labelTeamName}
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
                  placeholder={t.placeholderTeamName}
                />
              </label>
              <label className="block text-sm font-medium">
                {t.labelGeneration}
                <input
                  required
                  value={generation}
                  onChange={(event) => setGeneration(event.target.value)}
                  className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
                  placeholder={t.placeholderGeneration}
                />
              </label>
            </div>

            <label className="block text-sm font-medium">
              {t.labelPassword}
              <input
                required
                minLength={6}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
                placeholder={t.placeholderPassword}
              />
            </label>

            <button
              disabled={verifying}
              type="submit"
              className="w-full bg-red-600 px-5 py-4 text-xs font-bold tracking-[0.18em] text-white transition hover:bg-red-500 disabled:bg-neutral-700">
              {verifying ? t.verifying : t.btnVerifyPassword}
            </button>
          </form>
        ) : (
          /* REGISTER FORM OR EDIT STEP 2 */
          <form
            onSubmit={submit}
            className="max-h-[68vh] space-y-5 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                {t.labelTeamName}
                <input
                  required
                  disabled={mode === "edit"}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:opacity-60"
                  placeholder={t.placeholderTeamName}
                />
              </label>
              <label className="block text-sm font-medium">
                {t.labelGeneration}
                <input
                  required
                  disabled={mode === "edit"}
                  value={generation}
                  onChange={(event) => setGeneration(event.target.value)}
                  className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:opacity-60"
                  placeholder={t.placeholderGeneration}
                />
              </label>
            </div>

            <label className="block text-sm font-medium">
              {t.labelDepartment}
              <select
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value as Department)
                }
                className="mt-2 w-full border border-white/15 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-red-500">
                {departments.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">{t.labelMembers}</label>
                <button
                  type="button"
                  onClick={() => setMembers((current) => [...current, ""])}
                  disabled={members.length >= 30}
                  className="flex items-center gap-1 text-xs text-red-400 disabled:text-neutral-600">
                  <Plus className="h-3.5 w-3.5" /> {t.btnAddMember}
                </button>
              </div>
              <div className="space-y-2">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      required
                      value={member}
                      onChange={(event) =>
                        updateMember(index, event.target.value)
                      }
                      className="min-w-0 flex-1 border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
                      placeholder={t.placeholderMember(index + 1)}
                    />
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      aria-label={t.ariaRemoveMember(index + 1)}
                      className="border border-white/10 px-3 text-neutral-500 hover:border-red-500 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {mode === "register" && (
              <label className="block text-sm font-medium">
                {t.labelPassword}
                <input
                  required
                  minLength={6}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
                  placeholder={t.placeholderPassword}
                />
              </label>
            )}

            {mode === "edit" && (
              <p className="text-xs leading-5 text-neutral-500">{t.editNote}</p>
            )}

            <div className="flex gap-3 pt-2">
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => setEditStep(1)}
                  className="border border-white/15 px-4 py-3 text-xs font-bold tracking-wider text-neutral-300 transition hover:border-white/40">
                  {t.btnBackStep1}
                </button>
              )}
              <button
                disabled={submitting}
                className="flex-1 bg-red-600 px-5 py-4 text-xs font-bold tracking-[0.18em] text-white transition hover:bg-red-500 disabled:bg-neutral-700">
                {submitting
                  ? t.submitting
                  : mode === "register"
                    ? t.btnSubmitRegister
                    : t.btnSubmitEdit}
              </button>
            </div>
          </form>
        )}
      </SystemModal>
    </div>
  );
}
