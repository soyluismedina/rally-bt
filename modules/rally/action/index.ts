"use server";

import { rallySchema } from "@/modules/rally/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Rally } from "@/types/rally";
import { createSupabase } from "@/lib/supabase/db";

export async function createRally(data: {
  name: string;
  date: string;
  place: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const parsed = rallySchema.parse(data);

  const supabase = await createSupabase();
  const { data: rally } = await supabase
    .from("rally")
    .insert({
      name: parsed.name,
      date: parsed.date,
      place: parsed.place,
      author_id: userId,
    })
    .select("id, name, date, place, created_at")
    .single();

  revalidatePath("/");

  return rally as unknown as Rally;
}

export async function updateRally(
  rallyId: string,
  data: { name: string; date: string; place: string },
) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const parsed = rallySchema.parse(data);

  const supabase = await createSupabase();
  const { error } = await supabase
    .from("rally")
    .update({
      name: parsed.name,
      date: parsed.date,
      place: parsed.place,
    })
    .eq("id", rallyId);

  if (error) throw new Error(error.message);

  revalidatePath(`/rally/${rallyId}`);
  revalidatePath("/");
}

export async function deleteRally(rallyId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const supabase = await createSupabase();

  const { error: matchesError } = await supabase
    .from("match")
    .delete()
    .eq("rally_id", rallyId);
  if (matchesError) throw new Error(matchesError.message);

  const { error: duplasError } = await supabase
    .from("dupla")
    .delete()
    .eq("rally_id", rallyId);
  if (duplasError) throw new Error(duplasError.message);

  const { error: playersError } = await supabase
    .from("player")
    .delete()
    .eq("rally_id", rallyId);
  if (playersError) throw new Error(playersError.message);

  const { error } = await supabase.from("rally").delete().eq("id", rallyId);
  if (error) throw new Error(error.message);

  revalidatePath("/");
}
