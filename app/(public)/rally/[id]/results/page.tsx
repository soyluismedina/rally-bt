import { createSupabase } from "@/lib/supabase/db";
import { Match } from "@/types/matches";
import ResultsView from "@/modules/results/components/ResultsView";

type Standing = {
  duplaId: string;
  player1Name: string;
  player2Name: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  matchesPlayed: number;
};

function computeStandings(matches: Match[]): Standing[] {
  const map = new Map<string, Standing>();

  for (const m of matches) {
    if (m.score_1 === null || m.score_2 === null) continue;

    const d1 = m.dupla_1;
    const d2 = m.dupla_2;

    if (!map.has(d1.id)) {
      map.set(d1.id, {
        duplaId: d1.id,
        player1Name: d1.player_1.name,
        player2Name: d1.player_2.name,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        matchesPlayed: 0,
      });
    }
    if (!map.has(d2.id)) {
      map.set(d2.id, {
        duplaId: d2.id,
        player1Name: d2.player_1.name,
        player2Name: d2.player_2.name,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        matchesPlayed: 0,
      });
    }

    const s1 = map.get(d1.id)!;
    const s2 = map.get(d2.id)!;

    s1.matchesPlayed++;
    s1.pointsFor += m.score_1;
    s1.pointsAgainst += m.score_2;
    s2.matchesPlayed++;
    s2.pointsFor += m.score_2;
    s2.pointsAgainst += m.score_1;

    if (m.winner_id === d1.id) {
      s1.wins++;
      s2.losses++;
    } else if (m.winner_id === d2.id) {
      s2.wins++;
      s1.losses++;
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    const diffA = a.pointsFor - a.pointsAgainst;
    const diffB = b.pointsFor - b.pointsAgainst;
    return diffB - diffA;
  });
}

export default async function ResultsPage({
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

  const { data: rally } = await supabase
    .from("rally")
    .select("name, date, place")
    .eq("id", id)
    .single();

  if (!matches) {
    return <ResultsView standings={[]} matches={[]} rally={rally} />;
  }

  const standings = computeStandings(matches as unknown as Match[]);

  return (
    <ResultsView
      standings={standings}
      matches={matches as unknown as Match[]}
      rally={rally}
    />
  );
}
