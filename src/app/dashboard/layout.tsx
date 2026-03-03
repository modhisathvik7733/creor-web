"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Activity,
  FolderOpen,
  Users,
  ChevronLeft,
} from "lucide-react";

const sidebarItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex w-56 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="text-[13px] font-semibold tracking-[-0.02em]">
            Creor
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-foreground-secondary hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-foreground-secondary transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
