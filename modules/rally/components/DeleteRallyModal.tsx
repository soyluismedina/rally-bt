"use client";

import { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteRally } from "@/modules/rally/action";
import Loader from "@/components/Loader";

export default function DeleteRallyModal({
  rallyId,
  rallyName,
  onClose,
}: {
  rallyId: string;
  rallyName: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const onConfirm = () => {
    startTransition(async () => {
      try {
        await deleteRally(rallyId);
        toast.success("Rally eliminado correctamente");
        router.push("/");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al eliminar el rally",
        );
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 mx-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 text-red-600"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900 text-center">
          Eliminar rally
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
          ¿Estás seguro de que querés eliminar{" "}
          <span className="font-semibold text-slate-700">{rallyName}</span>?
        </p>
        <p className="text-xs text-slate-400 text-center mt-1.5">
          Se eliminarán todos los jugadores, duplas y partidas asociados. Esta
          acción no se puede deshacer.
        </p>

        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 text-sm font-medium text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isPending && <Loader />}
            {isPending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
