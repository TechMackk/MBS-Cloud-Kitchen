import { toWaMePhone } from "@/lib/utils/phone";

type SendResult = { messageId: string } | null;

function getApiBase(): string | null {
  const version = process.env.WHATSAPP_API_VERSION ?? "v20.0";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !token) {
    return null;
  }

  return `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;
}

async function postMessage(
  body: Record<string, unknown>,
): Promise<SendResult> {
  const apiBase = getApiBase();
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!apiBase || !token) {
    console.warn("[WhatsApp API] Missing credentials");
    return null;
  }

  try {
    const response = await fetch(apiBase, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[WhatsApp API] Send failed:", response.status, errorText);
      return null;
    }

    const data = (await response.json()) as {
      messages?: Array<{ id: string }>;
    };

    const messageId = data.messages?.[0]?.id;
    if (!messageId) {
      console.error("[WhatsApp API] No message ID in response");
      return null;
    }

    return { messageId };
  } catch (error) {
    console.error("[WhatsApp API] Request error:", error);
    return null;
  }
}

export async function sendTextMessage(
  to: string,
  body: string,
): Promise<SendResult> {
  return postMessage({
    messaging_product: "whatsapp",
    to: toWaMePhone(to),
    type: "text",
    text: { body },
  });
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  params: Record<string, string>,
): Promise<SendResult> {
  const components = [
    {
      type: "body",
      parameters: Object.values(params).map((value) => ({
        type: "text",
        text: value,
      })),
    },
  ];

  return postMessage({
    messaging_product: "whatsapp",
    to: toWaMePhone(to),
    type: "template",
    template: {
      name: templateName,
      language: { code: "en" },
      components,
    },
  });
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  const apiBase = getApiBase();
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!apiBase || !token) {
    return;
  }

  try {
    await fetch(apiBase, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    });
  } catch (error) {
    console.error("[WhatsApp API] Mark read error:", error);
  }
}
