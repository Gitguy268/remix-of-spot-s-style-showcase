import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  badge?: string;
}

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const ProductCard = ({ name, price, image, badge }: ProductCardProps) => {
  return (
    <a 
      href={SHOP_URL} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative bg-card rounded-xl overflow-hidden border border-border card-hover cursor-pointer block"
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-muted/5">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Badge */}
      {badge && (
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground font-semibold">
          {badge}
        </Badge>
      )}

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">{price}</p>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </a>
  );
};

export default ProductCard;
