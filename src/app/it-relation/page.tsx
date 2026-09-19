"use client";

import { useState } from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import SystemModal from "@/components/ui/SystemModal";

type Match = {
  time: string;
  pitch1?: { tag: string; teams: string; tone?: "red" | "gold" | "muted" };
  pitch2?: { tag: string; teams: string; tone?: "red" | "gold" | "muted" };
  lunch?: string;
  closing?: string;
};

const matches: Match[] = [
  {
    time: "10:00 – 10:30",
    pitch1: { tag: "A1", teams: "IT22  VS  IT32" },
    pitch2: { tag: "—", teams: "สนามยังไม่เปิด", tone: "muted" },
  },
  {
    time: "10:30 – 11:00",
    pitch1: { tag: "A2", teams: "IT27  VS  IT16+17" },
    pitch2: { tag: "—", teams: "สนามยังไม่เปิด", tone: "muted" },
  },
  {
    time: "11:00 – 11:30",
    pitch1: { tag: "B1", teams: "IT31  VS  IT15" },
    pitch2: { tag: "A3", teams: "IT22  VS  IT30" },
  },
  {
    time: "11:30 – 12:00",
    pitch1: { tag: "B2", teams: "IT24  VS  DSI" },
    pitch2: { tag: "A4", teams: "IT32  VS  IT16+17" },
  },
  { time: "12:00 – 12:30", lunch: "พักรับประทานอาหารกลางวัน · 30 นาที" },
  {
    time: "12:30 – 13:00",
    pitch1: { tag: "B3", teams: "IT31  VS  IT24" },
    pitch2: { tag: "A5", teams: "IT27  VS  IT30" },
  },
  {
    time: "13:00 – 13:30",
    pitch1: { tag: "B4", teams: "IT15  VS  DSI" },
    pitch2: { tag: "A6", teams: "IT22  VS  IT16+17" },
  },
  {
    time: "13:30 – 14:00",
    pitch1: { tag: "B5", teams: "IT31  VS  DSI" },
    pitch2: { tag: "A7", teams: "IT27  VS  IT32" },
  },
  {
    time: "14:00 – 14:30",
    pitch1: { tag: "A8", teams: "IT27  VS  IT22" },
    pitch2: { tag: "A9", teams: "IT30  VS  IT16+17" },
  },
  {
    time: "14:30 – 15:00",
    pitch1: { tag: "B6", teams: "IT15  VS  IT24" },
    pitch2: { tag: "A10", teams: "IT32  VS  IT30" },
  },
  {
    time: "15:00 – 15:30",
    pitch1: { tag: "รอบรองฯ 1", teams: "อันดับ 1 สาย A  VS  อันดับ 2 สาย B" },
    pitch2: { tag: "ปิดสนาม", teams: "สนาม 2 ปิด", tone: "muted" },
  },
  {
    time: "15:30 – 16:00",
    pitch1: { tag: "รอบรองฯ 2", teams: "อันดับ 1 สาย B  VS  อันดับ 2 สาย A" },
    pitch2: { tag: "ปิดสนาม", teams: "สนาม 2 ปิด", tone: "muted" },
  },
  {
    time: "16:00 – 16:30",
    pitch1: {
      tag: "ชิงอันดับ 3",
      teams: "ผู้แพ้รอบรองฯ 1  VS  ผู้แพ้รอบรองฯ 2",
    },
    pitch2: { tag: "ปิดสนาม", teams: "สนาม 2 ปิด", tone: "muted" },
  },
  {
    time: "16:30 – 17:00",
    pitch1: {
      tag: "🏆 ชิงชนะเลิศ",
      teams: "ผู้ชนะรอบรองฯ 1  VS  ผู้ชนะรอบรองฯ 2",
      tone: "gold",
    },
    pitch2: { tag: "ปิดสนาม", teams: "สนาม 2 ปิด", tone: "muted" },
  },
  {
    time: "17:00 – 18:00",
    closing: "มอบถ้วยรางวัล · ถ่ายภาพร่วมกัน · สิ้นสุดกิจกรรม",
  },
];

const groups = [
  {
    name: "GROUP A",
    count: "5 ทีม",
    games: "พบกันทั้งหมด 10 นัด",
    teams: ["IT27", "IT22", "IT32", "IT30", "IT16+17"],
  },
  {
    name: "GROUP B",
    count: "4 ทีม",
    games: "พบกันทั้งหมด 6 นัด",
    teams: ["IT31", "IT15", "IT24", "DSI"],
  },
];

function MatchCell({
  match,
  selectedTeam,
}: {
  match?: Match["pitch1"];
  selectedTeam: string | null;
}) {
  if (!match) return null;
  const tone = match.tone ?? "red";
  const isMuted = tone === "muted";
  const isGold = tone === "gold";
  const isHighlighted = selectedTeam && match.teams.includes(selectedTeam);

  if (isMuted) {
    return <span className="text-xs text-neutral-600">{match.teams}</span>;
  }

  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold leading-none tracking-wide ${
          isGold
            ? "border border-amber-500/30 bg-amber-500/15 text-amber-300"
            : isHighlighted
              ? "border border-red-500 bg-red-600 text-white"
              : "border border-red-500/20 bg-red-500/10 text-red-400"
        }`}>
        {match.tag}
      </span>
      <span
        className={`text-xs ${
          isGold
            ? "font-bold text-amber-200"
            : isHighlighted
              ? "font-bold text-white"
              : "font-medium text-neutral-200"
        }`}>
        {match.teams}
      </span>
    </div>
  );
}

function MobilePitchRow({
  pitchLabel,
  pitchColor,
  slot,
  isHighlighted,
}: {
  pitchLabel: string;
  pitchColor: "red" | "neutral";
  slot?: Match["pitch1"];
  isHighlighted: boolean;
}) {
  if (!slot) return null;
  const isMuted = slot.tone === "muted";
  const isGold = slot.tone === "gold";

  if (isMuted) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3.5 py-2 text-xs text-neutral-500">
        <span className="font-semibold text-neutral-600">{pitchLabel}</span>
        <span className="italic">{slot.teams}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors ${
        isHighlighted
          ? "border-red-500 bg-red-600/15 shadow-sm shadow-red-900/30"
          : isGold
            ? "border-amber-500/40 bg-amber-500/10"
            : "border-white/10 bg-white/[0.03]"
      }`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${
            pitchColor === "red"
              ? "bg-red-500/20 text-red-400"
              : "bg-white/10 text-neutral-300"
          }`}>
          {pitchLabel}
        </span>
        <span
          className={`text-xs sm:text-sm leading-snug ${
            isHighlighted
              ? "font-bold text-white underline decoration-red-400 underline-offset-2"
              : isGold
                ? "font-bold text-amber-200"
                : "font-medium text-neutral-200"
          }`}>
          {slot.teams}
        </span>
      </div>
      <span
        className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold leading-none ${
          isGold
            ? "border border-amber-500/40 bg-amber-500/20 text-amber-300"
            : isHighlighted
              ? "border border-red-500 bg-red-600 text-white"
              : "border border-white/15 bg-white/5 text-neutral-400"
        }`}>
        {slot.tag}
      </span>
    </div>
  );
}

