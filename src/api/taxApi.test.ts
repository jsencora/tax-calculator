import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTaxBrackets } from "./taxApi";
import type { TaxBracketsResponse } from "../types";

describe("getTaxBrackets", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws if API base url is missing", async () => {
    await expect(getTaxBrackets(2022, undefined, "")).rejects.toThrow(
      "Missing VITE_API_BASE_URL environment variable"
    );
  });

  it("retries once and succeeds", async () => {
    const payload: TaxBracketsResponse = {
      tax_brackets: [{ min: 0, max: 10, rate: 0.1 }],
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => payload,
      });

    vi.stubGlobal("fetch", fetchMock as any);

    const res = await getTaxBrackets(2022, undefined, "http://example.com");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(res).toEqual(payload.tax_brackets);
  });

  it("fails after retries exhausted", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal("fetch", fetchMock as any);

    await expect(
      getTaxBrackets(2022, undefined, "http://example.com")
    ).rejects.toThrow("Failed to fetch tax brackets. HTTP error 500");

    expect(fetchMock).toHaveBeenCalledTimes(2); // 1 retry => 2 attempts
  });
});
