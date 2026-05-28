"use client";

import { Match } from "@/types/matches";
import { useMemo } from "react";
import StandingsTable from "./StandingsTable";

type Standing = {
  duplaId: string;
  player1Name: string;
  player2Name: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  matchesPlayed: number;
};

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

function DuplaLabel({
  name1,
  name2,
  isWinner,
}: {
  name1: string;
  name2: string;
  isWinner: boolean;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex -space-x-2 shrink-0">
        <span className="w-7 h-7 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
          {name1.charAt(0).toUpperCase()}
        </span>
        <span className="w-7 h-7 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
          {name2.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="min-w-0">
        <span
          className={`text-sm font-semibold truncate block ${
            isWinner ? "text-teal-700" : "text-slate-800"
          }`}
        >
          {name1} & {name2}
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

export default function ResultsView({
  standings,
  matches,
}: {
  standings: Standing[];
  matches: Match[];
}) {
  const rounds = useMemo(() => {
    const map = new Map<number, Match[]>();
    for (const m of matches) {
      if (!map.has(m.round)) map.set(m.round, []);
      map.get(m.round)!.push(m);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([round, ms]) => ({ round, matches: ms }));
  }, [matches]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <span className="w-1.5 h-5 rounded-full bg-yellow-500 inline-block" />
          Tabla de posiciones
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <StandingsTable standings={standings} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <span className="w-1.5 h-5 rounded-full bg-teal-500 inline-block" />
          Resultados de partidas
        </h2>

        {matches.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
            No hay partidas registradas
          </p>
        ) : (
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
                  {ms.map((m) => {
                    const c = courtColors[m.court % courtColors.length];
                    const isPlayed =
                      m.score_1 !== null && m.score_2 !== null;
                    return (
                      <div
                        key={m.id}
                        className={`rounded-xl border-2 p-4 ${c.card}`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${c.badge}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            Cancha {m.court + 1}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <DuplaLabel
                              name1={m.dupla_1.player_1.name}
                              name2={m.dupla_1.player_2.name}
                              isWinner={m.winner_id === m.dupla_1.id}
                            />
                            {isPlayed && (
                              <span className="text-lg font-bold text-slate-900 ml-3 shrink-0">
                                {m.score_1}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-center gap-2 py-1">
                            <span className="h-px flex-1 bg-slate-200" />
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                              vs
                            </span>
                            <span className="h-px flex-1 bg-slate-200" />
                          </div>

                          <div className="flex items-center justify-between">
                            <DuplaLabel
                              name1={m.dupla_2.player_1.name}
                              name2={m.dupla_2.player_2.name}
                              isWinner={m.winner_id === m.dupla_2.id}
                            />
                            {isPlayed && (
                              <span className="text-lg font-bold text-slate-900 ml-3 shrink-0">
                                {m.score_2}
                              </span>
                            )}
                          </div>
                        </div>

                        {!isPlayed && (
                          <p className="text-xs text-slate-400 text-center mt-3 pt-3 border-t border-slate-200/60">
                            Pendiente
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
