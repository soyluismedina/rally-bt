import { cookies } from "next/headers";
import { createClient } from "./server";

export async function createSupabase() {
  const COOKIES = await cookies();
  return createClient(COOKIES);
}
