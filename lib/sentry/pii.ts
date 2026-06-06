import type { ErrorEvent } from "@sentry/nextjs";

const PHONE_PATTERNS = [
  /\+91[\s-]?\d{5}[\s-]?\d{5}/g,
  /\b\d{10}\b/g,
  /\b91\d{10}\b/g,
];

const ADDRESS_KEYWORDS =
  /\b(deliveryAddress|delivery_address|customerPhone|customer_phone|address|phone)\b/i;

function scrubString(value: string): string {
  let result = value;
  for (const pattern of PHONE_PATTERNS) {
    result = result.replace(pattern, "[REDACTED_PHONE]");
  }
  return result;
}

function scrubValue(value: unknown): unknown {
  if (typeof value === "string") {
    return scrubString(value);
  }

  if (Array.isArray(value)) {
    return value.map(scrubValue);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const scrubbed: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(record)) {
      if (ADDRESS_KEYWORDS.test(key)) {
        scrubbed[key] = "[REDACTED]";
      } else {
        scrubbed[key] = scrubValue(nested);
      }
    }

    return scrubbed;
  }

  return value;
}

export function scrubPiiFromEvent(event: ErrorEvent): ErrorEvent {
  if (event.message) {
    event.message = scrubString(event.message);
  }

  if (event.exception?.values) {
    event.exception.values = event.exception.values.map((entry) => ({
      ...entry,
      value: entry.value ? scrubString(entry.value) : entry.value,
    }));
  }

  if (event.extra) {
    event.extra = scrubValue(event.extra) as Record<string, unknown>;
  }

  if (event.contexts) {
    event.contexts = scrubValue(event.contexts) as typeof event.contexts;
  }

  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((crumb) => ({
      ...crumb,
      message: crumb.message ? scrubString(crumb.message) : crumb.message,
      data: crumb.data
        ? (scrubValue(crumb.data) as Record<string, unknown>)
        : crumb.data,
    }));
  }

  return event;
}
