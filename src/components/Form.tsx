import { useState } from "react";
import type { TaxYear } from "../types";

const TAX_YEARS = [2019, 2020, 2021, 2022] as const;

type Props = {
  onSubmit: (data: { year: TaxYear; income: number; }) => void;
  isSubmitting: boolean
};

const Form = ({ onSubmit, isSubmitting }: Props) => {
  const [year, setYear] = useState<TaxYear | null>(null);
  const [income, setIncome] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (year === null) return;

    onSubmit({ year, income });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(Number(e.target.value))}
      />

      <select
        name="year"
        value={year ?? ""}
        onChange={(e) => {
          const year = Number(e.target.value);
          setYear(
            TAX_YEARS.includes(year as TaxYear) ? (year as TaxYear) : null
          );
        }}
      >
        <option value="">Selecciona un año</option>
        {TAX_YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <button type="submit" disabled={isSubmitting}>Calculate Tax</button>
    </form>
  );
};

export default Form;
