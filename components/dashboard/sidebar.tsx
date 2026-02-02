"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, DollarSign, Megaphone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboard } from "@/lib/content";

const iconMap = {
  LayoutDashboard,
  Users,
  DollarSign,
  Megaphone,
  FileText
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-white">
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold">
            IG
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-muted-foreground">Gestão</span>
            <span className="text-base font-semibold">Igreja Clara</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {dashboard.menu.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href || 
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
