import { format } from "date-fns";

/** Generates zero-padded random digits for reference numbers. */
function randomDigits(length: number): string {
  const max = 10 ** length;
  const value = Math.floor(Math.random() * max);
  return value.toString().padStart(length, "0");
}

/** Creates a unique order number: MBS-YYYYMMDD-XXXX. */
export function generateOrderNumber(): string {
  const date = format(new Date(), "yyyyMMdd");
  return `MBS-${date}-${randomDigits(4)}`;
}

/** Creates a unique catering request number: MBS-CAT-YYYYMMDD-XXXX. */
export function generateCateringRequestNumber(): string {
  const date = format(new Date(), "yyyyMMdd");
  return `MBS-CAT-${date}-${randomDigits(4)}`;
}
