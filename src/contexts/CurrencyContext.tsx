import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { toast } from "sonner";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
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

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
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
  language: Language;
  setLanguage: (language: Language) => void;
  convertPrice: (usdPrice: number) => string;
  formatPrice: (usdPriceRange: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies[0]);
  const [language, setLanguageState] = useState<Language>(languages[0]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("preferred-currency");
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedCurrency) {
      const found = currencies.find((c) => c.code === savedCurrency);
      if (found) setCurrencyState(found);
    }
    if (savedLanguage) {
      const found = languages.find((l) => l.code === savedLanguage);
      if (found) { setLanguageState(found); document.documentElement.lang = found.code; }
    }
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("preferred-currency", newCurrency.code);
    toast.success(`Currency changed to ${newCurrency.name} (${newCurrency.symbol})`, { duration: 2000 });
  }, []);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("preferred-language", newLanguage.code);
    document.documentElement.lang = newLanguage.code;
    toast.success(`${newLanguage.flag} Language set to ${newLanguage.name}`, { description: "Content language preference saved.", duration: 2000 });
  }, []);

  const convertPrice = useCallback((usdPrice: number): string => {
    const converted = usdPrice * currency.rate;
    if (currency.code === "JPY") return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    return `${currency.symbol}${converted.toFixed(2)}`;
  }, [currency]);

  const formatPrice = useCallback((usdPriceRange: string): string => {
    const pricePattern = /\$?([\d.]+)/g;
    const matches = usdPriceRange.match(pricePattern);
    if (!matches) return usdPriceRange;
    const prices = matches.map((p) => parseFloat(p.replace("$", "")));
    if (prices.length === 1) return convertPrice(prices[0]);
    if (prices.length === 2) return `${convertPrice(prices[0])} – ${convertPrice(prices[1])}`;
    return usdPriceRange;
  }, [convertPrice]);

  const value = useMemo(() => ({
    currency, setCurrency, language, setLanguage, convertPrice, formatPrice,
  }), [currency, setCurrency, language, setLanguage, convertPrice, formatPrice]);

  return (
    <CurrencyContext.Provider value={value}>
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
