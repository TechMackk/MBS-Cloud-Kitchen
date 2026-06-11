export function normalizeWhatsAppPhone(phoneRaw: string): string {
  return phoneRaw.replace(/\D/g, "");
}

/**
 * Official HTTPS send URL. On mobile, opens the WhatsApp app when the link
 * is followed in the same tab (no target="_blank").
 */
export function whatsappUrl(phoneRaw: string, message?: string): string {
  const phone = normalizeWhatsAppPhone(phoneRaw);
  const params = new URLSearchParams({ phone });
  if (message) {
    params.set("text", message);
  }
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

/** Direct app scheme — used for programmatic opens on mobile. */
export function whatsappAppUrl(phoneRaw: string, message?: string): string {
  const phone = normalizeWhatsAppPhone(phoneRaw);
  const params = new URLSearchParams();
  if (message) {
    params.set("text", message);
  }
  const query = params.toString();
  return query
    ? `whatsapp://send?phone=${phone}&${query}`
    : `whatsapp://send?phone=${phone}`;
}

export function parseWhatsAppWebUrl(url: string): {
  phone?: string;
  message?: string;
} {
  try {
    const parsed = new URL(url);
    const phoneParam = parsed.searchParams.get("phone");
    const textParam = parsed.searchParams.get("text");

    if (phoneParam) {
      return {
        phone: normalizeWhatsAppPhone(phoneParam),
        message: textParam ?? undefined,
      };
    }

    if (parsed.hostname === "wa.me") {
      const phone = parsed.pathname.replace(/\D/g, "");
      return {
        phone: phone || undefined,
        message: textParam ?? undefined,
      };
    }
  } catch {
    // Ignore malformed URLs.
  }

  return {};
}

export function isWhatsAppWebUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "api.whatsapp.com" ||
      hostname === "wa.me" ||
      hostname === "web.whatsapp.com"
    );
  } catch {
    return false;
  }
}
