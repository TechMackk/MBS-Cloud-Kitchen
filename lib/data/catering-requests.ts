export type CateringRequestStatus =
  | "NEW"
  | "ACKNOWLEDGED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type SubmissionChannel = "WA_DEEPLINK" | "WA_CLOUD_API" | "WEB";

export interface CateringRequestItemRecord {
  id: string;
  cateringItemId: string | null;
  name: string;
  pricePerPlate: number;
}

export interface CateringRequestRecord {
  id: string;
  requestNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  eventDate: Date;
  occasion: string;
  session: string;
  guestCount: number;
  dietPreference: string;
  eventLocation: string;
  instructions: string | null;
  internalNotes: string | null;
  estimatedTotal: number;
  status: CateringRequestStatus;
  channel: SubmissionChannel;
  whatsappMessageId: string | null;
  items: CateringRequestItemRecord[];
  createdAt: Date;
  updatedAt: Date;
  acknowledgedAt: Date | null;
}

export const CATERING_STATUS_LABELS: Record<CateringRequestStatus, string> = {
  NEW: "New",
  ACKNOWLEDGED: "Acknowledged",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const CATERING_STATUS_COLORS: Record<
  CateringRequestStatus,
  { bg: string; text: string }
> = {
  NEW: { bg: "bg-orange/15", text: "text-orange" },
  ACKNOWLEDGED: { bg: "bg-blue-100", text: "text-blue-700" },
  CONFIRMED: { bg: "bg-green-soft/20", text: "text-green-deep" },
  COMPLETED: { bg: "bg-green-deep/15", text: "text-green-deep" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700" },
};
