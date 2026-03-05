import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { ArrowRight, ShoppingBag, Star, Truck, Shield } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const Hero = () => {
  const unicornRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    interface WindowWithUnicornStudio extends Window {
      UnicornStudio?: { isInitialized?: boolean; init?: () => void; };
    }
    const win = window as WindowWithUnicornStudio;
    if (!win.UnicornStudio) {
      const script = document.createElement("script");
      script.src = "https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js";
      script.async = true;
      script.onload = () => {
        const us = (window as WindowWithUnicornStudio).UnicornStudio;
        if (us && !us.isInitialized) { us.init?.(); us.isInitialized = true; }
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
      <div ref={unicornRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} aria-hidden="true">
        <div data-us-project="YD8z0qjl8ze8msKKYKTf" style={{ width: '100%', height: '100%', minHeight: '100vh' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30 dark:to-transparent z-10" aria-hidden="true" />

      <div className="relative z-20 section-container text-center py-24">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-background/40 backdrop-blur-sm border border-foreground/10 rounded-full px-4 py-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" aria-hidden="true" />)}
            </div>
            <span className="text-sm font-medium text-foreground">{t("hero.rating")}</span>
            <span className="text-sm text-muted-foreground">{t("hero.fromReviews")}</span>
          </div>

          <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-gradient">{t("hero.heading1")}</span>
            <span className="text-foreground">{t("hero.heading2")}</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">{t("hero.subheading")}</p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" aria-hidden="true" /><span>{t("hero.premiumFabrics")}</span></div>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" aria-hidden="true" /><span>{t("hero.delivery")}</span></div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" aria-hidden="true" /><span>{t("hero.returns")}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              <LiquidGlassButton size="xl">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                <span>{t("hero.shopCollection")}</span>
              </LiquidGlassButton>
            </a>
            <Button variant="glass-outline" size="xl" className="gap-2" onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}>
              <span>{t("hero.seeStory")}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-2">
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">{t("hero.exploreHoodies")}</a>
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">{t("hero.kidsCollection")}</a>
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">{t("hero.accessories")}</a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-secondary/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
