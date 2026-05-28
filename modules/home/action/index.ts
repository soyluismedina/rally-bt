"use server";

import { createSupabase } from "@/lib/supabase/db";

export const getRallies = async (userId: string) => {
  const supabase = await createSupabase();
  const { data } = await supabase
    .from("rally")
    .select("*")
    .eq("author_id", userId);
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    date: r.date,
    place: r.place,
    createdAt: r.created_at,
  }));
};
