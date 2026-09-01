"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Eye,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Trophy,
  User,
  Users,
  UsersRound,
} from "lucide-react";
import SystemModal from "@/components/ui/SystemModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
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

export default function DashboardItRelationPage() {
  const toast = useToast();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<"all" | Department>("all");

  // Modals
  const [viewTeam, setViewTeam] = useState<Team | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Register / Edit Modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [name, setName] = useState("");
  const [generation, setGeneration] = useState("");
  const [department, setDepartment] = useState<Department>("IT");
  const [members, setMembers] = useState<string[]>([""]);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tournament-teams");
      if (!res.ok) throw new Error("Failed to load teams");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingTeam(null);
    setName("");
    setGeneration("");
    setDepartment("IT");
    setMembers([""]);
    setPassword("");
    setFormModalOpen(true);
  }

  function openEditModal(team: Team) {
    setEditingTeam(team);
    setName(team.name);
    setGeneration(team.generation);
    setDepartment(team.department);
    setMembers(team.members.length ? team.members : [""]);
    setPassword("");
    setFormModalOpen(true);
  }

  const updateMemberField = (index: number, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? value : m)));
  };

  const removeMemberField = (index: number) => {
    setMembers((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  };

  async function handleSaveTeam(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isEdit = Boolean(editingTeam);
      const url = "/api/tournament-teams";
      const method = isEdit ? "PATCH" : "POST";
      const payload: Record<string, unknown> = isEdit
        ? {
            id: editingTeam?.id,
            department,
            members,
            ...(password ? { password } : {}),
          }
        : {
            name,
            generation,
            department,
            members,
            password,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operation failed");

      if (isEdit) {
        setTeams((prev) => prev.map((t) => (t.id === data.id ? data : t)));
        toast.success(`Updated team "${data.name}"`, "Team updated");
      } else {
        setTeams((prev) => [data, ...prev]);
        toast.success(`Registered team "${data.name}"`, "Team registered");
      }

      setFormModalOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save team",
        "Error",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!teamToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/tournament-teams", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: teamToDelete.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete team");
      }

      setTeams((prev) => prev.filter((t) => t.id !== teamToDelete.id));
      toast.success(
        `Deleted team "${teamToDelete.name}" (Batch ${teamToDelete.generation})`,
        "Team deleted",
      );
      setTeamToDelete(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete team",
        "Error",
      );
    } finally {
      setDeleting(false);
    }
  }

  // Filtered teams
  const filteredTeams = teams.filter((t) => {
    const matchesDept = deptFilter === "all" || t.department === deptFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.generation.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.members.some((m) => m.toLowerCase().includes(q));
    return matchesDept && matchesSearch;
  });

  // Stats
  const totalTeams = teams.length;
  const totalPlayers = teams.reduce((acc, t) => acc + t.members.length, 0);
  const itTeams = teams.filter((t) => t.department === "IT").length;
  const csTeams = teams.filter((t) => t.department === "CS").length;
  const dsiTeams = teams.filter((t) => t.department === "DSI").length;

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">
            <Trophy className="h-3.5 w-3.5" />
            IT RELATION TOURNAMENT
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Tournament Teams Management
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Overview and full administrative control of registered tournament teams and rosters.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-500 shadow-lg shadow-red-600/20">
          <Plus className="h-4 w-4" />
          Add New Team
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-[#090909] p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Total Teams
            </span>
            <Trophy className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-white">
            {totalTeams}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#090909] p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Total Players
            </span>
            <Users className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-white">
            {totalPlayers}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#090909] p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">
              IT Department
            </span>
            <span className="rounded bg-red-500/10 px-2 py-0.5 font-mono text-[10px] text-red-400 border border-red-500/20">
              IT
            </span>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-white">
            {itTeams} <span className="text-xs text-neutral-500 font-normal">teams</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#090909] p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">
              CS Department
            </span>
            <span className="rounded bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] text-blue-400 border border-blue-500/20">
              CS
            </span>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-white">
            {csTeams} <span className="text-xs text-neutral-500 font-normal">teams</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#090909] p-5 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">
              DSI Department
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
              DSI
            </span>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-white">
            {dsiTeams} <span className="text-xs text-neutral-500 font-normal">teams</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="grid gap-4 lg:grid-cols-[1fr,240px]">
        <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#090909] p-2">
          <Search className="ml-3 h-4 w-4 text-neutral-500 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by team name, batch (รุ่น), department, or member name..."
            className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#090909] p-2 flex items-center gap-2">
          <Filter className="ml-3 h-4 w-4 text-neutral-500 shrink-0" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value as "all" | Department)}
            className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs uppercase tracking-wider text-white outline-none transition focus:border-red-500">
            <option value="all">Filter: All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                Department: {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ADMIN TABLE SECTION */}
      <section className="rounded-3xl border border-white/10 bg-[#090909] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              Registered Teams Table
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Teams & Roster Records
            </h2>
          </div>
          <div className="text-xs font-mono text-neutral-400">
            Total: {filteredTeams.length} teams
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-sm text-neutral-400 justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-red-500" />
            Loading registered teams...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-5 text-sm text-red-100">
            {error}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
            <UsersRound className="mb-4 h-8 w-8 text-neutral-600" />
            <div className="text-sm text-neutral-400">
              No registered teams matching search or filter criteria.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Team Name</th>
                  <th className="px-4 py-2">Batch (รุ่น)</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Roster Members</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team, index) => (
                  <tr key={team.id} className="bg-white/[0.03] transition hover:bg-white/[0.05]">
                    <td className="rounded-l-2xl border-y border-l border-white/10 px-4 py-4 font-mono text-xs text-neutral-500">
                      {index + 1}
                    </td>
                    <td className="border-y border-white/10 px-4 py-4">
                      <div className="font-display text-base font-bold text-white">
                        {team.name}
                      </div>
                      <div className="mt-0.5 text-xs text-neutral-400">
                        ID: #{team.id}
                      </div>
                    </td>
                    <td className="border-y border-white/10 px-4 py-4 text-sm font-medium text-neutral-200">
                      รุ่น {team.generation}
                    </td>
                    <td className="border-y border-white/10 px-4 py-4">
                      <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">
                        {team.department}
                      </span>
                    </td>
                    <td className="border-y border-white/10 px-4 py-4">
                      <button
                        onClick={() => setViewTeam(team)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:border-white/30 hover:text-white">
                        <Eye className="h-3.5 w-3.5 text-neutral-400" />
                        View Roster ({team.members.length})
                      </button>
                    </td>
                    <td className="rounded-r-2xl border-y border-r border-white/10 px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(team)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:border-white/40 hover:text-white">
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setTeamToDelete(team)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-500 hover:bg-red-500 hover:text-white">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* VIEW ROSTER MODAL */}
      <SystemModal
        open={Boolean(viewTeam)}
        onClose={() => setViewTeam(null)}
        title={viewTeam ? `Roster: ${viewTeam.name}` : "Team Roster"}
        description={
          viewTeam
            ? `Batch ${viewTeam.generation} · ${viewTeam.department} · ${viewTeam.members.length} Players`
            : ""
        }
        maxWidthClassName="max-w-md">
        {viewTeam && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs text-red-400">
                Registered Players List
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Total {viewTeam.members.length} players
              </span>
            </div>
            <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
              {viewTeam.members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/5 px-3.5 py-2.5 text-sm text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600/20 font-mono text-xs font-bold text-red-400">
                    {idx + 1}
                  </span>
                  <User className="h-4 w-4 text-neutral-400" />
                  <span>{member}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SystemModal>

      {/* REGISTER / EDIT TEAM MODAL */}
      <SystemModal
        open={formModalOpen}
        onClose={() => !submitting && setFormModalOpen(false)}
        title={editingTeam ? `Edit Team: ${editingTeam.name}` : "Register New Team"}
        description={
          editingTeam
            ? "Modify department and roster as Administrator"
            : "Fill in team information and set password"
        }
        maxWidthClassName="max-w-xl">
        <form onSubmit={handleSaveTeam} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">
              Team Name
              <input
                required
                disabled={Boolean(editingTeam)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SIT United"
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500 disabled:opacity-50"
              />
            </label>
            <label className="block text-sm font-medium">
              Batch (รุ่น)
              <input
                required
                disabled={Boolean(editingTeam)}
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                placeholder="e.g. 66"
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500 disabled:opacity-50"
              />
            </label>
          </div>

          <label className="block text-sm font-medium">
            Department
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-[#111] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500">
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Player Roster</label>
              <button
                type="button"
                onClick={() => setMembers((prev) => [...prev, ""])}
                disabled={members.length >= 30}
                className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 disabled:text-neutral-600">
                <Plus className="h-3.5 w-3.5" /> Add Member
              </button>
            </div>
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    required
                    value={member}
                    onChange={(e) => updateMemberField(index, e.target.value)}
                    placeholder={`Player #${index + 1}`}
                    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeMemberField(index)}
                    className="rounded-xl border border-white/10 px-3 text-neutral-400 hover:border-red-500 hover:bg-red-500/10 hover:text-red-400 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="block text-sm font-medium">
            Team Password {editingTeam && "(Leave blank to keep unchanged)"}
            <input
              required={!editingTeam}
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormModalOpen(false)}
              disabled={submitting}
              className="rounded-xl border border-white/15 px-4 py-3 text-xs font-bold tracking-wider text-neutral-300 transition hover:border-white/40 disabled:opacity-50">
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="rounded-xl bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-500 disabled:bg-neutral-700">
              {submitting ? "Saving..." : editingTeam ? "Save Changes" : "Create Team"}
            </button>
          </div>
        </form>
      </SystemModal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={Boolean(teamToDelete)}
        title="Delete Tournament Team"
        message={
          teamToDelete
            ? `Delete team "${teamToDelete.name}" (Batch ${teamToDelete.generation})? As Administrator, this action will permanently remove the team and roster immediately.`
            : "Delete this team?"
        }
        confirmLabel="Delete Team"
        cancelLabel="Cancel"
        danger
        loading={deleting}
        onCancel={() => setTeamToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
