import { describe, it, expect } from "vitest";
import { roundTo2Decimals, formatCurrency, formatPercent } from "./formatter";

describe("formatter", () => {
  it("roundTo2Decimals rounds correctly", () => {
    expect(roundTo2Decimals(1.005)).toBe(1.01);
    expect(roundTo2Decimals(1.004)).toBe(1);
    expect(roundTo2Decimals(12.3456)).toBe(12.35);
  });

  it("formatCurrency formats USD with 2 decimals", () => {
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(12.3)).toBe("$12.30");
  });

  it("formatPercent formats percent (Intl default)", () => {
    // 0.1234 => "12%"
    expect(formatPercent(0.1234)).toBe("12%");
    expect(formatPercent(0)).toBe("0%");
  });
});
