import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Truck, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';
import WishlistButton from '@/components/WishlistButton';
import { RatingDisplay } from '@/components/RatingDisplay';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getBadgeVariant } from '@/utils/badgeUtils';
import type { Product } from '@/types/product';

interface ProductQuickViewProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

const DEFAULT_SHOP_URL = "https://blacklabspotsshop.printify.me/";

const ProductQuickView = ({ open, onClose, product }: ProductQuickViewProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  const sizeOptions = product.sizes?.includes('–') 
    ? product.sizes.split('–').map(s => s.trim())
    : product.sizes?.split(',').map(s => s.trim()) || [];

  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', onKeyDown);
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setSelectedSize(null);
      setSelectedColor(product.colors?.[0] || null);
    }
  }, [open, product.colors]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 rounded-full bg-background/50 hover:bg-background/80"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-muted/10 overflow-hidden relative">
            <LazyImage 
              src={product.image} 
              alt={`${product.name} - ${product.fabric || 'Premium apparel'}`}
              className="w-full h-full"
            />
            <div className="absolute top-4 left-4">
              <WishlistButton 
                product={{ 
                  name: product.name, 
                  price: product.price, 
                  image: product.image, 
                  category: product.category
                }} 
              />
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                {product.badge && (
                  <Badge variant={getBadgeVariant(product.badge)} className="mb-2">
                    {product.badge}
                  </Badge>
                )}
                <h2 id="quick-view-title" className="text-2xl font-bold text-foreground">
                  {product.name}
                </h2>
              </div>
            </div>

            <p className="text-2xl font-bold text-primary mb-4">{formatPrice(product.price)}</p>

            {/* Rating */}
            <RatingDisplay size="md" reviewCount={200} />

            {/* Product Details */}
            <div className="space-y-3 mb-6 text-sm">
              {product.fabric && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Fabric:</span> {product.fabric}
                </p>
              )}
              {product.fit && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Fit:</span> {product.fit}
                </p>
              )}
              {product.delivery && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span>{product.delivery}</span>
                </div>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-2">Size: {product.sizes}</p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-4">
              <a href={product.shopUrl || DEFAULT_SHOP_URL} target="_blank" rel="noopener noreferrer" className="block">
                <LiquidGlassButton size="lg" className="w-full">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop Now
                </LiquidGlassButton>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;