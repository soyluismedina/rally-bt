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

function PlayerAvatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const sizeClass = size === "md" ? "w-9 h-9 text-sm" : "w-8 h-8 text-xs";
  return (
    <span className={`${sizeClass} rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-bold flex items-center justify-center shrink-0`}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-sky-200/50">
        <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
          </svg>
          Participantes
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">
          {players.length} jugador{players.length !== 1 ? "es" : ""} &middot; {duplas.length} dupla{duplas.length !== 1 ? "s" : ""}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl shadow-sm border border-sky-200 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3.5 flex items-center justify-between">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
              </svg>
              Jugadores
            </h2>
            <span className="text-xs font-bold text-white/80 bg-white/15 px-2.5 py-1 rounded-full">
              {players.length}
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <form
              onSubmit={playerForm.handleSubmit(onAddPlayer)}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <input
                  {...playerForm.register("name")}
                  className="w-full border border-slate-300 rounded-lg pl-3 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-shadow"
                  placeholder="Nombre del jugador"
                />
              </div>
              <button
                type="submit"
                disabled={isPendingAddPlayer}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 shrink-0"
              >
                {isPendingAddPlayer ? <Loader /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                )}
                {isPendingAddPlayer ? "" : "Agregar"}
              </button>
            </form>
            {playerForm.formState.errors.name && (
              <p className="text-xs text-red-500 -mt-3">
                {playerForm.formState.errors.name.message}
              </p>
            )}

            {players.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 text-sky-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                  </svg>
                </span>
                <p className="text-sm text-slate-400">Aún no hay jugadores</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {players.map((p) => (
                  <li
                    key={p.id}
                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-sky-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayerAvatar name={p.name} />
                      <span className="text-sm font-medium text-slate-800 truncate">
                        {p.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isPendingDeletePlayer}
                      onClick={() => onDeletePlayer(p.id)}
                      className="opacity-60 md:opacity-0 md:group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40"
                      title="Eliminar jugador"
                    >
                      {isPendingDeletePlayer ? (
                        <Loader className="h-4 w-4" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3.5 flex items-center justify-between">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
              </svg>
              Duplas
            </h2>
            <span className="text-xs font-bold text-white/80 bg-white/15 px-2.5 py-1 rounded-full">
              {duplas.length}
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {players.length < 2 ? (
              <div className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
                  </svg>
                </span>
                <p className="text-sm text-slate-400">Agregá al menos 2 jugadores</p>
              </div>
            ) : (
              <>
                <form
                  onSubmit={duplaForm.handleSubmit(onAddDupla)}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Jugador 1
                      </label>
                      <select
                        {...duplaForm.register("player1Id")}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer bg-white"
                      >
                        <option value="">Seleccionar...</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id} disabled={p.id === p2Watch}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Jugador 2
                      </label>
                      <select
                        {...duplaForm.register("player2Id")}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer bg-white"
                      >
                        <option value="">Seleccionar...</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id} disabled={p.id === p1Watch}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isPendingAddDupla}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {isPendingAddDupla ? <Loader /> : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                    )}
                    {isPendingAddDupla ? "Agregando..." : "Agregar Dupla"}
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

                {duplas.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-slate-200 rounded-xl">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                        <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
                      </svg>
                    </span>
                    <p className="text-sm text-slate-400">Aún no hay duplas</p>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {duplas.map((d) => (
                      <li
                        key={d.id}
                        className="group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-amber-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex -space-x-1.5 shrink-0">
                            <PlayerAvatar name={d.player_1.name} />
                            <PlayerAvatar name={d.player_2.name} />
                          </div>
                          <span className="text-sm font-medium text-slate-800 truncate">
                            {d.player_1.name} + {d.player_2.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={isPendingDeleteDupla}
                          onClick={() => onDeleteDupla(d.id)}
                          className="opacity-60 md:opacity-0 md:group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40"
                          title="Eliminar dupla"
                        >
                          {isPendingDeleteDupla ? (
                            <Loader className="h-4 w-4" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <button
        type="button"
        disabled={duplas.length < 2 || isPendingGenerate}
        onClick={onGenerate}
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-3.5 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {isPendingGenerate ? (
          <Loader />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
          </svg>
        )}
        {isPendingGenerate ? "Generando partidas..." : "Generar Partidas"}
      </button>
    </div>
  );
}
