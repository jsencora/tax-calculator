import { useState } from "react";
import type { TaxYear } from "../../types";
import styles from "./Form.module.css";

const TAX_YEARS = [2019, 2020, 2021, 2022] as const;

type Props = {
  onSubmit: (data: { year: TaxYear; income: number; }) => void;
  isSubmitting: boolean
};

const Form = ({ onSubmit, isSubmitting }: Props) => {
  const [year, setYear] = useState<TaxYear | null>(null);
  const [income, setIncome] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (year === null) return;

    const parsedIncome = income === "" ? 0 : Number(income);
    onSubmit({ year, income: parsedIncome });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        className={styles.inputs}
        placeholder="Introduce your salary"
      />

      <select
        className={styles.inputs}
        name="year"
        value={year ?? ""}
        onChange={(e) => {
          const year = Number(e.target.value);
          setYear(
            TAX_YEARS.includes(year as TaxYear) ? (year as TaxYear) : null
          );
        }}
      >
        <option value="">Select a year</option>
        {TAX_YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>Calculate Tax</button>
    </form>
  );
};

export default Form;
