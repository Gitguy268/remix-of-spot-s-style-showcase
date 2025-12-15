import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

const Hero = () => {
  const unicornRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Unicorn Studio script
    if (!(window as any).UnicornStudio) {
      (window as any).UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js";
      script.onload = () => {
        const us = (window as any).UnicornStudio;
        if (us && !us.isInitialized) {
          us.init?.();
          us.isInitialized = true;
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Unicorn Studio Animation Background */}
      <div 
        ref={unicornRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      >
        <div 
          data-us-project="YD8z0qjl8ze8msKKYKTf" 
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

      {/* Content Overlay */}
      <div className="relative z-20 section-container text-center py-24">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-gradient">Spot</span>
            <span className="text-foreground">-powered style.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">
            Playful, premium designs inspired by a real black Labrador.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="https://blacklabspotsshop.printify.me/" target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="xl">
                <ShoppingBag className="w-5 h-5" />
                Shop Spot's Collection
              </Button>
            </a>
            <Button 
              variant="hero-outline" 
              size="xl"
              onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See the Story
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-secondary/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};


export default Hero;
