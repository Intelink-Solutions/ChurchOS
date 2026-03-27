import { createContext, useContext, useState, ReactNode } from "react";

export type CurrencyCode = "ngn" | "usd" | "gbp" | "eur" | "kes" | "ghs" | "zar" | "cad" | "aud" | "inr";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

export const currencies: CurrencyInfo[] = [
  { code: "ngn", symbol: "₦", label: "NGN (₦)" },
  { code: "usd", symbol: "$", label: "USD ($)" },
  { code: "gbp", symbol: "£", label: "GBP (£)" },
  { code: "eur", symbol: "€", label: "EUR (€)" },
  { code: "kes", symbol: "KSh", label: "KES (KSh)" },
  { code: "ghs", symbol: "GH₵", label: "GHS (GH₵)" },
  { code: "zar", symbol: "R", label: "ZAR (R)" },
  { code: "cad", symbol: "C$", label: "CAD (C$)" },
  { code: "aud", symbol: "A$", label: "AUD (A$)" },
  { code: "inr", symbol: "₹", label: "INR (₹)" },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>("ngn");

  const currency = currencies.find((c) => c.code === currencyCode) || currencies[0];

  const formatAmount = (amount: number) => {
    return `${currency.symbol}${amount.toLocaleString()}`;
  };

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
