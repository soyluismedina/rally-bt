"use client";

import Loader from "@/components/Loader";
import { matchScoreSchema } from "@/modules/matches/schema";
import { Dupla } from "@/types/dupla";
import { Match } from "@/types/matches";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateMatch } from "./action";

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

function DuplaLine({
  duplaId,
  dupla,
  winnerId,
}: {
  duplaId: string;
  dupla: Dupla;
  winnerId: string;
}) {
  const isWinner = winnerId === duplaId;
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg cursor-pointer transition-all ${
        isWinner
          ? "bg-teal-100 ring-2 ring-teal-400 ring-offset-1"
          : "hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex -space-x-2">
          <span className="w-7 h-7 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {dupla.player_1.name.charAt(0).toUpperCase()}
          </span>
          <span className="w-7 h-7 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {dupla.player_2.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold text-slate-800 truncate">
          {dupla.player_1.name} & {dupla.player_2.name}
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

function MatchCard({ match }: { match: Match }) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm({
    resolver: zodResolver(matchScoreSchema),
    defaultValues: {
      score1: match.score_1 || undefined,
      score2: match.score_2 || undefined,
    },
  });
  const router = useRouter();
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

  const save = handleSubmit((form) => {
    try {
      startTransition(async () => {
        await updateMatch({
          matchId: match.id,
          match: {
            ...match,
            score_1: Number(form.score1) || null,
            score_2: Number(form.score2) || null,
            winner_id:
              Number(form.score1) > Number(form.score2)
                ? match.dupla_1.id
                : match.dupla_2.id,
          },
        });
        router.refresh();
      });

      toast.success("Partida actualizada");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar la partida",
      );
    }
  });

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
          duplaId={match.dupla_1.id}
          dupla={match.dupla_1}
          winnerId={match.winner_id}
        />

        <div className="flex items-center justify-center gap-2 py-1">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            vs
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <DuplaLine
          duplaId={match.dupla_2.id}
          dupla={match.dupla_2}
          winnerId={match.winner_id}
        />
      </div>

      <form onSubmit={save}>
        <div className="mt-4 pt-3 border-t border-slate-200/60">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mr-1">
              Score
            </span>
            <input
              {...register("score1")}
              className="w-14 border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              placeholder="0"
              type="number"
              datatype="number"
            />
            <span className="text-sm text-slate-400 font-medium">-</span>
            <input
              {...register("score2")}
              className="w-14 border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              placeholder="0"
              type="number"
            />
            <button
              type="submit"
              disabled={!formState.isDirty}
              className="ml-auto bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {isPending && <Loader />}
              {isPending ? "Guardando…" : "Guardar"}
            </button>
          </div>
          {(errors.score1 || errors.score2) && (
            <p className="text-xs text-red-500 mt-1">
              Solo se permiten números
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
