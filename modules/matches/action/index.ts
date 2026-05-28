"use server";

import { createSupabase } from "@/lib/supabase/db";
import { Match } from "@/types/matches";
import { revalidatePath } from "next/cache";

export const updateMatch = async ({
  match,
  matchId,
}: {
  match: Partial<Match>;
  matchId: string;
}) => {
  const supabase = await createSupabase();
  console.log({ match });
  const { data, error } = await supabase
    .from("match")
    .upsert(match)
    .eq("id", matchId)
    .select();

  if (error) {
    throw error;
  }
  revalidatePath(`/rally/${matchId}/matches`);
  return data;
};
