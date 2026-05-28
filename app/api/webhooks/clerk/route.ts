import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response(
      "Error: Por favor añade el WEBHOOK_SECRET en los .env",
      { status: 500 },
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Faltan headers de Svix", { status: 400 });
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
    return new Response("Error: Firma no válida", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    await getSupabase()
      .from("users")
      .insert({
        id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
      });
  }

  if (eventType === "user.updated") {
    const { id, first_name, last_name } = evt.data;

    await getSupabase()
      .from("users")
      .update({ name: `${first_name} ${last_name}` })
      .eq("id", id);
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    await getSupabase().from("users").delete().eq("id", id);
  }

  return new Response("", { status: 200 });
}
