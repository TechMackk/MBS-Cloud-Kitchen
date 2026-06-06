import { format } from "date-fns";
import { notFound } from "next/navigation";

import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import { getOrderByNumber } from "@/lib/db/orders";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type OrderConfirmationPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params;
  return buildMetadata({
    title: `Order ${orderNumber}`,
    description: "Your MBS Cloud Kitchen order confirmation.",
    path: `/order/${orderNumber}`,
    noIndex: true,
  });
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-green-soft/20 bg-bg p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold text-green-deep">
            Order Confirmed
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>

        <p className="text-text/70">
          Your order has been received. We&apos;ll contact you on WhatsApp
          shortly.
        </p>

        <p className="mt-4 font-mono text-sm font-semibold text-orange">
          {order.orderNumber}
        </p>
        <p className="mt-1 text-sm text-text/50">
          Placed on {format(order.createdAt, "dd MMM yyyy, h:mm a")}
        </p>

        <ul className="mt-8 space-y-3 border-t border-green-soft/20 pt-6">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between gap-4 text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">
                ₹{item.subtotal.toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-between border-t border-green-soft/20 pt-4 font-heading text-lg font-bold text-orange">
          <span>Total</span>
          <span>₹{order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
