"use client";

import { Match } from "@/types/matches";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import MatchCard from "./components/MatchCard";

export default function MatchesClient({
  rallyId,
  matches,
}: {
  rallyId: string;
  matches: Match[];
}) {
  const router = useRouter();

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
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
