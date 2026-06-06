export function getOrdersWhatsAppNumber(): string {
  return (
    process.env.WHATSAPP_ORDERS_NUMBER ??
    process.env.NEXT_PUBLIC_WHATSAPP_ORDERS_NUMBER ??
    "918179656696"
  );
}

export function getCateringWhatsAppNumber(): string {
  return (
    process.env.WHATSAPP_CATERING_NUMBER ??
    process.env.NEXT_PUBLIC_WHATSAPP_CATERING_NUMBER ??
    "919676940777"
  );
}

export function isWhatsAppApiEnabled(): boolean {
  return process.env.ENABLE_WHATSAPP_API === "true";
}
