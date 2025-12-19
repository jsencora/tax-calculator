import type { TaxCalculationResult } from "../../types";
import { formatCurrency, formatPercent } from "../../lib/formatter";
import styles from "./Results.module.css";

type ResultsProps = {
  result: TaxCalculationResult;
};

const Results = ({ result }: ResultsProps) => {
  return (
    <div>
      <div className={styles.results}>Total tax: {formatCurrency(result.totalTax)}</div>
      <div className={styles.results}>Effective rate: {formatPercent(result.effectiveRate)}</div>
    </div>
  );
};

export default Results;

