import { describe, expect, it } from "vitest";

import {
  isWhatsAppWebUrl,
  parseWhatsAppWebUrl,
  whatsappAppUrl,
  whatsappUrl,
} from "@/lib/whatsapp/links";

describe("whatsappUrl", () => {
  it("builds api.whatsapp.com send URL with phone and text", () => {
    const url = whatsappUrl("918179656696", "Hello MBS");

    expect(url).toBe(
      "https://api.whatsapp.com/send?phone=918179656696&text=Hello+MBS",
    );
  });

  it("strips non-digits from phone", () => {
    const url = whatsappUrl("+91 81796 56696");

    expect(url).toBe("https://api.whatsapp.com/send?phone=918179656696");
  });
});

describe("whatsappAppUrl", () => {
  it("builds whatsapp:// scheme for mobile", () => {
    expect(whatsappAppUrl("918179656696", "Hi")).toBe(
      "whatsapp://send?phone=918179656696&text=Hi",
    );
  });
});

describe("parseWhatsAppWebUrl", () => {
  it("parses api.whatsapp.com URLs", () => {
    expect(
      parseWhatsAppWebUrl(
        "https://api.whatsapp.com/send?phone=918179656696&text=Test",
      ),
    ).toEqual({ phone: "918179656696", message: "Test" });
  });

  it("parses legacy wa.me URLs", () => {
    expect(
      parseWhatsAppWebUrl("https://wa.me/918179656696?text=Legacy"),
    ).toEqual({ phone: "918179656696", message: "Legacy" });
  });
});

describe("isWhatsAppWebUrl", () => {
  it("detects WhatsApp hosts", () => {
    expect(isWhatsAppWebUrl("https://api.whatsapp.com/send?phone=1")).toBe(
      true,
    );
    expect(isWhatsAppWebUrl("https://wa.me/1")).toBe(true);
    expect(isWhatsAppWebUrl("https://google.com")).toBe(false);
  });
});
