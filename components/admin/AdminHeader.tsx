"use client";

import { signOut } from "next-auth/react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export interface AdminHeaderProps {
  userName: string;
  userRole: "ADMIN" | "STAFF";
}

export function AdminHeader({ userName, userRole }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-green-soft/20 bg-bg px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Logo className="h-9 w-9 text-xs" />
        <div>
          <p className="font-heading text-sm font-semibold text-green-deep">
            {SITE.name}
          </p>
          <p className="text-xs text-green-soft">Admin Portal</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-green-deep">{userName}</p>
          <span className="inline-block rounded-full bg-cream px-2 py-0.5 text-xs font-medium text-green-deep">
            {userRole}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
