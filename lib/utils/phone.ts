export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }

  return digits.length > 0 ? `+${digits}` : trimmed;
}

export function toWaMePhone(e164: string): string {
  return e164.replace(/\D/g, "");
}

export function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^\+91\d{10}$/.test(normalized);
}
