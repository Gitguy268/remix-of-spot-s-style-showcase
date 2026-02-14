import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating?: number;
  maxRating?: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showReviewCount?: boolean;
}

/**
 * Reusable rating display component with stars and optional review count
 * Replaces duplicated rating logic across ProductCard and ProductQuickView
 */
export const RatingDisplay = ({
  rating = 4.9,
  maxRating = 5,
  reviewCount = 200,
  size = "sm",
  className,
  showReviewCount = true,
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const spacingClasses = {
    sm: "ml-1",
    md: "ml-2",
    lg: "ml-2",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            "fill-primary text-primary"
          )}
        />
      ))}
      {showReviewCount && (
        <span className={cn(
          textSizeClasses[size],
          spacingClasses[size],
          "text-muted-foreground"
        )}>
          ({rating}){reviewCount && size !== "sm" ? ` • ${reviewCount}+ reviews` : ""}
        </span>
      )}
    </div>
  );
};
