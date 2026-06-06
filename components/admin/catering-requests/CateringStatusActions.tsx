"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateCateringStatusAction } from "@/app/admin/catering-requests/actions";
import { Button } from "@/components/ui/button";
import type {
  CateringRequestRecord,
  CateringRequestStatus,
} from "@/lib/data/catering-requests";

const STATUS_ACTIONS: Array<{
  label: string;
  status: CateringRequestStatus;
}> = [
  { label: "Acknowledge", status: "ACKNOWLEDGED" },
  { label: "Confirm", status: "CONFIRMED" },
  { label: "Complete", status: "COMPLETED" },
  { label: "Cancel", status: "CANCELLED" },
];

export interface CateringStatusActionsProps {
  request: CateringRequestRecord;
}

export function CateringStatusActions({ request }: CateringStatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatus(status: CateringRequestStatus) {
    startTransition(async () => {
      const result = await updateCateringStatusAction(
        request.requestNumber,
        status,
      );
      if (result.success) {
        toast.success("Status updated");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  if (request.status === "CANCELLED" || request.status === "COMPLETED") {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_ACTIONS.map((action) => {
        if (request.status === action.status) return null;

        return (
          <Button
            key={action.status}
            type="button"
            variant={action.status === "CANCELLED" ? "outline" : "default"}
            size="sm"
            className={
              action.status === "CANCELLED"
                ? "text-red-600 hover:text-red-700"
                : undefined
            }
            disabled={isPending}
            onClick={() => handleStatus(action.status)}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
