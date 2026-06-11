import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusActions } from "@/components/admin/orders/OrderStatusActions";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/admin/orders/OrderTimeline";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getOrderByNumber } from "@/lib/db/orders";
import { buildAdminLink } from "@/lib/whatsapp/deeplink";

export const dynamic = "force-dynamic";

type OrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    redirect("/admin/orders");
  }

  const whatsappLink = buildAdminLink(
    order.customerPhone,
    `Hi ${order.customerName}, regarding your order ${order.orderNumber}...`,
  );

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      userRole={session.user.role}
    >
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="text-sm text-text/60 hover:text-green-deep"
        >
          ← Back to Orders
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-green-deep">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-text/60">
            {format(order.createdAt, "dd MMM yyyy, h:mm a")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-green-soft/20 bg-bg p-6">
            <h2 className="mb-4 font-heading font-semibold text-green-deep">
              Customer
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-text/60">Name</dt>
                <dd className="font-medium">{order.customerName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text/60">Phone</dt>
                <dd className="font-medium">{order.customerPhone}</dd>
              </div>
              <div>
                <dt className="text-text/60">Address</dt>
                <dd className="mt-1">{order.deliveryAddress}</dd>
              </div>
              {order.notes && (
                <div>
                  <dt className="text-text/60">Customer Notes</dt>
                  <dd className="mt-1">{order.notes}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-green-soft/20 bg-bg p-6">
            <h2 className="mb-4 font-heading font-semibold text-green-deep">
              Items
            </h2>
            <ul className="space-y-3">
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
            <div className="mt-4 flex justify-between border-t border-green-soft/20 pt-4 font-heading font-bold text-orange">
              <span>Total</span>
              <span>₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-green-soft/20 bg-bg p-6">
            <h2 className="mb-4 font-heading font-semibold text-green-deep">
              Status Actions
            </h2>
            <OrderStatusActions order={order} />
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <a href={whatsappLink} rel="noopener noreferrer">
                  Open in WhatsApp
                </a>
              </Button>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-green-soft/20 bg-bg p-6">
            <h2 className="mb-4 font-heading font-semibold text-green-deep">
              Timeline
            </h2>
            <OrderTimeline order={order} />
          </section>

          {order.internalNotes && (
            <section className="rounded-2xl border border-green-soft/20 bg-bg p-6">
              <h2 className="mb-2 font-heading font-semibold text-green-deep">
                Internal Notes
              </h2>
              <p className="text-sm text-text/70">{order.internalNotes}</p>
            </section>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}
