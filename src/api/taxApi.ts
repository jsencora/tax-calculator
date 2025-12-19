import type { TaxBracket, TaxYear, TaxBracketsResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTaxBrackets(year: TaxYear): Promise<TaxBracket[]> {
  if (!API_BASE_URL) {
    throw new Error("Missing VITE_API_BASE_URL environment variable");
  }

  const response = await fetch(
    `${API_BASE_URL}/tax-calculator/tax-year/${year}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch tax brackets (${response.status})`);
  }

  const data: TaxBracketsResponse = await response.json();

  return data.tax_brackets;
}