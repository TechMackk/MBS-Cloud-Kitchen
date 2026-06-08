import { describe, expect, it } from "vitest";

import { getActiveFestival } from "@/lib/home/festivals";

describe("getActiveFestival", () => {
  it("returns Bonalu config in July", () => {
    const result = getActiveFestival(new Date(2026, 6, 15));
    expect(result?.id).toBe("bonalu");
  });

  it("returns null outside configured ranges", () => {
    const result = getActiveFestival(new Date(2026, 5, 1));
    expect(result).toBeNull();
  });
});
