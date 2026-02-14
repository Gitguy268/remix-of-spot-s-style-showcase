
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollVisibility } from "@/hooks/useScrollUtils";

const BackToTop = () => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      variant="glass"
      size="icon"
      className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full shadow-lg animate-fade-in"
      aria-label="Scroll back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
};

export default BackToTop;
