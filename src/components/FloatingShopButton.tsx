import { useState, useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const FloatingShopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const rafId = useRef(0);

  useEffect(() => {
    const toggleVisibility = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        // Show after scrolling past hero section (roughly 100vh)
        setIsVisible(window.scrollY > window.innerHeight);
      });
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

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
