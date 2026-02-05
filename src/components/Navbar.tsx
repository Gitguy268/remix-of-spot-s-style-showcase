import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Shop", href: "#products" },
    { label: "About Spot", href: "/about", isPage: true },
    { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
  ];

  const location = useLocation();
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isPage?: boolean) => {
    if (isPage) {
      setIsOpen(false);
      return; // Let Link handle navigation
    }
    e.preventDefault();
    // If we're not on home page, navigate there first
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-bold text-gradient">Blacklabspotsshop</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isPage ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="sm" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Now</span>
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.isPage ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
                  >
                    {link.label}
                  </a>
                )
              ))}
              <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="default" className="mt-2 w-full gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
