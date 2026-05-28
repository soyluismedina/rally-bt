export default function PublicResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 mx-auto w-full max-w-5xl">
      {children}
    </main>
  );
}
