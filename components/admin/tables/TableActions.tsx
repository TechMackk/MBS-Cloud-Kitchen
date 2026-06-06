"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface TableActionsProps {
  editHref: string;
  onDelete: () => void;
}

export function TableActions({ editHref, onDelete }: TableActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="Edit">
        <Link href={editHref}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        aria-label="Delete"
        className="text-orange hover:text-orange"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <span className="sr-only">
        <MoreHorizontal aria-hidden="true" />
      </span>
    </div>
  );
}
