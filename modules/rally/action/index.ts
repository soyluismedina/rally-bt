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
    .from("rallies")
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
