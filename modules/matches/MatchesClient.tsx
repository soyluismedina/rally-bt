"use client";

import { Player } from "@/types/player";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MatchWithPlayers = {
  id: string;
  dupla1: Player;
  dupla2: Player;
  score1: number | null;
  score2: number | null;
};

export default function MatchesClient({
  rallyId,
  matches: initialMatches,
}: {
  rallyId: string;
  matches: MatchWithPlayers[];
}) {
  const router = useRouter();
  const [matches, setMatches] = useState(initialMatches);

  // const rounds = useMemo(() => {
  //   const map = new Map<number, MatchWithPlayers[]>();
  //   for (const m of matches) {
  //     if (!map.has(m.round)) map.set(m.round, []);
  //     map.get(m.round)!.push(m);
  //   }
  //   return Array.from(map.entries())
  //     .sort(([a], [b]) => a - b)
  //     .map(([round, ms]) => ({ round, matches: ms }));
  // }, [matches]);

  if (matches.length === 0) {
    return (
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p className="text-slate-500">Aún no se generaron las partidas.</p>
          <button
            onClick={() => router.push(`/rally/${rallyId}/participants`)}
            className="text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
          >
            Ir a participantes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/rally/${rallyId}`)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
          >
            &larr; Volver al rally
          </button>
          <span className="text-xs text-slate-400">
            {matches.length} partida{matches.length !== 1 ? "s" : ""}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Partidas</h1>

        <div className="space-y-6">
          {rounds.map(({ round, matches: ms }) => (
            <div key={round}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-white bg-teal-600 px-3 py-1 rounded-full">
                  Ronda {round + 1}
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ms.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    rallyId={rallyId}
                    onUpdate={(updated) => {
                      setMatches((prev) =>
                        prev.map((x) => (x.id === updated.id ? updated : x)),
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DuplaLine({
  duplaId,
  player1,
  player2,
  winnerId,
  onSelectWinner,
}: {
  duplaId: string;
  player1: Player;
  player2: Player;
  winnerId: string;
  onSelectWinner: (id: string) => void;
}) {
  const isWinner = winnerId === duplaId;
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg cursor-pointer transition-all ${
        isWinner
          ? "bg-teal-100 ring-2 ring-teal-400 ring-offset-1"
          : "hover:bg-slate-50"
      }`}
      onClick={() => onSelectWinner(isWinner ? "" : duplaId)}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex -space-x-2">
          <span className="w-7 h-7 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {player1.name.charAt(0).toUpperCase()}
          </span>
          <span className="w-7 h-7 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {player2.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold text-slate-800 truncate">
          {player1.name} & {player2.name}
        </span>
      </div>
      {isWinner && (
        <span className="text-[10px] font-bold text-teal-700 bg-teal-200/60 px-2 py-0.5 rounded-full shrink-0">
          GANADOR
        </span>
      )}
    </div>
  );
}

function MatchCard({
  match,
  rallyId,
  onUpdate,
}: {
  match: MatchWithPlayers;
  rallyId: string;
  onUpdate: (m: MatchWithPlayers) => void;
}) {
  const courtColors = [
    {
      card: "border-teal-200 bg-gradient-to-br from-teal-50/60 to-white",
      badge: "bg-teal-100 text-teal-700",
    },
    {
      card: "border-cyan-200 bg-gradient-to-br from-cyan-50/60 to-white",
      badge: "bg-cyan-100 text-cyan-700",
    },
  ];
  const c = courtColors[match.court % courtColors.length];

  const [score1, setScore1] = useState(match.score1?.toString() ?? "");
  const [score2, setScore2] = useState(match.score2?.toString() ?? "");
  const [winnerId, setWinnerId] = useState(match.winnerId ?? "");
  const [saving, setSaving] = useState(false);

  const hasChanged =
    (score1 || "") !== (match.score1?.toString() ?? "") ||
    (score2 || "") !== (match.score2?.toString() ?? "") ||
    (winnerId || "") !== (match.winnerId ?? "");

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/rally/${rallyId}/matches/${match.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score1: score1 || null,
        score2: score2 || null,
        winnerId: winnerId || null,
      }),
    });
    const updated = await res.json();
    onUpdate(updated);
    setSaving(false);
  }

  return (
    <div className={`rounded-xl border-2 p-4 ${c.card}`}>
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${c.badge}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Cancha {match.court + 1}
        </span>
      </div>

      <div className="space-y-1">
        <DuplaLine
          duplaId={match.dupla1Id}
          player1={match.dupla1.player1}
          player2={match.dupla1.player2}
          winnerId={winnerId}
          onSelectWinner={setWinnerId}
        />

        <div className="flex items-center justify-center gap-2 py-1">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            vs
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <DuplaLine
          duplaId={match.dupla2Id}
          player1={match.dupla2.player1}
          player2={match.dupla2.player2}
          winnerId={winnerId}
          onSelectWinner={setWinnerId}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mr-1">
            Score
          </span>
          <input
            className="w-14 border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            placeholder="0"
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
          />
          <span className="text-sm text-slate-400 font-medium">-</span>
          <input
            className="w-14 border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            placeholder="0"
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
          />
          <button
            className="ml-auto bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!hasChanged || saving}
            onClick={save}
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
