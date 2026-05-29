import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return Response.json(
      {
        error:
          "Error: Por favor añade el CLERK_WEBHOOK_SIGNING_SECRET en los .env",
      },
      { status: 500 },
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json(
      { error: "Error: Faltan headers de Svix" },
      { status: 400 },
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return Response.json({ error: "Firma no válida" }, { status: 400 });
  }

  const eventType = evt.type;
  const supabase = createAdminClient();

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const { error } = await supabase.from("user").insert({
      id,
      email: email_addresses?.[0]?.email_address ?? "",
      name: [first_name, last_name].filter(Boolean).join(" ") || null,
    });

    if (error) {
      return Response.json(
        { error: `Error al crear usuario: ${error.message}` },
        {
          status: 500,
        },
      );
    }
  }

  if (eventType === "user.updated") {
    const { id, first_name, last_name, email_addresses } = evt.data;

    const updates: Record<string, string | null> = {
      name: [first_name, last_name].filter(Boolean).join(" ") || null,
    };

    if (email_addresses?.[0]?.email_address) {
      updates.email = email_addresses[0].email_address;
    }

    const { error } = await supabase.from("user").update(updates).eq("id", id);

    if (error) {
      return Response.json(
        { error: `Error al actualizar usuario: ${error.message}` },
        {
          status: 500,
        },
      );
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const { data: rallies } = await supabase
      .from("rally")
      .select("id")
      .eq("author_id", id);

    if (rallies && rallies.length > 0) {
      const rallyIds = rallies.map((r) => r.id);

      const { error: matchesError } = await supabase
        .from("match")
        .delete()
        .in("rally_id", rallyIds);

      if (matchesError) {
        return Response.json(
          { error: `Error al eliminar matches: ${matchesError.message}` },
          { status: 500 },
        );
      }

      const { error: duplasError } = await supabase
        .from("dupla")
        .delete()
        .in("rally_id", rallyIds);

      if (duplasError) {
        return Response.json(
          { error: `Error al eliminar duplas: ${duplasError.message}` },
          { status: 500 },
        );
      }

      const { error: playersError } = await supabase
        .from("player")
        .delete()
        .in("rally_id", rallyIds);

      if (playersError) {
        return Response.json(
          { error: `Error al eliminar players: ${playersError.message}` },
          { status: 500 },
        );
      }

      const { error: ralliesError } = await supabase
        .from("rally")
        .delete()
        .in("id", rallyIds);

      if (ralliesError) {
        return Response.json(
          { error: `Error al eliminar rallies: ${ralliesError.message}` },
          { status: 500 },
        );
      }
    }

    const { error } = await supabase.from("user").delete().eq("id", id);

    if (error) {
      return Response.json(
        { error: `Error al eliminar usuario: ${error.message}` },
        {
          status: 500,
        },
      );
    }
  }

  return Response.json({}, { status: 200 });
}
