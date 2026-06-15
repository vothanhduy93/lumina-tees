import React, { createContext, useContext, useState } from 'react';

export type CurrencyType = 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  convert: (usdAmount: number) => number;
  formatPrice: (usdAmount: number) => string;
  getSymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES: Record<CurrencyType, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
};

const SYMBOLS: Record<CurrencyType, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    const saved = localStorage.getItem('lumina_currency');
    return (saved as CurrencyType) || 'USD';
  });

  const setCurrency = (newCurrency: CurrencyType) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('lumina_currency', newCurrency);
  };

  const convert = (usdAmount: number): number => {
    const rate = RATES[currency] || 1.0;
    return usdAmount * rate;
  };

  const formatPrice = (usdAmount: number): string => {
    const converted = convert(usdAmount);
    const symbol = SYMBOLS[currency];
    return `${symbol}${converted.toFixed(2)}`;
  };

  const getSymbol = () => SYMBOLS[currency];

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convert,
      formatPrice,
      getSymbol
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
