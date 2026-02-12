"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, DollarSign, UserCog, FileText, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboard } from "@/lib/content";
import Image from "next/image";
import logo from '../../docs/images/logo.png';

const iconMap = {
  LayoutDashboard,
  Users,
  DollarSign,
  UserCog,
  FileText,
  Tags
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-white">
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src={logo}
            width={130}
            loading="lazy"
            alt="Clerus Logo"
          />
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
