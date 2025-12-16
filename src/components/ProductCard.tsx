import { Badge } from "@/components/ui/badge";
import { Star, Truck } from "lucide-react";

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
}

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const ProductCard = ({ name, price, image, badge, fabric, fit, colors, delivery, sizes }: ProductCardProps) => {
  return (
    <a 
      href={SHOP_URL} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative bg-card rounded-xl overflow-hidden border border-border card-hover cursor-pointer block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
    >
      <div className="aspect-square overflow-hidden bg-muted/5">
        <img src={image} alt={`${name} - ${fabric || 'Premium apparel'}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      {badge && <Badge variant={badge === "New" ? "default" : "secondary"} className="absolute top-3 left-3">{badge}</Badge>}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-primary font-bold">{price}</p>
        {fabric && <p className="text-xs text-muted-foreground line-clamp-1">{fabric}</p>}
        {sizes && <p className="text-xs text-muted-foreground">Sizes: {sizes}</p>}
        {delivery && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Truck className="w-3 h-3" /><span>{delivery}</span></div>}
        <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}<span className="text-xs text-muted-foreground ml-1">(4.9)</span></div>
      </div>
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </a>
  );
};

export default ProductCard;
