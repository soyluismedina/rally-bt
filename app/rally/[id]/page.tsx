import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabase } from "@/lib/supabase/db";
import RallyDashboardHeader from "@/modules/rally/components/RallyDashboardHeader";

const sections = [
  {
    href: "participants",
    label: "Participantes",
    desc: "Gestiona jugadores y duplas",
    color: "from-sky-500 to-blue-600",
    shadow: "shadow-sky-200/50",
    border: "border-sky-200",
    hover: "hover:border-sky-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
      </svg>
    ),
  },
  {
    href: "matches",
    label: "Partidas",
    desc: "Registra resultados y avances",
    color: "from-amber-400 to-orange-500",
    shadow: "shadow-amber-200/50",
    border: "border-amber-200",
    hover: "hover:border-amber-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.811.71 1.459 1.435 1.028L10 15.34l4.038 2.724c.725.43 1.63-.217 1.435-1.028l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "results",
    label: "Resultados",
    desc: "Tabla de posiciones y puntajes",
    color: "from-purple-500 to-violet-600",
    shadow: "shadow-purple-200/50",
    border: "border-purple-200",
    hover: "hover:border-purple-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 15H6.59l-.114.44a.75.75 0 01-1.452-.38L5.822 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.5 10a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 017.5 10z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default async function RallyDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabase();

  const { data: rally } = await supabase
    .from("rally")
    .select("id, name, date, place")
    .eq("id", id)
    .single();

  if (!rally) notFound();

  const [playersRes, duplasRes, matchesRes] = await Promise.all([
    supabase
      .from("player")
      .select("*", { count: "exact", head: true })
      .eq("rally_id", id),
    supabase
      .from("dupla")
      .select("*", { count: "exact", head: true })
      .eq("rally_id", id),
    supabase
      .from("match")
      .select("*", { count: "exact", head: true })
      .eq("rally_id", id),
  ]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <RallyDashboardHeader
        rallyId={rally.id}
        name={rally.name}
        date={rally.date}
        place={rally.place}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-100 text-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Jugadores
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {playersRes.count ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-100 text-sky-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Duplas
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {duplasRes.count ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.811.71 1.459 1.435 1.028L10 15.34l4.038 2.724c.725.43 1.63-.217 1.435-1.028l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Partidas
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {matchesRes.count ?? 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={`/rally/${rally.id}/${s.href}`}
            className={`group bg-white rounded-xl shadow-sm border-2 ${s.border} ${s.hover} transition-all ${s.shadow} hover:shadow-lg hover:-translate-y-0.5 overflow-hidden`}
          >
            <div className={`bg-gradient-to-r ${s.color} p-4 flex items-center gap-3`}>
              <span className="text-white/90">{s.icon}</span>
              <p className="font-bold text-white text-sm sm:text-base">{s.label}</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                {s.desc}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                Ir a {s.label.toLowerCase()}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
