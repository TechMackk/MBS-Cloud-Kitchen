"use client";

import { format } from "date-fns";
import Link from "next/link";

import { CateringStatusBadge } from "@/components/admin/catering-requests/CateringStatusBadge";
import type { CateringRequestRecord } from "@/lib/data/catering-requests";

export interface CateringRequestsTableProps {
  requests: CateringRequestRecord[];
}

export function CateringRequestsTable({
  requests,
}: CateringRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-green-soft/20 bg-bg px-6 py-16 text-center">
        <p className="font-heading text-lg font-semibold text-green-deep">
          No catering requests yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-green-soft/20 bg-bg">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-green-soft/20 bg-cream/30">
          <tr>
            <th className="px-4 py-3 font-medium text-green-deep">Request #</th>
            <th className="px-4 py-3 font-medium text-green-deep">Customer</th>
            <th className="px-4 py-3 font-medium text-green-deep">Event Date</th>
            <th className="px-4 py-3 font-medium text-green-deep">Occasion</th>
            <th className="px-4 py-3 font-medium text-green-deep">Guests</th>
            <th className="px-4 py-3 font-medium text-green-deep">Est. Total</th>
            <th className="px-4 py-3 font-medium text-green-deep">Status</th>
            <th className="px-4 py-3 font-medium text-green-deep">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-soft/10">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-4 py-3 font-mono text-xs font-medium text-orange">
                {request.requestNumber}
              </td>
              <td className="px-4 py-3 font-medium text-green-deep">
                {request.customerName}
              </td>
              <td className="px-4 py-3 text-text/70">
                {format(request.eventDate, "dd MMM yyyy")}
              </td>
              <td className="px-4 py-3 capitalize text-text/70">
                {request.occasion.replace(/-/g, " ")}
              </td>
              <td className="px-4 py-3 text-text/70">{request.guestCount}</td>
              <td className="px-4 py-3 font-semibold text-orange">
                ₹{request.estimatedTotal.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">
                <CateringStatusBadge status={request.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/catering-requests/${request.requestNumber}`}
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
