import type {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  OrderStatus as PrismaOrderStatus,
  SubmissionChannel as PrismaSubmissionChannel,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import {
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type {
  OrderItemRecord,
  OrderRecord,
  OrderStatus,
  SubmissionChannel,
} from "@/lib/data/orders";
import { prisma } from "@/lib/db/client";
import {
  generateOrderNumber,
} from "@/lib/utils/reference-number";
import { normalizePhone } from "@/lib/utils/phone";

export type OrderSortField = "createdAt" | "total";
export type SortOrder = "asc" | "desc";

export type OrderFilters = {
  status?: OrderStatus;
  q?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  sort?: OrderSortField;
  order?: SortOrder;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  channel?: SubmissionChannel;
  whatsappMessageId?: string;
  items: Array<{
    menuItemId?: string;
    name: string;
    price: number;
    quantity: number;
  }>;
};

function decimalToNumber(value: Prisma.Decimal): number {
  return Number(value);
}

function toOrderItem(row: PrismaOrderItem): OrderItemRecord {
  return {
    id: row.id,
    menuItemId: row.menuItemId,
    name: row.name,
    price: decimalToNumber(row.price),
    quantity: row.quantity,
    subtotal: decimalToNumber(row.subtotal),
  };
}

function toOrder(row: PrismaOrder & { items: PrismaOrderItem[] }): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    deliveryAddress: row.deliveryAddress,
    notes: row.notes,
    internalNotes: row.internalNotes,
    status: row.status as OrderStatus,
    subtotal: decimalToNumber(row.subtotal),
    total: decimalToNumber(row.total),
    channel: row.channel as SubmissionChannel,
    whatsappMessageId: row.whatsappMessageId,
    items: row.items.map(toOrderItem),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    acknowledgedAt: row.acknowledgedAt,
    deliveredAt: row.deliveredAt,
  };
}

function buildWhereClause(filters?: OrderFilters): Prisma.OrderWhereInput {
  return {
    ...(filters?.status ? { status: filters.status as PrismaOrderStatus } : {}),
    ...(filters?.dateFrom || filters?.dateTo
      ? {
          createdAt: {
            ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
            ...(filters.dateTo ? { lte: filters.dateTo } : {}),
          },
        }
      : {}),
    ...(filters?.q
      ? {
          OR: [
            { orderNumber: { contains: filters.q, mode: "insensitive" } },
            { customerName: { contains: filters.q, mode: "insensitive" } },
            { customerPhone: { contains: filters.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export async function getOrders(
  filters?: OrderFilters,
): Promise<OrderRecord[]> {
  try {
    const rows = await prisma.order.findMany({
      where: buildWhereClause(filters),
      include: { items: true },
      orderBy:
        filters?.sort === "total"
          ? { total: filters.order ?? "desc" }
          : { createdAt: filters?.order ?? "desc" },
      take: filters?.limit,
      skip: filters?.offset,
    });

    return rows.map(toOrder);
  } catch {
    return [];
  }
}

export async function countOrders(filters?: OrderFilters): Promise<number> {
  try {
    return await prisma.order.count({ where: buildWhereClause(filters) });
  } catch {
    return 0;
  }
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderRecord | null> {
  try {
    const row = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    return row ? toOrder(row) : null;
  } catch {
    return null;
  }
}

async function createUniqueOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const orderNumber = generateOrderNumber();
    const existing = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    });
    if (!existing) {
      return orderNumber;
    }
  }

  throw new Error("Failed to generate unique order number");
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<OrderRecord> {
  const orderNumber = await createUniqueOrderNumber();
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal;

  const row = await prisma.order.create({
    data: {
      orderNumber,
      customerName: input.customerName.trim(),
      customerPhone: normalizePhone(input.customerPhone),
      deliveryAddress: input.deliveryAddress.trim(),
      notes: input.notes?.trim() || null,
      status: "NEW",
      subtotal: new Prisma.Decimal(subtotal),
      total: new Prisma.Decimal(total),
      channel: (input.channel ?? "WA_DEEPLINK") as PrismaSubmissionChannel,
      whatsappMessageId: input.whatsappMessageId ?? null,
      items: {
        create: input.items.map((item) => ({
          menuItemId: item.menuItemId ?? null,
          name: item.name,
          price: new Prisma.Decimal(item.price),
          quantity: item.quantity,
          subtotal: new Prisma.Decimal(item.price * item.quantity),
        })),
      },
    },
    include: { items: true },
  });

  return toOrder(row);
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus,
  options?: { whatsappMessageId?: string },
): Promise<OrderRecord | null> {
  try {
    const now = new Date();
    const row = await prisma.order.update({
      where: { orderNumber },
      data: {
        status: status as PrismaOrderStatus,
        ...(status === "ACKNOWLEDGED" ? { acknowledgedAt: now } : {}),
        ...(status === "DELIVERED" ? { deliveredAt: now } : {}),
        ...(options?.whatsappMessageId
          ? { whatsappMessageId: options.whatsappMessageId }
          : {}),
      },
      include: { items: true },
    });

    return toOrder(row);
  } catch {
    return null;
  }
}

export async function updateOrderWhatsappMessageId(
  orderNumber: string,
  whatsappMessageId: string,
): Promise<OrderRecord | null> {
  try {
    const row = await prisma.order.update({
      where: { orderNumber },
      data: { whatsappMessageId },
      include: { items: true },
    });

    return toOrder(row);
  } catch {
    return null;
  }
}

export async function updateOrderInternalNotes(
  orderNumber: string,
  note: string,
): Promise<OrderRecord | null> {
  try {
    const row = await prisma.order.update({
      where: { orderNumber },
      data: { internalNotes: note.trim() },
      include: { items: true },
    });

    return toOrder(row);
  } catch {
    return null;
  }
}

export type OrderStats = {
  todayCount: number;
  pendingCount: number;
  weekRevenue: number;
};

export async function getOrderStats(): Promise<OrderStats> {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const [todayCount, pendingCount, weekOrders] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      prisma.order.count({
        where: {
          status: { in: ["NEW", "ACKNOWLEDGED", "CONFIRMED", "PREPARING"] },
        },
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: weekStart, lte: weekEnd },
          status: { not: "CANCELLED" },
        },
        select: { total: true },
      }),
    ]);

    const weekRevenue = weekOrders.reduce(
      (sum, order) => sum + decimalToNumber(order.total),
      0,
    );

    return { todayCount, pendingCount, weekRevenue };
  } catch {
    return { todayCount: 0, pendingCount: 0, weekRevenue: 0 };
  }
}
