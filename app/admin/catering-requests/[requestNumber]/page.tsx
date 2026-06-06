import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { CateringStatusActions } from "@/components/admin/catering-requests/CateringStatusActions";
import { CateringStatusBadge } from "@/components/admin/catering-requests/CateringStatusBadge";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getCateringRequestByNumber } from "@/lib/db/catering-requests";
import { buildAdminLink } from "@/lib/whatsapp/deeplink";

export const dynamic = "force-dynamic";

type CateringRequestDetailPageProps = {
  params: Promise<{ requestNumber: string }>;
};

export default async function CateringRequestDetailPage({
  params,
}: CateringRequestDetailPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const { requestNumber } = await params;
  const request = await getCateringRequestByNumber(requestNumber);

  if (!request) {
    redirect("/admin/catering-requests");
  }

  const whatsappLink = buildAdminLink(
    request.customerPhone,
    `Hi ${request.customerName}, regarding your catering request ${request.requestNumber}...`,
  );

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <div className="mb-6">
        <Link
          href="/admin/catering-requests"
          className="text-sm text-text/60 hover:text-green-deep"
        >
          ← Back to Catering Requests
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-green-deep">
            {request.requestNumber}
          </h1>
          <p className="text-sm text-text/60">
            Submitted {format(request.createdAt, "dd MMM yyyy, h:mm a")}
          </p>
        </div>
        <CateringStatusBadge status={request.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-green-soft/20 bg-bg p-6">
          <h2 className="mb-4 font-heading font-semibold text-green-deep">
            Event Details
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text/60">Customer</dt>
              <dd className="font-medium">{request.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text/60">Phone</dt>
              <dd>{request.customerPhone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text/60">Event Date</dt>
              <dd>{format(request.eventDate, "dd MMM yyyy")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text/60">Occasion</dt>
              <dd className="capitalize">{request.occasion.replace(/-/g, " ")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text/60">Session</dt>
              <dd className="capitalize">{request.session}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text/60">Guests</dt>
              <dd>{request.guestCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text/60">Diet</dt>
              <dd className="capitalize">{request.dietPreference}</dd>
            </div>
            <div>
              <dt className="text-text/60">Location</dt>
              <dd className="mt-1">{request.eventLocation}</dd>
            </div>
            {request.instructions && (
              <div>
                <dt className="text-text/60">Instructions</dt>
                <dd className="mt-1">{request.instructions}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-2xl border border-green-soft/20 bg-bg p-6">
          <h2 className="mb-4 font-heading font-semibold text-green-deep">
            Selected Menu
          </h2>
          <ul className="space-y-2 text-sm">
            {request.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>{item.name}</span>
                <span>₹{item.pricePerPlate}/plate</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-green-soft/20 pt-4 font-heading font-bold text-orange">
            <span>Estimated Total</span>
            <span>₹{request.estimatedTotal.toLocaleString("en-IN")}</span>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-green-soft/20 bg-bg p-6">
        <h2 className="mb-4 font-heading font-semibold text-green-deep">
          Actions
        </h2>
        <CateringStatusActions request={request} />
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Open in WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </AdminShell>
  );
}
