"use server";

import { playerSchema, duplaSchema, duplaStorageSchema } from "../schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateMatches } from "@/lib/tournament";
import { createSupabase } from "@/lib/supabase/db";

function assertAuth(userId: string | null): asserts userId is string {
  if (!userId) throw new Error("No autenticado");
}

export async function addPlayer(rallyId: string, name: string) {
  const { userId } = await auth();
  assertAuth(userId);

  const { name: parsedName } = playerSchema.parse({ name });
  const supabase = await createSupabase();
  const { data } = await supabase
    .from("player")
    .insert({ name: parsedName, rally_id: rallyId });

  console.log({ data });

  revalidatePath(`/rally/${rallyId}/participants`);
  return data;
}

export async function removePlayer(rallyId: string, playerId: string) {
  const { userId } = await auth();
  assertAuth(userId);

  const supabase = await createSupabase();

  const { data: duplas } = await supabase
    .from("dupla")
    .select("id, players")
    .eq("rally_id", rallyId);

  const duplaIdsToDelete = (duplas ?? [])
    .filter((d) =>
      (d.players as Array<{ id: string }>).some((p) => p.id === playerId),
    )
    .map((d) => d.id);

  if (duplaIdsToDelete.length > 0) {
    await supabase.from("dupla").delete().in("id", duplaIdsToDelete);
  }

  await supabase.from("player").delete().eq("id", playerId);

  revalidatePath(`/rally/${rallyId}/participants`);
}

export async function addDupla(
  rallyId: string,
  player1Id: string,
  player2Id: string,
) {
  const { userId } = await auth();
  assertAuth(userId);

  duplaSchema.parse({ player1Id, player2Id });

  const supabase = await createSupabase();

  const { data: players, error: playersError } = await supabase
    .from("player")
    .select("id, name")
    .in("id", [player1Id, player2Id]);
  console.log({ players, playersError });

  if (!players || players.length !== 2)
    throw new Error("Jugadores no encontrados");

  const player1 = players.find((p) => p.id === player1Id);
  const player2 = players.find((p) => p.id === player2Id);

  if (!player1 || !player2) throw new Error("Jugadores no encontrados");

  const { data, error } = await supabase
    .from("dupla")
    .insert({ player_1: player1, player_2: player2, rally_id: rallyId });

  console.log({ data, error });
  revalidatePath(`/rally/${rallyId}/participants`);
  return data;
}

export async function removeDupla(rallyId: string, duplaId: string) {
  const { userId } = await auth();
  assertAuth(userId);

  const supabase = await createSupabase();
  await supabase.from("dupla").delete().eq("id", duplaId);

  revalidatePath(`/rally/${rallyId}/participants`);
}

export async function generateTournamentMatches(rallyId: string) {
  const { userId } = await auth();
  assertAuth(userId);
  const supabase = await createSupabase();
  const { data: duplas } = await supabase
    .from("dupla")
    .select("id")
    .eq("rally_id", rallyId);

  if (!duplas || duplas.length < 2)
    throw new Error("Se necesitan al menos 2 duplas");

  const matchData = generateMatches(duplas.length);

  await supabase.from("match").delete().eq("rally_id", rallyId);

  for (const m of matchData) {
    await supabase.from("match").insert({
      dupla1_id: duplas[m.dupla1Idx].id,
      dupla2_id: duplas[m.dupla2Idx].id,
      round: m.round,
      court: m.court,
      rally_id: rallyId,
    });
  }

  revalidatePath(`/rally/${rallyId}/participants`);
  revalidatePath(`/rally/${rallyId}/matches`);
}
