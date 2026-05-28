"use client";

import { Dupla } from "@/types/dupla";
import { Player } from "@/types/player";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import {
  addDupla,
  addPlayer,
  generateTournamentMatches,
  removeDupla,
  removePlayer,
} from "../action";
import {
  duplaSchema,
  playerSchema,
  type DuplaFormValues,
  type PlayerFormValues,
} from "../schema";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ParticipantsView({
  rallyId,
  players,
  duplas,
}: {
  rallyId: string;
  players: Player[];
  duplas: Dupla[];
  hasMatches: boolean;
}) {
  const router = useRouter();
  const [isPendingAddPlayer, startTransitionAddPlayer] = useTransition();
  const [isPendingDeletePlayer, startTransitionDeletePlayer] = useTransition();
  const [isPendingAddDupla, startTransitionAddDupla] = useTransition();
  const [isPendingDeleteDupla, startTransitionDeleteDupla] = useTransition();
  const [isPendingGenerate, startTransitionGenerate] = useTransition();

  const playerForm = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
  });

  const duplaForm = useForm<DuplaFormValues>({
    resolver: zodResolver(duplaSchema),
  });

  const p1Watch = duplaForm.watch("player1Id");
  const p2Watch = duplaForm.watch("player2Id");

  const onAddPlayer = (data: PlayerFormValues) => {
    startTransitionAddPlayer(async () => {
      try {
        await addPlayer(rallyId, data.name);
        toast.success("Jugador agregado");
        playerForm.reset();
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error, "Error al agregar el jugador"));
      }
    });
  };

  const onDeletePlayer = (playerId: string) => {
    startTransitionDeletePlayer(async () => {
      try {
        await removePlayer(rallyId, playerId);
        toast.success("Jugador eliminado");
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error, "Error al eliminar el jugador"));
      }
    });
  };

  const onAddDupla = (data: DuplaFormValues) => {
    startTransitionAddDupla(async () => {
      try {
        await addDupla(rallyId, data.player1Id, data.player2Id);
        toast.success("Dupla agregada");
        duplaForm.reset();
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error, "Error al agregar la dupla"));
      }
    });
  };

  const onDeleteDupla = (duplaId: string) => {
    startTransitionDeleteDupla(async () => {
      try {
        await removeDupla(rallyId, duplaId);
        toast.success("Dupla eliminada");
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error, "Error al eliminar la dupla"));
      }
    });
  };

  const onGenerate = () => {
    startTransitionGenerate(async () => {
      try {
        await generateTournamentMatches(rallyId);
        toast.success("Partidas generadas correctamente");
        router.push(`/rally/${rallyId}/matches`);
      } catch (error) {
        toast.error(getErrorMessage(error, "Error al generar las partidas"));
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-sky-500 inline-block" />
          Jugadores
        </h2>

        <form
          onSubmit={playerForm.handleSubmit(onAddPlayer)}
          className="flex gap-2"
        >
          <input
            {...playerForm.register("name")}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            placeholder="Nombre del jugador"
            autoFocus
          />
          <button
            type="submit"
            disabled={isPendingAddPlayer}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isPendingAddPlayer && <Loader />}
            Agregar
          </button>
        </form>
        {playerForm.formState.errors.name && (
          <p className="text-xs text-red-500">
            {playerForm.formState.errors.name.message}
          </p>
        )}

        {players?.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-lg">
            Aún no hay jugadores
          </p>
        ) : (
          <ul className="space-y-1">
            {players?.map((p) => (
              <li
                key={p.id}
                className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                <span className="text-sm font-medium text-slate-800">
                  {p.name}
                </span>
                <button
                  type="button"
                  disabled={isPendingDeletePlayer}
                  onClick={() => onDeletePlayer(p.id)}
                  className="opacity-60 md:opacity-0 md:group-hover:opacity-100 text-xs text-slate-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40 inline-flex items-center gap-1"
                >
                  {isPendingDeletePlayer && <Loader className="h-3 w-3" />}
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-amber-500 inline-block" />
          Duplas
        </h2>

        {players?.length < 2 ? (
          <p className="text-sm text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-lg">
            Agregá al menos 2 jugadores
          </p>
        ) : (
          <>
            <form
              onSubmit={duplaForm.handleSubmit(onAddDupla)}
              className="flex flex-wrap items-end gap-2"
            >
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Jugador 1
                </label>
                <select
                  {...duplaForm.register("player1Id")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  {players?.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.id === p2Watch}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Jugador 2
                </label>
                <select
                  {...duplaForm.register("player2Id")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  {players?.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.id === p1Watch}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={isPendingAddDupla}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isPendingAddDupla && <Loader />}
                Agregar Dupla
              </button>
            </form>
            {duplaForm.formState.errors.player1Id && (
              <p className="text-xs text-red-500">
                {duplaForm.formState.errors.player1Id.message}
              </p>
            )}
            {duplaForm.formState.errors.player2Id && (
              <p className="text-xs text-red-500">
                {duplaForm.formState.errors.player2Id.message}
              </p>
            )}

            {duplas?.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-lg">
                Aún no hay duplas
              </p>
            ) : (
              <ul className="space-y-1">
                {duplas?.map((d) => (
                  <li
                    key={d.id}
                    className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {d.player_1.name} + {d.player_2.name}
                    </span>
                    <button
                      type="button"
                      disabled={isPendingDeleteDupla}
                      onClick={() => onDeleteDupla(d.id)}
                      className="opacity-60 md:opacity-0 md:group-hover:opacity-100 text-xs text-slate-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40 inline-flex items-center gap-1"
                    >
                      {isPendingDeleteDupla && <Loader className="h-3 w-3" />}
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <button
          type="button"
          disabled={duplas?.length < 2 || isPendingGenerate}
          onClick={onGenerate}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl text-base font-bold shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {isPendingGenerate && <Loader />}
          {isPendingGenerate ? "Generando..." : "Generar Partidas"}
        </button>
      </section>
    </div>
  );
}
