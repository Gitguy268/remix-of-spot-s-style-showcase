import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { LazyImage } from "@/components/ui/lazy-image";
import WishlistButton from "@/components/WishlistButton";
import { CompareButton } from "@/components/ProductComparison";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Star, Truck, Eye } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  badge?: string;
  fabric?: string;
  fit?: string;
  colors?: string[];
  delivery?: string;
  sizes?: string;
  category?: string;
  shopUrl?: string;
  onQuickView?: () => void;
  isCompareSelected?: boolean;
  onToggleCompare?: () => void;
  compareDisabled?: boolean;
}

const DEFAULT_SHOP_URL = "https://blacklabspotsshop.printify.me/";

const ProductCard = ({ 
  name, 
  price, 
  image, 
  badge, 
  fabric, 
  fit, 
  colors, 
  delivery, 
  sizes, 
  category = "Products",
  shopUrl,
  onQuickView,
  isCompareSelected,
  onToggleCompare,
  compareDisabled,
}: ProductCardProps) => {
  const { formatPrice } = useCurrency();

  return (
    <LiquidGlassCard className="group relative">
      <a 
        href={shopUrl || DEFAULT_SHOP_URL} 
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <div className="aspect-square overflow-hidden bg-muted/5 relative rounded-t-xl">
          <LazyImage 
            src={image} 
            alt={`${name} - ${fabric || 'Premium apparel'}`} 
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {badge && <Badge variant={badge === "New" ? "default" : "secondary"} className="absolute top-3 left-3">{badge}</Badge>}
        
        {/* Action buttons - Wishlist & Compare */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <WishlistButton 
            product={{ name, price, image, category }} 
          />
          {onToggleCompare && (
            <CompareButton
              productName={name}
              isSelected={isCompareSelected || false}
              onToggle={onToggleCompare}
              disabled={compareDisabled}
            />
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-primary font-bold">{formatPrice(price)}</p>
          {fabric && <p className="text-xs text-muted-foreground line-clamp-1">{fabric}</p>}
          {sizes && <p className="text-xs text-muted-foreground">Sizes: {sizes}</p>}
          {delivery && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Truck className="w-3 h-3" /><span>{delivery}</span></div>}
          <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}<span className="text-xs text-muted-foreground ml-1">(4.9)</span></div>
        </div>
      </a>
      
      {/* Quick View Button */}
      {onQuickView && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 gap-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView();
          }}
        >
          <Eye className="w-4 h-4" />
          <span>Quick View</span>
        </Button>
      )}
    </LiquidGlassCard>
  );
};

export default ProductCard;
