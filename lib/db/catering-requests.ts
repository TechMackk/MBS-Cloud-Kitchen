import type {
  CateringRequest as PrismaCateringRequest,
  CateringRequestItem as PrismaCateringRequestItem,
  CateringStatus as PrismaCateringStatus,
  SubmissionChannel as PrismaSubmissionChannel,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import { addDays, endOfMonth, startOfMonth } from "date-fns";

import type {
  CateringRequestItemRecord,
  CateringRequestRecord,
  CateringRequestStatus,
  SubmissionChannel,
} from "@/lib/data/catering-requests";
import { prisma } from "@/lib/db/client";
import { generateCateringRequestNumber } from "@/lib/utils/reference-number";
import { normalizePhone } from "@/lib/utils/phone";

export type CateringRequestSortField = "eventDate" | "estimatedTotal";
export type SortOrder = "asc" | "desc";

export type CateringRequestFilters = {
  status?: CateringRequestStatus;
  occasion?: string;
  q?: string;
  dateFrom?: Date;
  dateTo?: Date;
  upcomingOnly?: boolean;
  limit?: number;
  offset?: number;
  sort?: CateringRequestSortField;
  order?: SortOrder;
};

export type CreateCateringRequestInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventDate: Date;
  occasion: string;
  session: string;
  guestCount: number;
  dietPreference: string;
  eventLocation: string;
  instructions?: string;
  estimatedTotal: number;
  channel?: SubmissionChannel;
  whatsappMessageId?: string;
  items: Array<{
    cateringItemId?: string;
    name: string;
    pricePerPlate: number;
  }>;
};

function decimalToNumber(value: Prisma.Decimal): number {
  return Number(value);
}

function toRequestItem(
  row: PrismaCateringRequestItem,
): CateringRequestItemRecord {
  return {
    id: row.id,
    cateringItemId: row.cateringItemId,
    name: row.name,
    pricePerPlate: decimalToNumber(row.pricePerPlate),
  };
}

function toRequest(
  row: PrismaCateringRequest & { items: PrismaCateringRequestItem[] },
): CateringRequestRecord {
  return {
    id: row.id,
    requestNumber: row.requestNumber,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail,
    eventDate: row.eventDate,
    occasion: row.occasion,
    session: row.session,
    guestCount: row.guestCount,
    dietPreference: row.dietPreference,
    eventLocation: row.eventLocation,
    instructions: row.instructions,
    internalNotes: row.internalNotes,
    estimatedTotal: decimalToNumber(row.estimatedTotal),
    status: row.status as CateringRequestStatus,
    channel: row.channel as SubmissionChannel,
    whatsappMessageId: row.whatsappMessageId,
    items: row.items.map(toRequestItem),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    acknowledgedAt: row.acknowledgedAt,
  };
}

function buildWhereClause(
  filters?: CateringRequestFilters,
): Prisma.CateringRequestWhereInput {
  const now = new Date();

  return {
    ...(filters?.status
      ? { status: filters.status as PrismaCateringStatus }
      : {}),
    ...(filters?.occasion ? { occasion: filters.occasion } : {}),
    ...(filters?.upcomingOnly
      ? {
          eventDate: {
            gte: now,
            lte: addDays(now, 30),
          },
        }
      : {}),
    ...(filters?.dateFrom || filters?.dateTo
      ? {
          eventDate: {
            ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
            ...(filters.dateTo ? { lte: filters.dateTo } : {}),
          },
        }
      : {}),
    ...(filters?.q
      ? {
          OR: [
            {
              requestNumber: { contains: filters.q, mode: "insensitive" },
            },
            {
              customerName: { contains: filters.q, mode: "insensitive" },
            },
            {
              customerPhone: { contains: filters.q, mode: "insensitive" },
            },
          ],
        }
      : {}),
  };
}

export async function getCateringRequests(
  filters?: CateringRequestFilters,
): Promise<CateringRequestRecord[]> {
  try {
    const rows = await prisma.cateringRequest.findMany({
      where: buildWhereClause(filters),
      include: { items: true },
      orderBy:
        filters?.sort === "estimatedTotal"
          ? { estimatedTotal: filters.order ?? "desc" }
          : { eventDate: filters?.order ?? "asc" },
      take: filters?.limit,
      skip: filters?.offset,
    });

    return rows.map(toRequest);
  } catch {
    return [];
  }
}

