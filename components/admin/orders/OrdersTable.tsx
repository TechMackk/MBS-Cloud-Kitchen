"use client";

import { format } from "date-fns";
import Link from "next/link";

import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import type { OrderRecord } from "@/lib/data/orders";

export interface OrdersTableProps {
  orders: OrderRecord[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-green-soft/20 bg-bg px-6 py-16 text-center">
        <p className="font-heading text-lg font-semibold text-green-deep">
          No orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-green-soft/20 bg-bg">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-green-soft/20 bg-cream/30">
          <tr>
            <th className="px-4 py-3 font-medium text-green-deep">Order #</th>
            <th className="px-4 py-3 font-medium text-green-deep">Customer</th>
            <th className="px-4 py-3 font-medium text-green-deep">Phone</th>
            <th className="px-4 py-3 font-medium text-green-deep">Items</th>
            <th className="px-4 py-3 font-medium text-green-deep">Total</th>
            <th className="px-4 py-3 font-medium text-green-deep">Status</th>
            <th className="px-4 py-3 font-medium text-green-deep">Channel</th>
            <th className="px-4 py-3 font-medium text-green-deep">Created</th>
            <th className="px-4 py-3 font-medium text-green-deep">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-soft/10">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3 font-mono text-xs font-medium text-orange">
                {order.orderNumber}
              </td>
              <td className="px-4 py-3 font-medium text-green-deep">
                {order.customerName}
              </td>
              <td className="px-4 py-3 text-text/70">{order.customerPhone}</td>
              <td className="px-4 py-3 text-text/70">{order.items.length}</td>
              <td className="px-4 py-3 font-semibold text-orange">
                ₹{order.total.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-xs text-text/60">
                {order.channel.replace(/_/g, " ")}
              </td>
              <td className="px-4 py-3 text-text/60">
                {format(order.createdAt, "dd MMM yyyy")}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/orders/${order.orderNumber}`}
                  className="text-sm font-medium text-orange hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
