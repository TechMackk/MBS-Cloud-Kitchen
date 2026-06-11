import {
  parseWhatsAppWebUrl,
  whatsappAppUrl,
  whatsappUrl,
} from "@/lib/whatsapp/links";

export type OpenWhatsAppOptions = {
  phone?: string;
  message?: string;
  /** Pre-built HTTPS URL (e.g. from checkout/catering actions). */
  url?: string;
};

function isMobileUserAgent(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Opens WhatsApp in the native app on mobile; uses a new tab on desktop.
 */
export function openWhatsApp(options: OpenWhatsAppOptions): void {
  const webUrl =
    options.url ?? whatsappUrl(options.phone ?? "", options.message);

  if (isMobileUserAgent()) {
    const parsed = parseWhatsAppWebUrl(webUrl);
    const phone = options.phone
      ? options.phone.replace(/\D/g, "")
      : parsed.phone;
    const message = options.message ?? parsed.message;

    if (phone) {
      window.location.assign(whatsappAppUrl(phone, message));
      return;
    }
  }

  window.open(webUrl, "_blank", "noopener,noreferrer");
}
