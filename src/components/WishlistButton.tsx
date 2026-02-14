import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { memo } from "react";
import type { WishlistProduct } from "@/types/product";

interface WishlistButtonProps {
  product: WishlistProduct;
  variant?: "icon" | "button";
  className?: string;
}

const WishlistButton = memo(({ product, variant = "icon", className }: WishlistButtonProps) => {
  const { isInWishlist, toggleItem } = useWishlist();
  const isWishlisted = isInWishlist(product.name);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  if (variant === "button") {
    return (
      <Button
        variant={isWishlisted ? "default" : "outline"}
        size="sm"
        onClick={handleClick}
        className={cn("gap-2", className)}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-all",
            isWishlisted && "fill-current"
          )}
        />
        {isWishlisted ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-2 rounded-full transition-all duration-200",
        "bg-background/80 backdrop-blur-sm border border-border/50",
        "hover:bg-background hover:scale-110",
        isWishlisted && "text-primary",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-all",
          isWishlisted && "fill-primary text-primary"
        )}
      />
    </button>
  );
});

WishlistButton.displayName = 'WishlistButton';

export default WishlistButton;
