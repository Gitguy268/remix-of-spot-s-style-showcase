import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollVisibility } from "@/hooks/useScrollUtils";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const FloatingShopButton = () => {
  const isVisible = useScrollVisibility(600);

  if (!isVisible) return null;

  return (
    <a
      href={SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 animate-fade-in"
    >
      <Button variant="glass" size="lg" className="shadow-lg gap-2">
        <ShoppingBag className="w-5 h-5" />
        Shop Now
      </Button>
    </a>
  );
};

export default FloatingShopButton;
