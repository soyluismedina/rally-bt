"use client";

import { toast } from "sonner";

export default function ShareButton({ rallyId }: { rallyId: string }) {
  function copy() {
    const url = `${window.location.origin}/rally/${rallyId}/results`;
    navigator.clipboard.writeText(url);
    toast.success("Enlace copiado al portapapeles");
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
      title="Copiar enlace de resultados"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M13 4.5a2.5 2.5 0 117.5 0v8a2.5 2.5 0 01-2.5 2.5H4.5a2.5 2.5 0 01-2.5-2.5v-8A2.5 2.5 0 014.5 2h.75a.75.75 0 010 1.5h-.75a1 1 0 00-1 1v8a1 1 0 001 1h10.5a1 1 0 001-1v-8a1 1 0 00-1-1h-.75a.75.75 0 010-1.5h.75zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    </button>
  );
}
