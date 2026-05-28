import { getRallies } from "@/modules/home/action";
import HomeClient from "@/modules/home/HomeClient";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  const rallies = await getRallies(userId as string);
  return <HomeClient rallies={rallies} />;
}
