import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabase } from "@/lib/supabase/db";
import RallyDashboardHeader from "@/modules/rally/components/RallyDashboardHeader";

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
    <div className="space-y-6 max-w-2xl">
      <RallyDashboardHeader
        rallyId={rally.id}
        name={rally.name}
        date={rally.date}
        place={rally.place}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href={`/rally/${rally.id}/participants`}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-teal-300 hover:shadow-md transition-all"
        >
          <p className="text-sm font-medium text-slate-500">Jugadores</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {playersRes.count ?? 0}
          </p>
        </Link>

        <Link
          href={`/rally/${rally.id}/participants`}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-teal-300 hover:shadow-md transition-all"
        >
          <p className="text-sm font-medium text-slate-500">Duplas</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {duplasRes.count ?? 0}
          </p>
        </Link>

        <Link
          href={`/rally/${rally.id}/matches`}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-teal-300 hover:shadow-md transition-all"
        >
          <p className="text-sm font-medium text-slate-500">Partidas</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {matchesRes.count ?? 0}
          </p>
        </Link>
      </div>
    </div>
  );
}