export async function countCateringRequests(
  filters?: CateringRequestFilters,
): Promise<number> {
  try {
    return await prisma.cateringRequest.count({
      where: buildWhereClause(filters),
    });
  } catch {
    return 0;
  }
}

export async function getCateringRequestByNumber(
  requestNumber: string,
): Promise<CateringRequestRecord | null> {
  try {
    const row = await prisma.cateringRequest.findUnique({
      where: { requestNumber },
      include: { items: true },
    });

    return row ? toRequest(row) : null;
  } catch {
    return null;
  }
}

async function createUniqueRequestNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const requestNumber = generateCateringRequestNumber();
    const existing = await prisma.cateringRequest.findUnique({
      where: { requestNumber },
      select: { id: true },
    });
    if (!existing) {
      return requestNumber;
    }
  }

  throw new Error("Failed to generate unique request number");
}

export async function createCateringRequest(
  input: CreateCateringRequestInput,
): Promise<CateringRequestRecord> {
  const requestNumber = await createUniqueRequestNumber();

  const row = await prisma.cateringRequest.create({
    data: {
      requestNumber,
      customerName: input.customerName.trim(),
      customerPhone: normalizePhone(input.customerPhone),
      customerEmail: input.customerEmail?.trim() || null,
      eventDate: input.eventDate,
      occasion: input.occasion,
      session: input.session,
      guestCount: input.guestCount,
      dietPreference: input.dietPreference,
      eventLocation: input.eventLocation.trim(),
      instructions: input.instructions?.trim() || null,
      estimatedTotal: new Prisma.Decimal(input.estimatedTotal),
      status: "NEW",
      channel: (input.channel ?? "WA_DEEPLINK") as PrismaSubmissionChannel,
      whatsappMessageId: input.whatsappMessageId ?? null,
      items: {
        create: input.items.map((item) => ({
          cateringItemId: item.cateringItemId ?? null,
          name: item.name,
          pricePerPlate: new Prisma.Decimal(item.pricePerPlate),
        })),
      },
    },
    include: { items: true },
  });

  return toRequest(row);
}

export async function updateCateringRequestStatus(
  requestNumber: string,
  status: CateringRequestStatus,
  options?: { whatsappMessageId?: string },
): Promise<CateringRequestRecord | null> {
  try {
    const now = new Date();
    const row = await prisma.cateringRequest.update({
      where: { requestNumber },
      data: {
        status: status as PrismaCateringStatus,
        ...(status === "ACKNOWLEDGED" ? { acknowledgedAt: now } : {}),
        ...(options?.whatsappMessageId
          ? { whatsappMessageId: options.whatsappMessageId }
          : {}),
      },
      include: { items: true },
    });

    return toRequest(row);
  } catch {
    return null;
  }
}

export async function updateCateringWhatsappMessageId(
  requestNumber: string,
  whatsappMessageId: string,
): Promise<CateringRequestRecord | null> {
  try {
    const row = await prisma.cateringRequest.update({
      where: { requestNumber },
      data: { whatsappMessageId },
      include: { items: true },
    });

    return toRequest(row);
  } catch {
    return null;
  }
}

export async function updateCateringInternalNotes(
  requestNumber: string,
  note: string,
): Promise<CateringRequestRecord | null> {
  try {
    const row = await prisma.cateringRequest.update({
      where: { requestNumber },
      data: { internalNotes: note.trim() },
      include: { items: true },
    });

    return toRequest(row);
  } catch {
    return null;
  }
}

export type CateringRequestStats = {
  pendingCount: number;
  upcomingCount: number;
  monthEstimatedRevenue: number;
};

export async function getCateringRequestStats(): Promise<CateringRequestStats> {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [pendingCount, upcomingCount, monthRequests] = await Promise.all([
      prisma.cateringRequest.count({
        where: {
          status: { in: ["NEW", "ACKNOWLEDGED", "CONFIRMED"] },
        },
      }),
      prisma.cateringRequest.count({
        where: {
          eventDate: { gte: now, lte: addDays(now, 30) },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.cateringRequest.findMany({
        where: {
          createdAt: { gte: monthStart, lte: monthEnd },
          status: { not: "CANCELLED" },
        },
        select: { estimatedTotal: true },
      }),
    ]);

    const monthEstimatedRevenue = monthRequests.reduce(
      (sum, request) => sum + decimalToNumber(request.estimatedTotal),
      0,
    );

    return { pendingCount, upcomingCount, monthEstimatedRevenue };
  } catch {
    return { pendingCount: 0, upcomingCount: 0, monthEstimatedRevenue: 0 };
  }
}
