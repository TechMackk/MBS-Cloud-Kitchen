import { NextRequest, NextResponse } from "next/server";

import { webhookLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils/request-ip";
import {
  verifyWebhookChallenge,
  verifyWebhookSignature,
} from "@/lib/whatsapp/cloud-api/webhook";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  const verified = verifyWebhookChallenge(mode, token, challenge);

  if (verified) {
    return new NextResponse(verified, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = await webhookLimiter.limit(ip);

  if (!rateLimit.success) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  try {
    const payload = JSON.parse(rawBody) as {
      entry?: Array<{
        changes?: Array<{
          value?: {
            messages?: unknown[];
            statuses?: Array<{
              id: string;
              status: string;
              recipient_id: string;
            }>;
          };
        }>;
      }>;
    };

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        if (!value) continue;

        if (value.messages?.length) {
          console.info("[WhatsApp Webhook] Inbound message received");
        }

        for (const status of value.statuses ?? []) {
          console.info(
            `[WhatsApp Webhook] Message ${status.id} status: ${status.status}`,
          );
        }
      }
    }
  } catch (error) {
    console.error("[WhatsApp Webhook] Parse error:", error);
  }

  return new NextResponse("OK", { status: 200 });
}
