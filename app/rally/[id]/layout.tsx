import { createSupabase } from "@/lib/supabase/db";
import { notFound } from "next/navigation";
import MobileNav from "./_components/MobileNav";
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
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
        {children}
      </main>
      <MobileNav rallyId={rally.id} />
    </div>
  );
}
