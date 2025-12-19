import type { TaxCalculationResult } from "../types";
import { formatCurrency, formatPercent } from "../lib/formatter";

type ResultsProps = {
  result: TaxCalculationResult;
};

const Results = ({ result }: ResultsProps) => {
  return (
    <div>
      <div>Total tax: {formatCurrency(result.totalTax)}</div>
      <div>Effective rate: {formatPercent(result.effectiveRate)}</div>
    </div>
  );
};

export default Results;

