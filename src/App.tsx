import { useState, useRef } from "react";
import type { TaxYear, Status } from "./types";
import { getTaxBrackets } from "./api/taxApi";
import { calculateTaxes } from "./lib/taxCalculator";
import Form from "./components/form/Form";
import Results from "./components/results/Results";
import "./App.css";

function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateTaxes> | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (data: { year: TaxYear; income: number }) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    
    setStatus("loading");
    setError(null);
    setResult(null);


    try {
      const brackets = await getTaxBrackets(data.year, controller.signal);
      const calculation = calculateTaxes(data.income, brackets);

      if (controller.signal.aborted) return;

      setResult(calculation);
      setStatus("success");
    } catch {
      if (controller.signal.aborted) return;

      setError("Failed to load tax data. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="container">
      <h1>Tax Calculator</h1>
      <h2>Calculate your Total Taxes and Effective Rate</h2>
      <Form onSubmit={handleSubmit} isSubmitting={status === "loading"}/>

      {status === "loading" && <div>Loading…</div>}

      {status === "error" && <div role="alert">{error}</div>}

      {status === "success" && result && (
       <Results result={result}/>
      )}
    </div>
  );
}

export default App;
