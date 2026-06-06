"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  cancelOrderAction,
  updateOrderStatusAction,
} from "@/app/admin/orders/actions";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import type { OrderRecord, OrderStatus } from "@/lib/data/orders";

const STATUS_ACTIONS: Array<{
  label: string;
  status: OrderStatus;
  variant?: "default" | "outline";
}> = [
  { label: "Acknowledge", status: "ACKNOWLEDGED" },
  { label: "Confirm", status: "CONFIRMED" },
  { label: "Mark Preparing", status: "PREPARING", variant: "outline" },
  {
    label: "Mark Out for Delivery",
    status: "OUT_FOR_DELIVERY",
    variant: "outline",
  },
  { label: "Mark Delivered", status: "DELIVERED" },
];

export interface OrderStatusActionsProps {
  order: OrderRecord;
}

export function OrderStatusActions({ order }: OrderStatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  function handleStatus(status: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatusAction(order.orderNumber, status);
      if (result.success) {
        toast.success(`Order marked as ${status.replace(/_/g, " ").toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  async function handleCancel() {
    const result = await cancelOrderAction(
      order.orderNumber,
      cancelReason || "Unavailable",
    );
    if (result.success) {
      toast.success("Order cancelled");
      setCancelOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  if (order.status === "CANCELLED" || order.status === "DELIVERED") {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {STATUS_ACTIONS.map((action) => {
          if (order.status === action.status) return null;

          return (
            <Button
              key={action.status}
              type="button"
              variant={action.variant ?? "default"}
              size="sm"
              disabled={isPending}
              onClick={() => handleStatus(action.status)}
            >
              {action.label}
            </Button>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700"
          disabled={isPending}
          onClick={() => setCancelOpen(true)}
        >
          Cancel
        </Button>
      </div>

      <DeleteConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel order?"
        description={`Cancel order ${order.orderNumber}. Provide a reason for the customer.`}
        onConfirm={handleCancel}
      />
      {cancelOpen && (
        <div className="mt-3">
          <label className="text-sm text-text/70" htmlFor="cancel-reason">
            Cancellation reason
          </label>
          <input
            id="cancel-reason"
            className="mt-1 w-full rounded-xl border border-green-soft/30 px-3 py-2 text-sm"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="e.g. Item unavailable"
          />
        </div>
      )}
    </>
  );
}
