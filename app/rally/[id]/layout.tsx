import { createSupabase } from "@/lib/supabase/db";
import { notFound } from "next/navigation";
import RallySidebar from "./_components/RallySidebar";

export default async function RallyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabase();
  const { data: rally } = await supabase
    .from("rally")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!rally) notFound();

  return (
    <div className="flex flex-1 min-h-0">
      <RallySidebar rallyId={rally.id} rallyName={rally.name} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
