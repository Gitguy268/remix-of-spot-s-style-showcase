import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderColor?: string;
  blurDataUrl?: string;
  aspectRatio?: string;
}

const LazyImage = ({
  src,
  alt,
  className,
  placeholderColor,
  blurDataUrl,
  aspectRatio,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Generate a simple blur placeholder from the primary color
  const defaultPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%232cbbc3' fill-opacity='0.1' width='100' height='100'/%3E%3C/svg%3E";

  return (
    <div 
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-muted/30",
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Blur placeholder */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
        style={{
          backgroundImage: `url(${blurDataUrl || defaultPlaceholder})`,
          filter: "blur(20px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Skeleton loader */}
      <div
        className={cn(
          "absolute inset-0 animate-pulse transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
        style={{
          background: `linear-gradient(
            90deg,
            hsl(var(--muted)) 0%,
            hsl(var(--muted) / 0.5) 50%,
            hsl(var(--muted)) 100%
          )`,
          backgroundSize: "200% 100%",
          animation: isLoaded ? "none" : "shimmer 1.5s infinite",
        }}
      />

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export { LazyImage };
