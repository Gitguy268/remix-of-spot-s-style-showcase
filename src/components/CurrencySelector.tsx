import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useCurrency, currencies, languages } from "@/contexts/CurrencyContext";

const CurrencySelector = () => {
  const { currency, setCurrency, language, setLanguage } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{language.flag}</span>
          <span className="text-xs font-medium">{currency.code}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Currency</DropdownMenuLabel>
        <div className="max-h-48 overflow-y-auto">
          {currencies.map((c) => (
            <DropdownMenuItem
              key={c.code}
              onClick={() => setCurrency(c)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>
                {c.symbol} {c.name}
              </span>
              {currency.code === c.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <div className="max-h-36 overflow-y-auto">
          {languages.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => setLanguage(l)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>
                {l.flag} {l.name}
              </span>
              {language.code === l.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
