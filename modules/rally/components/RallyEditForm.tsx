"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { rallySchema, type RallyFormValues } from "@/modules/rally/schema";
import { updateRally } from "@/modules/rally/action";
import { useTransition } from "react";
import Loader from "@/components/Loader";

export default function RallyEditForm({
  rallyId,
  defaultValues,
  onDone,
}: {
  rallyId: string;
  defaultValues: RallyFormValues;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RallyFormValues>({
    resolver: zodResolver(rallySchema),
    defaultValues,
  });

  const onSubmit = (data: RallyFormValues) => {
    startTransition(async () => {
      try {
        await updateRally(rallyId, data);
        toast.success("Rally actualizado");
        onDone();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al actualizar el rally",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1">
        <label
          htmlFor="edit-name"
          className="block text-xs font-medium text-slate-500"
        >
          Nombre
        </label>
        <input
          id="edit-name"
          {...register("name")}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-shadow"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label
            htmlFor="edit-date"
            className="block text-xs font-medium text-slate-500"
          >
            Fecha
          </label>
          <input
            id="edit-date"
            type="date"
            {...register("date")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-shadow"
          />
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="edit-place"
            className="block text-xs font-medium text-slate-500"
          >
            Lugar
          </label>
          <input
            id="edit-place"
            {...register("place")}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-shadow"
          />
          {errors.place && (
            <p className="text-xs text-red-500">{errors.place.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {isPending && <Loader />}
          Guardar
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={isPending}
          className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
