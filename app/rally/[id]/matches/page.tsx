import { createSupabase } from "@/lib/supabase/db";
import MatchesClient from "@/modules/matches/MatchesClient";

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabase();
  const { data: matches } = await supabase
    .from("match")
    .select()
    .eq("rally_id", id)
    .order("round", { ascending: true })
    .order("court", { ascending: true });

  if (!matches) return <MatchesClient rallyId={id} matches={[]} />;

  return <MatchesClient rallyId={id} matches={matches ?? []} />;
}
