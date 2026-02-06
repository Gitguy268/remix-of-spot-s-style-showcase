import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to USD
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.50 },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", rate: 0.88 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso", rate: 17.15 },
];

export const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  language: typeof languages[0];
  setLanguage: (language: typeof languages[0]) => void;
  convertPrice: (usdPrice: number) => string;
  formatPrice: (usdPriceRange: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies[0]);
  const [language, setLanguageState] = useState(languages[0]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("preferred-currency");
    const savedLanguage = localStorage.getItem("preferred-language");

    if (savedCurrency) {
      const found = currencies.find((c) => c.code === savedCurrency);
      if (found) setCurrencyState(found);
    }

    if (savedLanguage) {
      const found = languages.find((l) => l.code === savedLanguage);
      if (found) setLanguageState(found);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("preferred-currency", newCurrency.code);
  };

  const setLanguage = (newLanguage: typeof languages[0]) => {
    setLanguageState(newLanguage);
    localStorage.setItem("preferred-language", newLanguage.code);
  };

  const convertPrice = (usdPrice: number): string => {
    const converted = usdPrice * currency.rate;
    
    // Format based on currency
    if (currency.code === "JPY") {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const formatPrice = (usdPriceRange: string): string => {
    // Handle price ranges like "$41.47 – $45.99"
    const pricePattern = /\$?([\d.]+)/g;
    const matches = usdPriceRange.match(pricePattern);
    
    if (!matches) return usdPriceRange;

    const prices = matches.map((p) => parseFloat(p.replace("$", "")));
    
    if (prices.length === 1) {
      return convertPrice(prices[0]);
    }
    
    if (prices.length === 2) {
      return `${convertPrice(prices[0])} – ${convertPrice(prices[1])}`;
    }
    
    return usdPriceRange;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
