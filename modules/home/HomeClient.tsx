"use client";

import { formatDate } from "@/lib/formatDate";
import RallyCreateForm from "@/modules/rally/components/RallyCreateForm";
import { Rally } from "@/types/rally";
import { useRouter } from "next/navigation";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function HomeClient({ rallies }: { rallies: Rally[] }) {
  const router = useRouter();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <section className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="space-y-1.5">
            <p className="text-teal-100 text-sm font-medium tracking-wide">
              {rallies.length === 0
                ? "Bienvenido"
                : `Tenés ${rallies.length} rally${rallies.length !== 1 ? "s" : ""}`}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {rallies.length === 0 ? "Creá tu primer rally" : "Tus rallies"}
            </h1>
            <p className="text-teal-100 text-sm leading-relaxed max-w-sm">
              Organizá partidas, armá duplas y seguí los resultados al instante.
            </p>
          </div>
        </section>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-600 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0 0 18 14.25V6.443ZM9.25 18.693v-8.25l-7.25-4v7.807a.75.75 0 0 0 .388.657l6.862 3.786Z" />
              </svg>
            </span>
            <h2 className="text-lg font-bold text-slate-900">Nuevo rally</h2>
          </div>
          <RallyCreateForm />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {rallies.length > 0 && `Rallies (${rallies.length})`}
            </h2>
          </div>

          {rallies.length === 0 ? (
            <div className="text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
              <div className="text-5xl mb-3">🏓</div>
              <p className="text-slate-500 text-sm font-medium">
                No hay rallies todavía
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Creá uno nuevo usando el formulario de arriba
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {rallies.map((r, i) => (
                <li key={r.id}>
                  <button
                    onClick={() => router.push(`/rally/${r.id}`)}
                    className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:border-teal-300 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="flex items-center justify-center w-10 h-10 rounded-lg text-white text-sm font-bold shrink-0"
                        style={{
                          backgroundColor:
                            i % 3 === 0
                              ? "var(--color-court-1)"
                              : i % 3 === 1
                                ? "var(--color-court-2)"
                                : "#0d9488",
                        }}
                      >
                        {getInitials(r.name)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block text-base font-semibold text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                          {r.name}
                        </span>
                        <div className="flex items-center gap-3 mt-0.5">
                          {r.date && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-3.5 h-3.5"
                              >
                                <path d="M5.75 2a.75.75 0 0 1 .75.75V4h3V2.75a.75.75 0 0 1 1.5 0V4h.75A1.75 1.75 0 0 1 13 5.75v6.5A1.75 1.75 0 0 1 11.25 14H4.75A1.75 1.75 0 0 1 3 12.25v-6.5C3 4.784 3.784 4 4.75 4H5.5V2.75A.75.75 0 0 1 5.75 2ZM4.5 7v5.25c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V7h-7Z" />
                              </svg>
                              {formatDate(r.date)}
                            </span>
                          )}
                          {r.place && (
                            <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-3.5 h-3.5 shrink-0"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="truncate">{r.place}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
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
