export type TaxYear = 2019 | 2020 | 2021 | 2022;

export type TaxBracket = {
  min: number;
  max?: number;
  rate: number;
};

export type TaxBracketsResponse = {
  tax_brackets: TaxBracket[];
};

export type TaxBandResult = {
    min: number;
    max?: number;
    rate: number;
    taxableIncome: number; // portion of income taxed in this band
    tax: number; // tax for this band
  };
  
  export type TaxCalculationResult = {
    income: number;
    totalTax: number;
    effectiveRate: number; // totalTax / income (0 if income <= 0)
    bands: TaxBandResult[];
  };