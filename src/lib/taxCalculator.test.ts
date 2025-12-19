import { describe, it, expect } from "vitest";
import { calculateTaxes } from "./taxCalculator";
import type { TaxBracket } from "../types";

describe("calculateTaxes", () => {
  const brackets: TaxBracket[] = [
    { min: 0, max: 100, rate: 0.1 },
    { min: 100, max: 200, rate: 0.2 },
    { min: 200, rate: 0.3 }, // testing with no max
  ];

  it("returns zero when income is 0", () => {
    const r = calculateTaxes(0, brackets);
    expect(r.income).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
    expect(r.bands).toEqual([]);
  });

  it("taxes within first band only", () => {
    const r = calculateTaxes(50, brackets);
    expect(r.totalTax).toBe(5);
    expect(r.effectiveRate).toBe(0.1);
    expect(r.bands).toEqual([
      { min: 0, max: 100, rate: 0.1, taxableIncome: 50, tax: 5 },
    ]);
  });

  it("splits tax marginally across bands", () => {
    const r = calculateTaxes(150, brackets);
    // 0-100 => 100 * 0.1 = 10
    // 100-150 => 50 * 0.2 = 10
    expect(r.totalTax).toBe(20);
    expect(r.effectiveRate).toBeCloseTo(20 / 150, 2);
    expect(r.bands.length).toBe(2);
    expect(r.bands[0].tax).toBe(10);
    expect(r.bands[1].tax).toBe(10);
  });

  it("handles top band without max", () => {
    const r = calculateTaxes(250, brackets);
    // 0-100 => 100 * 0.1 = 10
    // 100-200 => 100 * 0.2 = 20
    // 200-250 => 50 * 0.3 = 15
    expect(r.totalTax).toBe(45);
    expect(r.bands.length).toBe(3);
    expect(r.bands[2]).toEqual({
      min: 200,
      max: undefined,
      rate: 0.3,
      taxableIncome: 50,
      tax: 15,
    });
  });

  it("sanitizes negative and non-finite income", () => {
    expect(calculateTaxes(-100, brackets).income).toBe(0);
    expect(calculateTaxes(Number.NaN, brackets).income).toBe(0);
    expect(calculateTaxes(Number.POSITIVE_INFINITY, brackets).income).toBe(0);
  });

  it("does not rely on brackets being sorted", () => {
    const unsorted: TaxBracket[] = [
      { min: 100, max: 200, rate: 0.2 },
      { min: 0, max: 100, rate: 0.1 },
    ];
    const r = calculateTaxes(150, unsorted);
    expect(r.totalTax).toBe(20);
    expect(r.bands.length).toBe(2);
  });

  it("rounds to 2 decimals in outputs", () => {
    const b: TaxBracket[] = [{ min: 0, max: 1, rate: 0.3333333333 }];
    const r = calculateTaxes(1, b);
    // taxable=1, tax=0.333333... => 0.33
    expect(r.totalTax).toBe(0.33);
    expect(r.bands[0].tax).toBe(0.33);
  });
});
