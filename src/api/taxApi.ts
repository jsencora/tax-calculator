import type { TaxBracket, TaxYear, TaxBracketsResponse } from "../types";

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 1
): Promise<Response> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Failed to fetch tax brackets. HTTP error ${res.status}`);
    }

    return res;
  } catch (err) {
    if (retries <= 0) throw err;
    return fetchWithRetry(url, options, retries - 1);
  }
}

export async function getTaxBrackets(
  year: TaxYear,
  signal?: AbortSignal,
  baseUrl: string = import.meta.env.VITE_API_BASE_URL
): Promise<TaxBracket[]> {
  if (!baseUrl) {
    throw new Error("Missing VITE_API_BASE_URL environment variable");
  }

  const response = await fetchWithRetry(
    `${baseUrl}/tax-calculator/tax-year/${year}`,
    {
      headers: { Accept: "application/json" },
      signal,
    },
    1 //This can be changed depending on how many retries are desired
  );

  const data: TaxBracketsResponse = await response.json();
  return data.tax_brackets;
}
