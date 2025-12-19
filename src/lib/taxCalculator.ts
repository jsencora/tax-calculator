import type { TaxBracket, TaxCalculationResult, TaxBandResult } from "../types";
import { roundTo2Decimals } from "./formatter";

export function calculateTaxes(
  incomeInput: number,
  brackets: TaxBracket[]
): TaxCalculationResult {
  const income = Number.isFinite(incomeInput) ? Math.max(0, incomeInput) : 0;

  // Sorting just to not to rely on the API being already sorted
  const sorted = [...brackets].sort((a, b) => a.min - b.min);

  const bands: TaxBandResult[] = [];
  let totalTax = 0;

  for (const band of sorted) {
    const min = band.min;
    const max = band.max;

    if (income <= min) {
      break;
    }

    const upper = max ?? Infinity;
    const taxable = Math.max(0, Math.min(income, upper) - min);
    const tax = taxable * band.rate;

    bands.push({
      min,
      max,
      rate: band.rate,
      taxableIncome: roundTo2Decimals(taxable),
      tax: roundTo2Decimals(tax),
    });

    totalTax += tax;
  }

  totalTax = roundTo2Decimals(totalTax);

  const effectiveRate = income > 0 ? roundTo2Decimals(totalTax / income) : 0;

  return {
    income: roundTo2Decimals(income),
    totalTax,
    effectiveRate,
    bands,
  };
}