export default function ItRelationPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(true);
  const [tourActive, setTourActive] = useState<boolean>(false);

  const completeTour = () => {
    setTourActive(false);
    try {
      localStorage.setItem("sit_fixtures_tour_seen", "true");
    } catch (e) {}
  };

  const startTour = () => {
    setTourActive(true);
    const el = document.getElementById("groups-team-selector");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCloseNotice = () => {
    setShowNoticeModal(false);
    try {
      const seen = localStorage.getItem("sit_fixtures_tour_seen");
      if (!seen) {
        setTimeout(() => {
          startTour();
        }, 350);
      }
    } catch (e) {}
  };

  // คำนวณตารางเวลาของทีมที่เลือก
  const teamSchedule = selectedTeam
    ? matches
        .filter(
          (m) =>
            (m.pitch1 && m.pitch1.teams.includes(selectedTeam)) ||
            (m.pitch2 && m.pitch2.teams.includes(selectedTeam)),
        )
        .map((m) => {
          const isPitch1 = m.pitch1?.teams.includes(selectedTeam);
          const cell = isPitch1 ? m.pitch1 : m.pitch2;
          const pitch = isPitch1 ? "สนาม 1" : "สนาม 2";
          const opponent = (cell?.teams || "")
            .replace(selectedTeam, "")
            .replace("VS", "")
            .trim();
          return {
            time: m.time.split("–")[0].trim(),
            fullTime: m.time,
            pitch,
            tag: cell?.tag,
            opponent,
          };
        })
    : [];

  return (
    <div className="min-h-screen bg-[#050505] px-3.5 pb-24 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      {/* Spotlight Backdrop Overlay */}
      {tourActive && (
        <div
          className="fixed inset-0 z-[8000] bg-black/85 backdrop-blur-sm transition-opacity duration-300"
          onClick={completeTour}
        />
      )}

      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] px-5 py-8 text-center shadow-2xl shadow-black/50 sm:px-8 sm:py-12">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-red-500">
            SIT Football Club · 2026
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
            IT RELATION
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-neutral-400 sm:text-sm">
            รอบแรก 10:00 – 15:00 น. · รอบตัดเชือกไขว้สาย & ชิงชนะเลิศ 15:00 –
            17:00 น.
          </p>

          {/* Location Badge */}
          <div className="mt-3 flex items-center justify-center">
            <a
              href="https://maps.app.goo.gl/ZjeS4cdJpJk1EaVQ9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-950/30 px-3.5 py-1.5 text-xs font-medium text-red-300 transition hover:border-red-400 hover:bg-red-900/40 hover:text-white">
              <MapPin className="h-3.5 w-3.5 text-red-400" />
              <span>สนามฟุตซอลพาร์ค พระราม 2</span>
              <ExternalLink className="h-3 w-3 text-red-400/70" />
            </a>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowNoticeModal(true)}
              className="button-49 w-full sm:w-auto"
              data-text="ข้อชี้แจงการจัดตาราง">
              ข้อชี้แจงการจัดตาราง
            </button>
            <button
              type="button"
              onClick={startTour}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-neutral-300 transition hover:border-red-500/50 hover:bg-white/10 hover:text-white cursor-pointer">
              <span className="text-amber-400">💡</span>
              <span>แนะนำการใช้งาน (Tour)</span>
            </button>
          </div>
        </header>

        {/* Venue Location Banner Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0e0e0e] via-[#141414] to-[#0e0e0e] p-4 sm:p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-red-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    สถานที่จัดการแข่งขัน
                  </span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-neutral-400">
                    RAMA 2
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  ฟุตซอลพาร์ค พระราม 2 (Futsal Park Rama 2)
                </h3>
                <p className="text-xs text-neutral-400">
                  สนามฟุตซอลหญ้าเทียม พระราม 2
                </p>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/ZjeS4cdJpJk1EaVQ9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/30 transition hover:from-red-500 hover:to-red-600 cursor-pointer shrink-0">
              <Navigation className="h-3.5 w-3.5" />
              <span>เปิดนำทางใน Google Maps</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* Groups & Team Selector (with Spotlight target) */}
        <div
          id="groups-team-selector"
          className={`space-y-3.5 transition-all duration-300 ${
            tourActive
              ? "relative z-[8001] rounded-2xl border-2 border-red-500 bg-[#0c0c0c] p-4 sm:p-5 shadow-[0_0_80px_rgba(220,38,38,0.7)]"
              : ""
          }`}>
          {/* Spotlight Tour Guide Card */}
          {tourActive && (
            <div className="relative overflow-hidden rounded-xl border border-red-500/50 bg-gradient-to-r from-red-950/90 via-[#141414] to-[#141414] p-4 sm:p-5 text-white shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg shadow-lg shadow-red-600/50 animate-pulse">
                    💡
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white flex flex-wrap items-center gap-2">
                      คลิกเลือกทีมของคุณตรงนี้ได้เลย!
                      <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                        SPOTLIGHT TOUR
                      </span>
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                      กดคลิกที่ปุ่มชื่อทีมด้านล่าง (เช่น{" "}
                      <strong className="text-white">IT22, IT27, IT31</strong>)
                      เพื่อดูเวลาแข่งขันทุกนัด
                      และระบบจะไฮไลต์ตารางแข่งของทีมนั้นให้เด่นชัดทันที
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={completeTour}
                  className="self-end sm:self-start shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-400 hover:bg-white/10 hover:text-white">
                  ✕ ปิด
                </button>
              </div>
              <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] animate-pulse">
                  <span>👇</span> ลองคลิกที่ปุ่มทีมด้านล่างเลย
                </span>
                <button
                  type="button"
                  onClick={completeTour}
                  className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-red-500 shadow-md shadow-red-600/30">
                  เข้าใจแล้ว
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span className="font-medium">
              เลือกคลิกที่ชื่อทีมเพื่อดูเวลาแข่ง:
            </span>
            {selectedTeam && (
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="text-red-400 hover:text-red-300 underline font-medium">
                ล้างตัวเลือก (ดูทุกทีม)
              </button>
            )}
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            {groups.map((group, index) => (
              <section
                key={group.name}
                className={`rounded-xl border border-white/10 bg-[#0b0b0b] p-4 sm:p-5 ${
                  index === 0
                    ? "border-l-4 border-l-red-600"
                    : "border-l-4 border-l-neutral-600"
                }`}>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-xs font-bold tracking-wider text-white sm:text-sm">
                    {group.name}{" "}
                    <span className="text-neutral-500">({group.count})</span>
                  </h2>
                  <span className="text-[11px] text-neutral-500">
                    {group.games}
                  </span>
                </div>
                <div className="mt-3.5 flex flex-wrap gap-2 sm:gap-2.5">
                  {group.teams.map((team) => {
                    const isSelected = selectedTeam === team;
                    return (
                      <button
                        key={team}
                        type="button"
                        onClick={() => {
                          if (tourActive) completeTour();
                          setSelectedTeam(isSelected ? null : team);
                        }}
                        className={`rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "border-red-500 bg-red-600 text-white shadow-md shadow-red-600/30 font-bold scale-105"
                            : tourActive
                              ? "border-red-400/60 bg-white/[0.08] text-white hover:border-red-400 hover:bg-red-950/40 animate-pulse"
                              : "border-white/10 bg-white/[0.04] text-neutral-300 hover:border-white/30 hover:bg-white/[0.08]"
                        }`}>
                        {team}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Highlight Banner when team is clicked */}
        {selectedTeam && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-500/20 pb-2.5">
              <span className="text-xs sm:text-sm font-bold text-red-300">
                ตารางเวลาของทีม{" "}
                <span className="text-white underline">{selectedTeam}</span> (
                {teamSchedule.length} แมตช์ในรอบแบ่งกลุ่ม)
              </span>
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-neutral-300 hover:bg-white/20">
                ปิด ✕
              </button>
            </div>
            <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {teamSchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/10 bg-black/60 p-3 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-white">
                    <span>{item.fullTime}</span>
                    <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">
                      {item.tag}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-neutral-400 text-xs">
                    <span className="text-neutral-300 font-semibold">
                      {item.pitch}
                    </span>
                    <span>
                      พบ <strong className="text-white">{item.opponent}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Match Card Feed (Comfortable spacing, no squished columns) */}
        <div className="space-y-3.5 md:hidden">
          <div className="flex items-center justify-between px-1 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">
              ตารางการแข่งขัน
            </span>
            <span className="text-[11px] text-neutral-500">
              สนาม 1 & สนาม 2
            </span>
          </div>

          {matches.map((match) => {
            const isPitch1Team =
              selectedTeam && match.pitch1?.teams.includes(selectedTeam);
            const isPitch2Team =
              selectedTeam && match.pitch2?.teams.includes(selectedTeam);
            const isTeamMatch = isPitch1Team || isPitch2Team;
            const isDimmed =
              selectedTeam && !isTeamMatch && !match.lunch && !match.closing;

            if (match.lunch) {
              return (
                <div
                  key={match.time}
                  className={`rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-center transition-all ${
                    isDimmed ? "opacity-35" : "opacity-100"
                  }`}>
                  <div className="font-mono text-xs font-semibold text-amber-400/80">
                    {match.time}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-amber-300">
                    ◈ {match.lunch}
                  </div>
                </div>
              );
            }

            if (match.closing) {
              return (
                <div
                  key={match.time}
                  className={`rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-center transition-all ${
                    isDimmed ? "opacity-35" : "opacity-100"
                  }`}>
                  <div className="font-mono text-xs font-semibold text-red-400/80">
                    {match.time}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-red-200">
                    ◈ {match.closing}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={match.time}
                className={`rounded-xl border p-4 transition-all duration-200 ${
                  isTeamMatch
                    ? "border-red-500/60 bg-red-950/20 shadow-lg shadow-red-950/40 ring-1 ring-red-500/30"
                    : "border-white/10 bg-[#0b0b0b]"
                } ${isDimmed ? "opacity-35" : "opacity-100"}`}>
                {/* Card Header with Time */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 text-xs">⏰</span>
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-wide text-white">
                      {match.time}
                    </span>
                  </div>
                  {isTeamMatch && (
                    <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-red-600/50">
                      แมตช์ของ {selectedTeam}
                    </span>
                  )}
                </div>

                {/* Pitch Slots */}
                <div className="mt-3 space-y-2.5">
                  <MobilePitchRow
                    pitchLabel="สนาม 1"
                    pitchColor="red"
                    slot={match.pitch1}
                    isHighlighted={!!isPitch1Team}
                  />
                  <MobilePitchRow
                    pitchLabel="สนาม 2"
                    pitchColor="neutral"
                    slot={match.pitch2}
                    isHighlighted={!!isPitch2Team}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Schedule Table (Shown on md+ screens for full dual-pitch overview) */}
        <section className="hidden md:block overflow-hidden rounded-xl border border-white/10 bg-[#090909]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                <tr>
                  <th className="w-[18%] border-b border-white/10 px-5 py-4 font-semibold">
                    Time
                  </th>
                  <th className="w-[41%] border-b border-white/10 px-5 py-4 font-semibold text-red-400">
                    Pitch 1 · 10:00–18:00
                  </th>
                  <th className="w-[41%] border-b border-white/10 px-5 py-4 font-semibold text-neutral-300">
                    Pitch 2 · 11:00–15:00
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {matches.map((match) => {
                  const isTeamMatch =
                    selectedTeam &&
                    ((match.pitch1 &&
                      match.pitch1.teams.includes(selectedTeam)) ||
                      (match.pitch2 &&
                        match.pitch2.teams.includes(selectedTeam)));
                  const isDimmed =
                    selectedTeam &&
                    !isTeamMatch &&
                    !match.lunch &&
                    !match.closing;

                  return (
                    <tr
                      key={match.time}
                      className={`transition-all duration-200 ${
                        isTeamMatch
                          ? "bg-red-950/25 border-l-4 border-l-red-500"
                          : match.lunch
                            ? "bg-amber-500/[0.04]"
                            : match.closing
                              ? "bg-red-500/[0.04]"
                              : "hover:bg-white/[0.02]"
                      } ${isDimmed ? "opacity-25" : "opacity-100"}`}>
                      <td
                        className={`whitespace-nowrap px-5 py-3.5 font-mono text-xs font-semibold ${
                          isTeamMatch
                            ? "text-red-400 font-bold"
                            : match.lunch
                              ? "text-amber-400"
                              : "text-neutral-400"
                        }`}>
                        {match.time}
                      </td>
                      {match.lunch ? (
                        <td
                          colSpan={2}
                          className="px-5 py-3.5 text-center text-xs font-semibold tracking-wide text-amber-400">
                          ◈ {match.lunch}
                        </td>
                      ) : match.closing ? (
                        <td
                          colSpan={2}
                          className="px-5 py-4 text-center text-xs font-semibold text-red-300">
                          ◈ {match.closing}
                        </td>
                      ) : (
                        <>
                          <td className="px-5 py-3.5">
                            <MatchCell
                              match={match.pitch1}
                              selectedTeam={selectedTeam}
                            />
                          </td>
                          <td className="px-5 py-3.5">
                            <MatchCell
                              match={match.pitch2}
                              selectedTeam={selectedTeam}
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["คู่เปิดสนาม", "IT22 vs IT32", "text-red-400"],
            ["สนาม 2", "ครบ 7 สล็อต (11:00–15:00)", "text-neutral-300"],
            [
              "รอบตัดเชือก & ชิงชนะเลิศ",
              "เริ่ม 15:00 น. รวม 4 คู่",
              "text-amber-400",
            ],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-[#0b0b0b] p-4 text-center">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                {label}
              </p>
              <p className={`mt-1.5 text-xs sm:text-sm font-bold ${color}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Notice Modal */}
        <SystemModal
          open={showNoticeModal}
          onClose={handleCloseNotice}
          title="ข้อชี้แจงเรื่องการจัดตารางการแข่งขัน"
          maxWidthClassName="max-w-lg"
          footer={
            <button
              type="button"
              onClick={handleCloseNotice}
              className="button-49 w-full"
              data-text="รับทราบ">
              รับทราบ
            </button>
          }>
          <div className="space-y-3.5 text-sm leading-relaxed text-neutral-300">
            <p>
              เนื่องจากเวลาการใช้สนามมีจำกัด จึงขอเรียนให้ทุกทีมทราบว่า
              การจัดตารางการแข่งขันอาจไม่สามารถตรงตามความต้องการของทุกทีมได้ทั้งหมด
            </p>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 space-y-2">
              <div className="text-xs font-semibold text-neutral-400">
                ⏰ ช่วงเวลาการใช้สนามแต่ละสนาม:
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400">สนาม 1 (Pitch 1)</span>
                    <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-300">
                      8 ชม.
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-white">
                    10:00 – 18:00 น.
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-300">สนาม 2 (Pitch 2)</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-neutral-400">
                      4 ชม.
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-white">
                    11:00 – 15:00 น.
                  </div>
                </div>
              </div>
            </div>

            <p>
              อย่างไรก็ตาม
              ทางผู้จัดได้พยายามจัดสรรเวลาให้เหมาะสมและลงตัวมากที่สุดแล้ว
              จึงขอความเข้าใจและขอขอบคุณทุกทีมสำหรับความร่วมมือครับ
            </p>
          </div>
        </SystemModal>
      </div>
    </div>
  );
}

// "use client";

// import { FormEvent, useEffect, useState } from "react";
// import { Eye, Globe, LayoutGrid, Plus, ShieldCheck, Table as TableIcon, Trash2, User, UsersRound } from "lucide-react";
// import SystemModal from "@/components/ui/SystemModal";
// import { useToast } from "@/hooks/useToast";
// import { useAuth } from "@/hooks/useAuth";

// const departments = ["IT", "CS", "DSI"] as const;
// type Department = (typeof departments)[number];
// type Team = {
//   id: number;
//   name: string;
//   generation: string;
//   department: Department;
//   members: string[];
// };

// type Language = "th" | "en";

// const content = {
//   th: {
//     tagline: "SIT FOOTBALL CLUB · 2026",
//     titleMain: "IT RELATION",
//     titleSub: "TOURNAMENT",
//     description: "ลงทะเบียนทีม เลือกรุ่นและสาขา พร้อมเพิ่มรายชื่อผู้เล่นได้ทันที",
//     btnRegister: "สมัครทีม",
//     btnEdit: "แก้ไขทีม",
//     sectionTag: "REGISTERED TEAMS",
//     sectionTitle: "รายชื่อทีมที่สมัครแล้ว",
//     teamsCount: (count: number) => `${count} ทีม`,
//     loadError: "โหลดรายชื่อทีมไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง",
//     emptyTeams: "ยังไม่มีทีมสมัคร เป็นทีมแรกได้เลย",
//     teamMeta: (gen: string, dept: string, count: number) =>
//       `รุ่น ${gen} · ${dept} · ${count} คน`,
//     btnViewItem: "ดูรายชื่อ",
//     btnEditItem: "แก้ไข",
//     btnDeleteItem: "ลบ",
//     noticeText:
//       "ตั้งรหัสทีมและเก็บไว้ให้ดี รหัสนี้ใช้แก้ไขรายชื่อหรือลบทีมภายหลังได้ โดยหนึ่งชื่อทีมสมัครได้หนึ่งครั้งต่อหนึ่งรุ่น",
//     // View Modal
//     viewModalTitle: "รายชื่อผู้เล่น",
//     viewModalTotal: (count: number) => `สมาชิกทั้งหมด ${count} คน`,
//     // Edit Modal Step 1 & 2
//     modalTitleRegister: "สมัครทีม",
//     modalTitleEditStep1: "แก้ไขทีม (ขั้นตอนที่ 1/2: ยืนยันรหัส)",
//     modalTitleEditStep2: "แก้ไขทีม (ขั้นตอนที่ 2/2: แก้ไขข้อมูล)",
//     modalDescRegister: "กรอกข้อมูลทีมและตั้งรหัสสำหรับแก้ไขภายหลัง",
//     modalDescEditStep1: "เลือกรุ่น/ทีม และกรอกรหัสทีมเพื่อยืนยันสิทธิ์แก้ไข",
//     modalDescEditStep2: "แก้ไขสาขาและรายชื่อผู้เล่นของทีม",
//     labelSelectTeam: "เลือกทีมที่ต้องการแก้ไข",
//     selectTeamPlaceholder: "-- เลือกทีมจากรายการ --",
//     labelTeamName: "ชื่อทีม",
//     placeholderTeamName: "เช่น SIT United",
//     labelGeneration: "รุ่น",
//     placeholderGeneration: "เช่น 66",
//     labelDepartment: "Department",
//     labelMembers: "รายชื่อสมาชิก",
//     btnAddMember: "เพิ่มชื่อ",
//     placeholderMember: (index: number) => `สมาชิกคนที่ ${index}`,
//     ariaRemoveMember: (index: number) => `ลบสมาชิกคนที่ ${index}`,
//     labelPassword: "รหัสทีม",
//     placeholderPassword: "อย่างน้อย 6 ตัวอักษร",
//     editNote: "ชื่อทีมและรุ่นใช้ระบุทีม จึงไม่สามารถเปลี่ยนในขั้นตอนนี้ได้",
//     submitting: "กำลังบันทึก...",
//     verifying: "กำลังตรวจสอบ...",
//     btnVerifyPassword: "ยืนยันรหัสเพื่อแก้ไข",
//     btnSubmitRegister: "ลงทะเบียนทีม",
//     btnSubmitEdit: "บันทึกการแก้ไข",
//     btnBackStep1: "ย้อนกลับ / เลือกทีมอื่น",
//     // Delete Modal
//     deleteModalTitle: "ยืนยันลบทีม",
//     deleteModalDesc: "กรอกรหัสทีมเพื่อยืนยันการลบทีมนี้ออกจากระบบ",
//     deleteWarningText: (name: string, gen: string) =>
//       `คุณกำลังจะลบทีม "${name}" (รุ่น ${gen}) การดำเนินการนี้ไม่สามารถยกเลิกได้`,
//     btnConfirmDelete: "ยืนยันลบทีม",
//     deleting: "กำลังลบทีม...",
//     toastSuccessDelete: "ลบทีมเรียบร้อยแล้ว",
//     toastDeleteError: "ลบทีมไม่สำเร็จ หรือรหัสทีมไม่ถูกต้อง",
//     // Toasts
//     toastSuccessRegister: "ลงทะเบียนทีมเรียบร้อย",
//     toastSuccessEdit: "บันทึกการแก้ไขแล้ว",
//     toastErrorTitle: "เกิดข้อผิดพลาด",
//     toastDefaultError: "เกิดข้อผิดพลาดในการดำเนินการ",
//     toastVerifySuccess: "ยืนยันรหัสผ่านเรียบร้อย",
//     toastInvalidPassword: "ไม่พบทีม หรือรหัสทีมไม่ถูกต้อง",
//   },
//   en: {
//     tagline: "SIT FOOTBALL CLUB · 2026",
//     titleMain: "IT RELATION",
//     titleSub: "TOURNAMENT",
//     description:
//       "Register your team, select batch and department, and add players instantly.",
//     btnRegister: "REGISTER TEAM",
//     btnEdit: "EDIT TEAM",
//     sectionTag: "REGISTERED TEAMS",
//     sectionTitle: "Registered Teams",
//     teamsCount: (count: number) => `${count} ${count === 1 ? "team" : "teams"}`,
//     loadError: "Failed to load registered teams. Please refresh the page.",
//     emptyTeams: "No teams registered yet. Be the first to join!",
//     teamMeta: (gen: string, dept: string, count: number) =>
//       `Batch ${gen} · ${dept} · ${count} ${count === 1 ? "player" : "players"}`,
//     btnViewItem: "View Roster",
//     btnEditItem: "Edit",
//     btnDeleteItem: "Delete",
//     noticeText:
//       "Keep your team password safe! This code is required for future edits or deletion. Each team name can register once per batch.",
//     // View Modal
//     viewModalTitle: "Team Roster",
//     viewModalTotal: (count: number) =>
//       `Total ${count} ${count === 1 ? "player" : "players"}`,
//     // Edit Modal Step 1 & 2
//     modalTitleRegister: "Register Team",
//     modalTitleEditStep1: "Edit Team (Step 1/2: Verify Password)",
//     modalTitleEditStep2: "Edit Team (Step 2/2: Update Details)",
//     modalDescRegister:
//       "Fill in team details and set a password for future edits",
//     modalDescEditStep1: "Select team and enter password to unlock editing access",
//     modalDescEditStep2: "Modify department and player roster",
//     labelSelectTeam: "Select Team to Edit",
//     selectTeamPlaceholder: "-- Select a team --",
//     labelTeamName: "Team Name",
//     placeholderTeamName: "e.g. SIT United",
//     labelGeneration: "Batch",
//     placeholderGeneration: "e.g. 66",
//     labelDepartment: "Department",
//     labelMembers: "Team Members",
//     btnAddMember: "Add Member",
//     placeholderMember: (index: number) => `Member #${index}`,
//     ariaRemoveMember: (index: number) => `Remove member #${index}`,
//     labelPassword: "Team Password",
//     placeholderPassword: "At least 6 characters",
//     editNote:
//       "Team name and batch identify your team and cannot be changed here.",
//     submitting: "Saving...",
//     verifying: "Verifying...",
//     btnVerifyPassword: "Verify Password & Edit",
//     btnSubmitRegister: "Register Team",
//     btnSubmitEdit: "Save Changes",
//     btnBackStep1: "Back / Change Team",
//     // Delete Modal
//     deleteModalTitle: "Confirm Team Deletion",
//     deleteModalDesc: "Enter team password to confirm deleting this team",
//     deleteWarningText: (name: string, gen: string) =>
//       `You are about to delete team "${name}" (Batch ${gen}). This action cannot be undone.`,
//     btnConfirmDelete: "Confirm Delete Team",
//     deleting: "Deleting...",
//     toastSuccessDelete: "Team deleted successfully",
//     toastDeleteError: "Failed to delete team or incorrect password",
//     // Toasts
//     toastSuccessRegister: "Team registered successfully",
//     toastSuccessEdit: "Changes saved successfully",
//     toastErrorTitle: "Action Failed",
//     toastDefaultError: "An error occurred during operation",
//     toastVerifySuccess: "Password verified! You may now edit the team.",
//     toastInvalidPassword: "Team not found or incorrect password.",
//   },
// };

// export default function ItRelationPage() {
//   const toast = useToast();
//   const { user } = useAuth();
//   const isAdmin = user?.role === "admin";

//   const [lang, setLang] = useState<Language>("th");
//   const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
//   const [mode, setMode] = useState<"register" | "edit">("register");
//   const [editStep, setEditStep] = useState<1 | 2>(1);
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     if (isAdmin) {
//       setViewMode("table");
//     }
//   }, [isAdmin]);

//   // View modal state
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedViewTeam, setSelectedViewTeam] = useState<Team | null>(null);

//   // Delete modal state
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedDeleteTeam, setSelectedDeleteTeam] = useState<Team | null>(null);
//   const [deletePassword, setDeletePassword] = useState("");
//   const [deleting, setDeleting] = useState(false);

//   // Form states
//   const [name, setName] = useState("");
//   const [generation, setGeneration] = useState("");
//   const [department, setDepartment] = useState<Department>("IT");
//   const [members, setMembers] = useState([""]);
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [verifying, setVerifying] = useState(false);

//   const [teams, setTeams] = useState<Team[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [listError, setListError] = useState(false);

//   const t = content[lang];

//   useEffect(() => {
//     fetch("/api/tournament-teams")
//       .then((response) => (response.ok ? response.json() : Promise.reject()))
//       .then(setTeams)
//       .catch(() => setListError(true))
//       .finally(() => setLoading(false));
//   }, []);

//   function openForm(nextMode: "register" | "edit", team?: Team) {
//     setMode(nextMode);
//     setEditStep(1);
//     setPassword("");
//     if (team) {
//       setName(team.name);
//       setGeneration(team.generation);
//       setDepartment(team.department);
//       setMembers(team.members.length ? team.members : [""]);
//     } else if (nextMode === "register") {
//       setName("");
//       setGeneration("");
//       setDepartment("IT");
//       setMembers([""]);
//     } else {
//       // Edit from header button
//       setName("");
//       setGeneration("");
//       setDepartment("IT");
//       setMembers([""]);
//     }
//     setModalOpen(true);
//   }

//   function openViewModal(team: Team) {
//     setSelectedViewTeam(team);
//     setViewModalOpen(true);
//   }

//   function openDeleteModal(team: Team) {
//     setSelectedDeleteTeam(team);
//     setDeletePassword("");
//     setDeleteModalOpen(true);
//   }

//   const updateMember = (index: number, value: string) =>
//     setMembers((current) =>
//       current.map((member, i) => (i === index ? value : member)),
//     );
//   const removeMember = (index: number) =>
//     setMembers((current) =>
//       current.length === 1 ? current : current.filter((_, i) => i !== index),
//     );

//   // Handle Step 1 Verification
//   async function handleVerifyPassword(event: FormEvent) {
//     event.preventDefault();
//     if (!name.trim() || !generation.trim() || password.length < 6) {
//       toast.error(t.toastInvalidPassword, t.toastErrorTitle);
//       return;
//     }

//     setVerifying(true);
//     try {
//       const response = await fetch("/api/tournament-teams/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name.trim(),
//           generation: generation.trim(),
//           password,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok || !data.success) {
//         throw new Error(data.error || t.toastInvalidPassword);
//       }

//       // Populate data from verified team
//       const team: Team = data.team;
//       setName(team.name);
//       setGeneration(team.generation);
//       setDepartment(team.department);
//       setMembers(team.members.length ? team.members : [""]);

//       toast.success(t.toastVerifySuccess, "IT Relation Tournament");
//       setEditStep(2);
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : t.toastInvalidPassword,
//         t.toastErrorTitle,
//       );
//     } finally {
//       setVerifying(false);
//     }
//   }

//   // Handle Final Submit (Register POST / Edit Step 2 PATCH)
//   async function submit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setSubmitting(true);
//     try {
//       const response = await fetch("/api/tournament-teams", {
//         method: mode === "register" ? "POST" : "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           generation,
//           department,
//           members,
//           password,
//         }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || t.toastDefaultError);

//       setTeams((current) => [
//         data,
//         ...current.filter((team) => team.id !== data.id),
//       ]);
//       setModalOpen(false);
//       toast.success(
//         mode === "register" ? t.toastSuccessRegister : t.toastSuccessEdit,
//         "IT Relation Tournament",
//       );
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : t.toastDefaultError,
//         t.toastErrorTitle,
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // Handle Team Deletion
//   async function handleDeleteTeam(event: FormEvent) {
//     event.preventDefault();
//     if (!selectedDeleteTeam) return;

//     if (!isAdmin && deletePassword.length < 6) {
//       toast.error(t.toastDeleteError, t.toastErrorTitle);
//       return;
//     }

//     setDeleting(true);
//     try {
//       const response = await fetch("/api/tournament-teams", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           isAdmin
//             ? { id: selectedDeleteTeam.id }
//             : {
//                 name: selectedDeleteTeam.name,
//                 generation: selectedDeleteTeam.generation,
//                 password: deletePassword,
//               },
//         ),
//       });

//       const data = await response.json();
//       if (!response.ok || !data.success) {
//         throw new Error(data.error || t.toastDeleteError);
//       }

//       setTeams((current) => current.filter((item) => item.id !== data.id));
//       setDeleteModalOpen(false);
//       toast.success(
//         isAdmin
//           ? lang === "th"
//             ? "ลบทีมเรียบร้อยแล้ว (Admin)"
//             : "Team deleted (Admin)"
//           : t.toastSuccessDelete,
//         "IT Relation Tournament",
//       );
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : t.toastDeleteError,
//         t.toastErrorTitle,
//       );
//     } finally {
//       setDeleting(false);
//     }
//   }

//   return (
//     <div
//       className={`min-h-screen bg-[#050505] px-5 pb-20 pt-28 ${
//         lang === "th" ? "font-kanit" : ""
//       }`}>
//       <div className="mx-auto max-w-3xl">
//         <header className="pb-8">
//           <div className="flex items-center justify-between gap-4">
//             <p className="font-mono text-xs tracking-[0.25em] text-red-500">
//               {t.tagline}
//             </p>
//             <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-[11px] font-semibold tracking-wider">
//               <Globe className="ml-1.5 h-3.5 w-3.5 text-neutral-400" />
//               <button
//                 onClick={() => setLang("th")}
//                 className={`rounded-full px-2.5 py-0.5 transition ${
//                   lang === "th"
//                     ? "bg-red-600 text-white"
//                     : "text-neutral-400 hover:text-white"
//                 }`}>
//                 TH
//               </button>
//               <button
//                 onClick={() => setLang("en")}
//                 className={`rounded-full px-2.5 py-0.5 transition ${
//                   lang === "en"
//                     ? "bg-red-600 text-white"
//                     : "text-neutral-400 hover:text-white"
//                 }`}>
//                 EN
//               </button>
//             </div>
//           </div>

//           <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">
//             {t.titleMain}
//             <br />
//             <span className="text-neutral-500">{t.titleSub}</span>
//           </h1>
//           <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-400">
//             {t.description}
//           </p>
//           <div className="mt-7 flex flex-wrap gap-3">
//             <button
//               onClick={() => openForm("register")}
//               className="bg-red-600 px-5 py-3 text-xs font-bold tracking-[0.15em] text-white transition hover:bg-red-500">
//               {t.btnRegister}
//             </button>
//             <button
//               onClick={() => openForm("edit")}
//               className="border border-white/15 px-5 py-3 text-xs font-bold tracking-[0.15em] text-white transition hover:border-white/40">
//               {t.btnEdit}
//             </button>
//           </div>
//         </header>

//         <section className="mt-8 pt-4">
//           <div className="flex items-end justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-2">
//                 <p className="font-mono text-xs tracking-[0.2em] text-red-500">
//                   {t.sectionTag}
//                 </p>
//                 {isAdmin && (
//                   <span className="inline-flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400">
//                     <ShieldCheck className="h-3 w-3" />
//                     ADMIN MODE
//                   </span>
//                 )}
//               </div>
//               <h2 className="mt-2 font-display text-2xl font-semibold">
//                 {t.sectionTitle}
//               </h2>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
//                 <button
//                   onClick={() => setViewMode("grid")}
//                   title="Grid View"
//                   className={`rounded p-1.5 transition ${
//                     viewMode === "grid"
//                       ? "bg-red-600 text-white"
//                       : "text-neutral-400 hover:text-white"
//                   }`}>
//                   <LayoutGrid className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("table")}
//                   title="Table View"
//                   className={`rounded p-1.5 transition ${
//                     viewMode === "table"
//                       ? "bg-red-600 text-white"
//                       : "text-neutral-400 hover:text-white"
//                   }`}>
//                   <TableIcon className="h-4 w-4" />
//                 </button>
//               </div>
//               <span className="text-sm text-neutral-500">
//                 {t.teamsCount(teams.length)}
//               </span>
//             </div>
//           </div>
//           {loading ? (
//             <div className="mt-5 space-y-3">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="flex flex-col justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-4 animate-pulse sm:flex-row sm:items-center">
//                   <div className="space-y-2">
//                     <div className="h-5 w-36 rounded bg-white/10 sm:w-48" />
//                     <div className="h-3.5 w-44 rounded bg-white/5 sm:w-56" />
//                   </div>
//                   <div className="flex items-center gap-2 pt-1 sm:pt-0">
//                     <div className="h-8 w-20 rounded border border-white/5 bg-white/5" />
//                     <div className="h-8 w-14 rounded border border-white/5 bg-white/5" />
//                     <div className="h-8 w-14 rounded border border-white/5 bg-white/5" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : listError ? (
//             <p className="mt-5 text-sm text-red-400">{t.loadError}</p>
//           ) : teams.length ? (
//             viewMode === "table" ? (
//               <div className="mt-5 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.02]">
//                 <table className="w-full text-left text-sm text-neutral-300">
//                   <thead className="border-b border-white/10 bg-white/[0.04] text-xs font-semibold uppercase tracking-wider text-neutral-400">
//                     <tr>
//                       <th scope="col" className="px-4 py-3.5">#</th>
//                       <th scope="col" className="px-4 py-3.5">{lang === "th" ? "ชื่อทีม" : "Team Name"}</th>
//                       <th scope="col" className="px-4 py-3.5">{lang === "th" ? "รุ่น" : "Batch"}</th>
//                       <th scope="col" className="px-4 py-3.5">{lang === "th" ? "สาขา" : "Department"}</th>
//                       <th scope="col" className="px-4 py-3.5">{lang === "th" ? "สมาชิก" : "Members"}</th>
//                       <th scope="col" className="px-4 py-3.5 text-right">{lang === "th" ? "การดำเนินการ" : "Actions"}</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-white/5">
//                     {teams.map((team, idx) => (
//                       <tr key={team.id} className="transition hover:bg-white/[0.04]">
//                         <td className="px-4 py-4 font-mono text-xs text-neutral-500">{idx + 1}</td>
//                         <td className="px-4 py-4 font-medium text-white">{team.name}</td>
//                         <td className="px-4 py-4 text-neutral-300">รุ่น {team.generation}</td>
//                         <td className="px-4 py-4">
//                           <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
//                             {team.department}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-neutral-400">
//                           <button
//                             onClick={() => openViewModal(team)}
//                             className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white hover:underline">
//                             <Eye className="h-3.5 w-3.5 text-neutral-400" />
//                             {team.members.length} {lang === "th" ? "คน" : "players"}
//                           </button>
//                         </td>
//                         <td className="px-4 py-4 text-right">
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               onClick={() => openViewModal(team)}
//                               className="flex items-center gap-1 border border-white/10 px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-neutral-300 transition hover:border-white/30 hover:text-white rounded">
//                               <Eye className="h-3 w-3" />
//                               {t.btnViewItem}
//                             </button>
//                             <button
//                               onClick={() => openForm("edit", team)}
//                               className="border border-white/10 px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-neutral-300 transition hover:border-white/30 hover:text-white rounded">
//                               {t.btnEditItem}
//                             </button>
//                             <button
//                               onClick={() => openDeleteModal(team)}
//                               className="flex items-center gap-1 border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-red-400 transition hover:border-red-500 hover:bg-red-600 hover:text-white rounded">
//                               <Trash2 className="h-3 w-3" />
//                               {t.btnDeleteItem}
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="mt-5 space-y-3">
//                 {teams.map((team) => (
//                   <div
//                     key={team.id}
//                     className="flex flex-col justify-between gap-4 rounded-lg bg-white/[0.02] p-4 transition sm:flex-row sm:items-center hover:bg-white/[0.04]">
//                     <div>
//                       <h3 className="font-medium text-white">{team.name}</h3>
//                       <p className="mt-1 text-xs text-neutral-500">
//                         {t.teamMeta(
//                           team.generation,
//                           team.department,
//                           team.members.length,
//                         )}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => openViewModal(team)}
//                         className="flex items-center gap-1.5 border border-white/10 px-3 py-2 text-[10px] font-bold tracking-widest text-neutral-300 transition hover:border-white/30 hover:text-white">
//                         <Eye className="h-3.5 w-3.5 text-neutral-400" />
//                         {t.btnViewItem}
//                       </button>
//                       <button
//                         onClick={() => openForm("edit", team)}
//                         className="border border-white/10 px-3 py-2 text-[10px] font-bold tracking-widest text-neutral-300 transition hover:border-red-500 hover:text-white">
//                         {t.btnEditItem}
//                       </button>
//                       <button
//                         onClick={() => openDeleteModal(team)}
//                         className="flex items-center gap-1 border border-red-500/20 bg-red-500/5 px-3 py-2 text-[10px] font-bold tracking-widest text-red-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white">
//                         <Trash2 className="h-3.5 w-3.5" />
//                         {t.btnDeleteItem}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )
//           ) : (
//             <p className="mt-5 text-sm text-neutral-500">{t.emptyTeams}</p>
//           )}
//         </section>

//         <aside className="mt-10 flex gap-4 border border-white/10 bg-white/[0.03] p-5">
//           <UsersRound className="h-6 w-6 shrink-0 text-red-500" />
//           <p className="text-xs leading-5 text-neutral-400">{t.noticeText}</p>
//         </aside>
//       </div>

//       {/* VIEW ROSTER MODAL */}
//       <SystemModal
//         open={viewModalOpen}
//         onClose={() => setViewModalOpen(false)}
//         title={selectedViewTeam ? selectedViewTeam.name : t.viewModalTitle}
//         description={
//           selectedViewTeam
//             ? `${t.teamMeta(
//                 selectedViewTeam.generation,
//                 selectedViewTeam.department,
//                 selectedViewTeam.members.length,
//               )}`
//             : ""
//         }
//         maxWidthClassName="max-w-md">
//         {selectedViewTeam && (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between border-b border-white/10 pb-3">
//               <span className="font-mono text-xs text-red-400">
//                 {t.viewModalTitle}
//               </span>
//               <span className="text-xs text-neutral-400">
//                 {t.viewModalTotal(selectedViewTeam.members.length)}
//               </span>
//             </div>
//             <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
//               {selectedViewTeam.members.map((member, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-3 rounded bg-white/[0.04] px-3 py-2.5 text-sm text-white">
//                   <span className="flex h-6 w-6 items-center justify-center rounded bg-red-600/20 font-mono text-xs font-bold text-red-400">
//                     {index + 1}
//                   </span>
//                   <User className="h-4 w-4 text-neutral-400" />
//                   <span>{member}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </SystemModal>

//       {/* DELETE TEAM MODAL */}
//       <SystemModal
//         open={deleteModalOpen}
//         onClose={() => !deleting && setDeleteModalOpen(false)}
//         title={isAdmin ? (lang === "th" ? "ยืนยันลบทีม (Admin)" : "Confirm Delete (Admin)") : t.deleteModalTitle}
//         description={isAdmin ? (lang === "th" ? "ลบทีมออกจากระบบทันทีในฐานะ Admin" : "Delete team immediately as Admin") : t.deleteModalDesc}
//         maxWidthClassName="max-w-md">
//         {selectedDeleteTeam && (
//           <form onSubmit={handleDeleteTeam} className="space-y-5">
//             <div className="rounded bg-red-500/10 border border-red-500/20 p-3 text-xs leading-5 text-red-300">
//               {isAdmin
//                 ? (lang === "th"
//                     ? `คุณกำลังจะลบทีม "${selectedDeleteTeam.name}" (รุ่น ${selectedDeleteTeam.generation}) ออกจากระบบ การดำเนินการนี้โดย Admin ไม่ต้องใช้รหัสผ่าน`
//                     : `You are deleting team "${selectedDeleteTeam.name}" (Batch ${selectedDeleteTeam.generation}). As Admin, no password is required.`)
//                 : t.deleteWarningText(
//                     selectedDeleteTeam.name,
//                     selectedDeleteTeam.generation,
//                   )}
//             </div>

//             {!isAdmin && (
//               <label className="block text-sm font-medium">
//                 {t.labelPassword}
//                 <input
//                   required
//                   minLength={6}
//                   type="password"
//                   value={deletePassword}
//                   onChange={(event) => setDeletePassword(event.target.value)}
//                   className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
//                   placeholder={t.placeholderPassword}
//                 />
//               </label>
//             )}

//             <div className="flex gap-3 pt-1">
//               <button
//                 type="button"
//                 onClick={() => setDeleteModalOpen(false)}
//                 disabled={deleting}
//                 className="border border-white/15 px-4 py-3 text-xs font-bold tracking-wider text-neutral-300 transition hover:border-white/40 disabled:opacity-50">
//                 Cancel
//               </button>
//               <button
//                 disabled={deleting}
//                 type="submit"
//                 className="flex-1 bg-red-600 px-5 py-3.5 text-xs font-bold tracking-[0.15em] text-white transition hover:bg-red-500 disabled:bg-neutral-700">
//                 {deleting ? t.deleting : isAdmin ? (lang === "th" ? "ยืนยันลบทีมทันที" : "Delete Team Immediately") : t.btnConfirmDelete}
//               </button>
//             </div>
//           </form>
//         )}
//       </SystemModal>

//       {/* REGISTER / EDIT MODAL */}
//       <SystemModal
//         open={modalOpen}
//         onClose={() => !submitting && !verifying && setModalOpen(false)}
//         title={
//           mode === "register"
//             ? t.modalTitleRegister
//             : editStep === 1
//               ? t.modalTitleEditStep1
//               : t.modalTitleEditStep2
//         }
//         description={
//           mode === "register"
//             ? t.modalDescRegister
//             : editStep === 1
//               ? t.modalDescEditStep1
//               : t.modalDescEditStep2
//         }
//         maxWidthClassName="max-w-2xl">
//         {mode === "edit" && editStep === 1 ? (
//           /* EDIT STEP 1: SELECT TEAM & VERIFY PASSWORD */
//           <form onSubmit={handleVerifyPassword} className="space-y-5">
//             {teams.length > 0 && (
//               <div>
//                 <label className="block text-sm font-medium text-neutral-300">
//                   {t.labelSelectTeam}
//                 </label>
//                 <select
//                   onChange={(e) => {
//                     const found = teams.find(
//                       (item) => String(item.id) === e.target.value,
//                     );
//                     if (found) {
//                       setName(found.name);
//                       setGeneration(found.generation);
//                     }
//                   }}
//                   className="mt-2 w-full border border-white/15 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-red-500">
//                   <option value="">{t.selectTeamPlaceholder}</option>
//                   {teams.map((item) => (
//                     <option key={item.id} value={item.id}>
//                       {item.name} (รุ่น {item.generation} · {item.department})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-3">
//               <label className="block text-sm font-medium">
//                 {t.labelTeamName}
//                 <input
//                   required
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                   className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
//                   placeholder={t.placeholderTeamName}
//                 />
//               </label>
//               <label className="block text-sm font-medium">
//                 {t.labelGeneration}
//                 <input
//                   required
//                   value={generation}
//                   onChange={(event) => setGeneration(event.target.value)}
//                   className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
//                   placeholder={t.placeholderGeneration}
//                 />
//               </label>
//             </div>

//             <label className="block text-sm font-medium">
//               {t.labelPassword}
//               <input
//                 required
//                 minLength={6}
//                 type="password"
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
//                 placeholder={t.placeholderPassword}
//               />
//             </label>

//             <button
//               disabled={verifying}
//               type="submit"
//               className="w-full bg-red-600 px-5 py-4 text-xs font-bold tracking-[0.18em] text-white transition hover:bg-red-500 disabled:bg-neutral-700">
//               {verifying ? t.verifying : t.btnVerifyPassword}
//             </button>
//           </form>
//         ) : (
//           /* REGISTER FORM OR EDIT STEP 2 */
//           <form
//             onSubmit={submit}
//             className="max-h-[68vh] space-y-5 overflow-y-auto pr-1">
//             <div className="grid grid-cols-2 gap-3">
//               <label className="block text-sm font-medium">
//                 {t.labelTeamName}
//                 <input
//                   required
//                   disabled={mode === "edit"}
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                   className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:opacity-60"
//                   placeholder={t.placeholderTeamName}
//                 />
//               </label>
//               <label className="block text-sm font-medium">
//                 {t.labelGeneration}
//                 <input
//                   required
//                   disabled={mode === "edit"}
//                   value={generation}
//                   onChange={(event) => setGeneration(event.target.value)}
//                   className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:opacity-60"
//                   placeholder={t.placeholderGeneration}
//                 />
//               </label>
//             </div>

//             <label className="block text-sm font-medium">
//               {t.labelDepartment}
//               <select
//                 value={department}
//                 onChange={(event) =>
//                   setDepartment(event.target.value as Department)
//                 }
//                 className="mt-2 w-full border border-white/15 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-red-500">
//                 {departments.map((value) => (
//                   <option key={value}>{value}</option>
//                 ))}
//               </select>
//             </label>

//             <div>
//               <div className="mb-2 flex items-center justify-between">
//                 <label className="text-sm font-medium">{t.labelMembers}</label>
//                 <button
//                   type="button"
//                   onClick={() => setMembers((current) => [...current, ""])}
//                   disabled={members.length >= 30}
//                   className="flex items-center gap-1 text-xs text-red-400 disabled:text-neutral-600">
//                   <Plus className="h-3.5 w-3.5" /> {t.btnAddMember}
//                 </button>
//               </div>
//               <div className="space-y-2">
//                 {members.map((member, index) => (
//                   <div key={index} className="flex gap-2">
//                     <input
//                       required
//                       value={member}
//                       onChange={(event) =>
//                         updateMember(index, event.target.value)
//                       }
//                       className="min-w-0 flex-1 border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
//                       placeholder={t.placeholderMember(index + 1)}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeMember(index)}
//                       aria-label={t.ariaRemoveMember(index + 1)}
//                       className="border border-white/10 px-3 text-neutral-500 hover:border-red-500 hover:text-red-400">
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {mode === "register" && (
//               <label className="block text-sm font-medium">
//                 {t.labelPassword}
//                 <input
//                   required
//                   minLength={6}
//                   type="password"
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                   className="mt-2 w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-red-500"
//                   placeholder={t.placeholderPassword}
//                 />
//               </label>
//             )}

//             {mode === "edit" && (
//               <p className="text-xs leading-5 text-neutral-500">{t.editNote}</p>
//             )}

//             <div className="flex gap-3 pt-2">
//               {mode === "edit" && (
//                 <button
//                   type="button"
//                   onClick={() => setEditStep(1)}
//                   className="border border-white/15 px-4 py-3 text-xs font-bold tracking-wider text-neutral-300 transition hover:border-white/40">
//                   {t.btnBackStep1}
//                 </button>
//               )}
//               <button
//                 disabled={submitting}
//                 className="flex-1 bg-red-600 px-5 py-4 text-xs font-bold tracking-[0.18em] text-white transition hover:bg-red-500 disabled:bg-neutral-700">
//                 {submitting
//                   ? t.submitting
//                   : mode === "register"
//                     ? t.btnSubmitRegister
//                     : t.btnSubmitEdit}
//               </button>
//             </div>
//           </form>
//         )}
//       </SystemModal>
//     </div>
//   );
// }
