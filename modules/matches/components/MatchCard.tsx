"use client";

import Loader from "@/components/Loader";
import { matchScoreSchema } from "@/modules/matches/schema";
import { Match } from "@/types/matches";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateMatch } from "../action";
import DuplaLine from "./DuplaLine";

export default function MatchCard({ match }: { match: Match }) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mr-1">
              Score
            </span>
            <input
              {...register("score1")}
              className="w-14 border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              placeholder="0"
              type="number"
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
              disabled={!isDirty}
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
