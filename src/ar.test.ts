import { describe, expect, it } from "vitest";
import { getColorContrastRatio, validateQRCodeForAR, validateQRCodeReadback } from "./ar";

describe("AR QR validation", () => {
  it("accepts a high contrast 120 mm marker", () => {
    const result = validateQRCodeForAR({
      profile: { mode: "ar-marker", physicalSizeMm: 120, enforceQuietZone: true, minimumContrast: true },
      style: { foregroundColor: "#000000", backgroundColor: "#FFFFFF", logoSizeRatio: 0.15 }
    });
    expect(result.valid).toBe(true);
    expect(["excellent", "good"]).toContain(result.quality);
  });

  it("rejects insufficient physical size", () => {
    const result = validateQRCodeForAR({
      profile: { mode: "ar-marker", physicalSizeMm: 30 },
      style: { foregroundColor: "#000000", backgroundColor: "#FFFFFF" }
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === "physical-size-small")).toBe(true);
  });

  it("detects poor contrast", () => {
    const result = validateQRCodeForAR({
      profile: { mode: "ar-marker", physicalSizeMm: 120, minimumContrast: true },
      style: { foregroundColor: "#777777", backgroundColor: "#888888" }
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === "contrast-invalid")).toBe(true);
  });

  it("computes WCAG-style contrast ratio", () => {
    expect(getColorContrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 3);
  });

  it("validates generated QR readback", () => {
    expect(validateQRCodeReadback({ expectedPayload: "https://example.com/x/a", decodedPayload: null }).readable).toBe(false);
    expect(validateQRCodeReadback({ expectedPayload: "abc", decodedPayload: "abc" }).matches).toBe(true);
  });
});
