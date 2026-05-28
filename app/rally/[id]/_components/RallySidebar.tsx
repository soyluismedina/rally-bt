"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

export default function RallySidebar({
  rallyId,
  rallyName,
}: {
  rallyId: string;
  rallyName: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
      <Link
        href={`/rally/${rallyId}`}
        className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 hover:bg-slate-50 transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-teal-500" />
        <span className="text-sm font-bold text-slate-900 truncate">
          {rallyName}
        </span>
      </Link>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const href = item.href(rallyId);
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={`w-1.5 h-5 rounded-full ${item.color}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
