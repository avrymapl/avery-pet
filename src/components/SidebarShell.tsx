export function SidebarShell({
  sidebar,
  children,
  // Centred prose width by default; pages that need the full content area
  // (like the brainfuck ide) can override it.
  contentClassName = "mx-auto max-w-2xl",
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="md:flex md:min-h-screen">
      <aside className="border-b-4 border-border bg-paper-soft px-6 py-8 md:fixed md:inset-y-0 md:left-0 md:w-64 md:overflow-y-auto md:border-b-0 md:border-r-4 md:px-7 md:py-10">
        {sidebar}
      </aside>
      <main className="px-6 py-10 md:ml-64 md:min-h-screen md:flex-1 md:px-12 md:py-16">
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
