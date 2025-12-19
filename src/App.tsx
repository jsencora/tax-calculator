import { useState } from "react";
import type { TaxYear } from "./types";
import { getTaxBrackets } from "./api/taxApi";
import { calculateTaxes } from "./lib/taxCalculator";
import Form from "./components/Form";
import "./App.css";

function App() {
  const [result, setResult] = useState<ReturnType<
    typeof calculateTaxes
  > | null>(null);

  const handleSubmit = async (data: { year: TaxYear; income: number }) => {
    const brackets = await getTaxBrackets(data.year);
    const calculation = calculateTaxes(data.income, brackets);
    setResult(calculation);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} />
      {result && (
        <div>
          <div>Total tax: {result.totalTax}</div>
          <div>Effective rate: {result.effectiveRate}</div>
        </div>
      )}
    </>
  );
}

export default App;
