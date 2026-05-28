"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { rallySchema, type RallyFormValues } from "@/modules/rally/schema";
import { createRally } from "@/modules/rally/action";
import { useTransition } from "react";
import Loader from "@/components/Loader";

export default function RallyCreateForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RallyFormValues>({
    resolver: zodResolver(rallySchema),
  });

  const onSubmit = (data: RallyFormValues) => {
    startTransition(async () => {
      try {
        await createRally(data);
        toast.success("Rally creado correctamente");
        reset();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al crear el rally",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Nombre del rally
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-shadow"
          placeholder="Ej: Torneo Apertura 2025"
          autoFocus
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-slate-700"
          >
            Fecha
          </label>
          <input
            id="date"
            type="date"
            {...register("date")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-shadow"
          />
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="place"
            className="block text-sm font-medium text-slate-700"
          >
            Lugar
          </label>
          <input
            id="place"
            {...register("place")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-shadow"
            placeholder="Ej: Cancha 1"
          />
          {errors.place && (
            <p className="text-xs text-red-500">{errors.place.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {isPending && <Loader />}
        {isPending ? "Creando..." : "Crear Rally"}
      </button>
    </form>
  );
}
