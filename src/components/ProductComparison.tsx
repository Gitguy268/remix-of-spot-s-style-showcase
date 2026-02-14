import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitCompare, X, Plus, Check, Minus } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

interface Product {
  name: string;
  price: string;
  image: string;
  category: string;
  fabric: string;
  fit: string;
  colors: string[];
  delivery: string;
  sizes: string;
}

interface ProductComparisonProps {
  products: Product[];
  selectedProducts: string[];
  onToggleProduct: (productName: string) => void;
  onClearComparison: () => void;
}

const ProductComparison = ({
  products,
  selectedProducts,
  onToggleProduct,
  onClearComparison,
}: ProductComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const selectedProductData = products.filter((p) =>
    selectedProducts.includes(p.name)
  );

  const comparisonRows = [
    { label: "Price", key: "price", format: (v: string) => formatPrice(v) },
    { label: "Category", key: "category" },
    { label: "Fabric", key: "fabric" },
    { label: "Fit", key: "fit" },
    { label: "Sizes", key: "sizes" },
    { label: "Delivery", key: "delivery" },
    { label: "Colors", key: "colors", isArray: true },
  ];

  if (selectedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-fade-up">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="gap-2 shadow-lg"
            size="lg"
          >
            <GitCompare className="w-5 h-5" />
            Compare ({selectedProducts.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Compare Products
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearComparison}
                className="text-muted-foreground"
              >
                Clear All
              </Button>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[70vh]">
            <div className="min-w-[600px]">
              {/* Product images row */}
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${selectedProductData.length}, 1fr)` }}>
                {selectedProductData.map((product) => (
                  <div key={product.name} className="relative text-center">
                    <button
                      onClick={() => onToggleProduct(product.name)}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                    />
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div className="border rounded-lg overflow-hidden">
                {comparisonRows.map((row, idx) => (
                  <div
                    key={row.label}
                    className={cn(
                      "grid gap-4 p-3",
                      idx % 2 === 0 ? "bg-muted/30" : "bg-background"
                    )}
                    style={{ gridTemplateColumns: `120px repeat(${selectedProductData.length}, 1fr)` }}
                  >
                    <div className="font-medium text-muted-foreground text-sm">
                      {row.label}
                    </div>
                    {selectedProductData.map((product) => (
                      <div key={product.name} className="text-sm">
                        {row.isArray ? (
                          <div className="flex flex-wrap gap-1">
                            {(product[row.key as keyof Product] as string[]).map((color) => (
                              <Badge key={color} variant="outline" className="text-xs">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        ) : row.format ? (
                          row.format(product[row.key as keyof Product] as string)
                        ) : (
                          product[row.key as keyof Product]
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Compare toggle button for product cards
export const CompareButton = ({
  productName,
  isSelected,
  onToggle,
  disabled,
}: {
  productName: string;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled && !isSelected}
      className={cn(
        "p-2 rounded-full transition-all duration-200",
        "bg-background/80 backdrop-blur-sm border border-border/50",
        "hover:bg-background hover:scale-110",
        isSelected && "bg-primary text-primary-foreground border-primary",
        disabled && !isSelected && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
      title={disabled && !isSelected ? "Max 3 products for comparison" : undefined}
    >
      {isSelected ? (
        <Check className="w-4 h-4" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </button>
  );
};

export default ProductComparison;
