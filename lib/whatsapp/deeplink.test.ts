import { describe, expect, it } from "vitest";

import type { CateringRequestRecord } from "@/lib/data/catering-requests";
import type { OrderRecord } from "@/lib/data/orders";
import {
  buildCateringLink,
  buildCateringMessage,
  buildOrderLink,
  buildOrderMessage,
} from "@/lib/whatsapp/deeplink";

const sampleOrder: OrderRecord = {
  id: "order-1",
  orderNumber: "MBS-20250606-1234",
  customerName: "Test User",
  customerPhone: "919876543210",
  deliveryAddress: "Road No 3, Hyderabad",
  notes: "Extra spicy",
  internalNotes: null,
  status: "NEW",
  subtotal: 498,
  total: 498,
  channel: "WA_DEEPLINK",
  whatsappMessageId: null,
  items: [
    {
      id: "line-1",
      menuItemId: "menu-1",
      name: "Chicken Biryani",
      price: 249,
      quantity: 2,
      subtotal: 498,
    },
  ],
  createdAt: new Date("2025-06-06T10:00:00Z"),
  updatedAt: new Date("2025-06-06T10:00:00Z"),
  acknowledgedAt: null,
  deliveredAt: null,
};

const sampleCateringRequest: CateringRequestRecord = {
  id: "req-1",
  requestNumber: "MBS-CAT-20250606-5678",
  customerName: "Event Host",
  customerPhone: "919876543210",
  customerEmail: "host@example.com",
  eventDate: new Date("2025-07-15T00:00:00Z"),
  occasion: "wedding",
  session: "lunch",
  guestCount: 50,
  dietPreference: "veg",
  eventLocation: "Hyderabad",
  instructions: "No onion",
  internalNotes: null,
  estimatedTotal: 45000,
  status: "NEW",
  channel: "WA_DEEPLINK",
  whatsappMessageId: null,
  items: [
    {
      id: "item-1",
      cateringItemId: "catering-1",
      name: "Veg Biryani",
      pricePerPlate: 180,
    },
  ],
  createdAt: new Date("2025-06-06T10:00:00Z"),
  updatedAt: new Date("2025-06-06T10:00:00Z"),
  acknowledgedAt: null,
};

describe("buildOrderMessage", () => {
  it("includes order number, items, and total", () => {
    const message = buildOrderMessage(sampleOrder);

    expect(message).toContain("MBS-20250606-1234");
    expect(message).toContain("Chicken Biryani × 2");
    expect(message).toContain("₹498");
    expect(message).toContain("Test User");
  });
});

describe("buildCateringMessage", () => {
  it("includes event date, guest count, and selected items", () => {
    const message = buildCateringMessage(sampleCateringRequest);

    expect(message).toContain("MBS-CAT-20250606-5678");
    expect(message).toContain("15 Jul 2025");
    expect(message).toContain("Guests: 50");
    expect(message).toContain("Veg Biryani");
  });
});

describe("deeplink URLs", () => {
  it("encodes order message in WhatsApp send URL", () => {
    const url = buildOrderLink(sampleOrder);

    expect(url).toMatch(/^https:\/\/api\.whatsapp\.com\/send\?phone=\d+&text=/);
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("Chicken Biryani");
  });

  it("encodes catering message in WhatsApp send URL", () => {
    const url = buildCateringLink(sampleCateringRequest);

    expect(url).toMatch(/^https:\/\/api\.whatsapp\.com\/send\?phone=\d+&text=/);
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text.toLowerCase()).toContain("catering");
  });
});
