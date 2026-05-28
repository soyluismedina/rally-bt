"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  playerSchema,
  duplaSchema,
  type PlayerFormValues,
  type DuplaFormValues,
} from "../schema";
import {
  addPlayer,
  removePlayer,
  addDupla,
  removeDupla,
  generateTournamentMatches,
} from "../action";
import { Player } from "@/types/player";
import { Dupla } from "@/types/dupla";

export default function ParticipantsView({
  rallyId,
  players,
  duplas,
  hasMatches: initialHasMatches,
}: {
  rallyId: string;
  players: Player[];
  duplas: Dupla[];
  hasMatches: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasMatches, setHasMatches] = useState(initialHasMatches);

  const playerForm = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
  });

  const duplaForm = useForm<DuplaFormValues>({
    resolver: zodResolver(duplaSchema),
  });

  const p1Watch = duplaForm.watch("player1Id");
  const p2Watch = duplaForm.watch("player2Id");

  const onAddPlayer = (data: PlayerFormValues) => {
    startTransition(async () => {
      try {
        await addPlayer(rallyId, data.name);
        router.refresh();
        playerForm.reset();
      } catch (error) {
        console.error({ error });
      }
    });
  };

  const onDeletePlayer = (playerId: string) => {
    startTransition(async () => {
      try {
        await removePlayer(rallyId, playerId);
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const onAddDupla = (data: DuplaFormValues) => {
    console.log({ data });
    startTransition(async () => {
      try {
        await addDupla(rallyId, data.player1Id, data.player2Id);
        duplaForm.reset();
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const onDeleteDupla = (duplaId: string) => {
    startTransition(async () => {
      try {
        await removeDupla(rallyId, duplaId);
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const onGenerate = () => {
    startTransition(async () => {
      try {
        await generateTournamentMatches(rallyId);
        setHasMatches(true);
        router.push(`/rally/${rallyId}/matches`);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="grid grid-cols-2 gap-6">
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
            disabled={isPending}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40"
          >
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
                  onClick={() => onDeletePlayer(p.id)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-all cursor-pointer"
                >
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
                disabled={isPending}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40"
              >
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
                      {d.players[0].name} + {d.players[1].name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteDupla(d.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-all cursor-pointer"
                    >
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
          disabled={duplas?.length < 2 || isPending}
          onClick={onGenerate}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl text-base font-bold shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Generando..."
            : hasMatches
              ? "Regenerar Partidas"
              : "Generar Partidas"}
        </button>
      </section>
    </div>
  );
}
