import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 id="cookie-title" className="font-semibold text-foreground mb-1">
              We use cookies 🍪
            </h3>
            <p id="cookie-description" className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking "Accept", you consent to our use of cookies. 
              <Link to="/privacy" className="text-primary hover:underline ml-1">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDecline}
              className="flex-1 md:flex-none"
            >
              Decline
            </Button>
            <Button 
              variant="glass" 
              size="sm" 
              onClick={handleAccept}
              className="flex-1 md:flex-none"
            >
              Accept All
            </Button>
          </div>
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 md:static text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;