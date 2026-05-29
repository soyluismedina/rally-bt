import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response(
      "Error: Por favor añade el CLERK_WEBHOOK_SIGNING_SECRET en los .env",
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
  console.log({ eventType });
  const supabase = createAdminClient();

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    console.log({ id, email_addresses, first_name, last_name, image_url });
    const { error } = await supabase.from("user").insert({
      id,
      email: email_addresses?.[0]?.email_address ?? "",
      name: [first_name, last_name].filter(Boolean).join(" ") || null,
      image_url,
    });

    if (error) {
      return new Response(`Error al crear usuario: ${error.message}`, {
        status: 500,
      });
    }
  }

  if (eventType === "user.updated") {
    const { id, first_name, last_name, image_url, email_addresses } = evt.data;

    const updates: Record<string, string | null> = {
      name: [first_name, last_name].filter(Boolean).join(" ") || null,
    };

    if (image_url) updates.image_url = image_url;
    if (email_addresses?.[0]?.email_address) {
      updates.email = email_addresses[0].email_address;
    }

    const { error } = await supabase.from("user").update(updates).eq("id", id);

    if (error) {
      return new Response(`Error al actualizar usuario: ${error.message}`, {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const { error } = await supabase.from("user").delete().eq("id", id);

    if (error) {
      return new Response(`Error al eliminar usuario: ${error.message}`, {
        status: 500,
      });
    }
  }

  return new Response("", { status: 200 });
}
