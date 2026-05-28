import { createSupabase } from "@/lib/supabase/db";
import ParticipantsView from "@/modules/participants/components/ParticipantsView";

export default async function ParticipantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rallyId = id;
  const supabase = await createSupabase();
  const [{ data: players }, { data: duplas }, matchesRes] = await Promise.all([
    supabase.from("player").select().eq("rally_id", rallyId),
    supabase.from("dupla").select().eq("rally_id", rallyId),
    supabase
      .from("match")
      .select("*", { count: "exact", head: true })
      .eq("rally_id", rallyId),
  ]);

  return (
    <ParticipantsView
      rallyId={rallyId}
      players={players ?? []}
      duplas={duplas ?? []}
      hasMatches={(matchesRes.count ?? 0) > 0}
    />
  );
}
