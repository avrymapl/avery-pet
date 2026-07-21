import Link from "next/link";

export function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-1.5 font-ui text-sm transition-colors ${
        active
          ? "bg-green-pale font-bold text-green-deep"
          : "text-ink-soft hover:bg-green-pale/50 hover:text-green-deep"
      }`}
    >
      {children}
    </Link>
  );
}
