"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShoppingBag,
  Soup,
  UtensilsCrossed,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Menu Items",
    href: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    label: "Catering Items",
    href: "/admin/catering",
    icon: Soup,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Catering Requests",
    href: "/admin/catering-requests",
    icon: ClipboardList,
  },
  {
    label: "Knowledge Base",
    href: "/admin/knowledge",
    icon: BookOpen,
  },
  {
    label: "Chat Sessions",
    href: "/admin/chat-sessions",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    disabled: true,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-green-soft/20 bg-bg md:block">
      <nav className="flex flex-col gap-1 p-4" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          if (item.disabled) {
            return (
              <span
                key={item.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text/40"
                title="Available in a future update"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-deep text-cream"
                  : "text-text/70 hover:bg-cream hover:text-green-deep",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
