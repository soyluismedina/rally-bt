"use client";

import RallyCreateForm from "@/modules/rally/components/RallyCreateForm";
import { Rally } from "@/types/rally";
import { useRouter } from "next/navigation";

export default function HomeClient({ rallies }: { rallies: Rally[] }) {
  const router = useRouter();

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Rally de Beach Tennis
          </h1>
          <p className="text-sm text-slate-500">
            Creá un nuevo rally o continuá uno existente
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Nuevo Rally</h2>
          <RallyCreateForm />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Rallies</h2>
          {rallies.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
              No hay rallies todavía. Creá uno nuevo.
            </p>
          ) : (
            <ul className="space-y-2">
              {rallies.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => router.push(`/rally/${r.id}`)}
                    className="w-full text-left bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <span className="text-base font-semibold text-slate-800">
                      {r.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
