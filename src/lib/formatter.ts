export function roundTo2Decimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  
  export function formatPercent(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "percent"
    }).format(value);
  }
  