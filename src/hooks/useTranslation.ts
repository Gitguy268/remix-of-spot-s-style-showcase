import { useCallback } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { translations, type TranslationKey } from "@/i18n/translations";

export function useTranslation() {
  const { language } = useCurrency();

  const t = useCallback(
    (key: TranslationKey): string => {
      const langTranslations = translations[language.code];
      if (langTranslations && langTranslations[key]) {
        return langTranslations[key];
      }
      // Fallback to English
      return translations.en[key] || key;
    },
    [language.code]
  );

  return { t, language: language.code };
}
