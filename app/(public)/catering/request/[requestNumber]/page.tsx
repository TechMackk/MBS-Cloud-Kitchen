import { format } from "date-fns";
import { notFound } from "next/navigation";

import { CateringStatusBadge } from "@/components/admin/catering-requests/CateringStatusBadge";
import { getCateringRequestByNumber } from "@/lib/db/catering-requests";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type CateringConfirmationPageProps = {
  params: Promise<{ requestNumber: string }>;
};

export async function generateMetadata({
  params,
}: CateringConfirmationPageProps) {
  const { requestNumber } = await params;
  return buildMetadata({
    title: `Catering Request ${requestNumber}`,
    description: "Your MBS Cloud Kitchen catering request confirmation.",
    path: `/catering/request/${requestNumber}`,
    noIndex: true,
  });
}

export default async function CateringConfirmationPage({
  params,
}: CateringConfirmationPageProps) {
  const { requestNumber } = await params;
  const request = await getCateringRequestByNumber(requestNumber);

  if (!request) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-green-soft/20 bg-bg p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold text-green-deep">
            Request Received
          </h1>
          <CateringStatusBadge status={request.status} />
        </div>

        <p className="text-text/70">
          Your catering enquiry has been received. We&apos;ll contact you on
          WhatsApp within 2 hours.
        </p>

        <p className="mt-4 font-mono text-sm font-semibold text-orange">
          {request.requestNumber}
        </p>

        <dl className="mt-8 space-y-3 border-t border-green-soft/20 pt-6 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-text/60">Event Date</dt>
            <dd className="font-medium">
              {format(request.eventDate, "dd MMM yyyy")}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text/60">Guests</dt>
            <dd className="font-medium">{request.guestCount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text/60">Menu Items</dt>
            <dd className="font-medium">{request.items.length} selected</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-green-soft/20 pt-3 font-heading text-base font-bold text-orange">
            <dt>Estimated Total</dt>
            <dd>₹{request.estimatedTotal.toLocaleString("en-IN")}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
