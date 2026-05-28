import { createSupabase } from "@/lib/supabase/db";
import MatchesClient from "@/modules/matches/MatchesClient";

type DuplaRow = {
  id: string;
  players: [{ id: string; name: string }, { id: string; name: string }];
};

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabase();
  const { data: matches } = await supabase
    .from("matches")
    .select()
    .eq("rally_id", id);

  if (!matches) return <MatchesClient rallyId={id} matches={[]} />;

  const enriched = matches.map((m) => {
    return {
      id: m.id,
      dupla1: m.dupla_1,
      dupla2: m.dupla_2,
      score1: m.score1,
      score2: m.score2,
    };
  });

  return <MatchesClient rallyId={id} matches={enriched} />;
}
