import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { GlassFilter } from "@/components/ui/liquid-glass";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Button } from "@/components/ui/button";

const Reviews = () => {
  const reviews = [
    { name: "Sarah M.", rating: 5, quote: "The quality is incredible! Super soft cotton and the Spot design is even better in person.", date: "November 28, 2024", product: "Spot Tee – Black, Size M", verified: true },
    { name: "James R.", rating: 5, quote: "Bought matching hoodies for my family. The fabric feels premium and the embroidery is top-notch!", date: "December 2, 2024", product: "Minimal Spot Hoodie – Charcoal, Size L", verified: true },
    { name: "Emily K.", rating: 5, quote: "As a Lab lover, I had to get this. The fit is perfect and I get compliments every time I wear it.", date: "December 8, 2024", product: "Spot Tee – White, Size S", verified: true },
    { name: "Michael T.", rating: 4, quote: "Great hoodie, very comfortable. Runs slightly large so consider sizing down.", date: "November 15, 2024", product: "Classic Spot Hoodie – Grey, Size XL", verified: true },
    { name: "Lisa P.", rating: 5, quote: "My son loves his Kids Spot Tee! Washes well and the organic cotton is gentle on his skin.", date: "December 10, 2024", product: "Kids Spot Tee – Light Blue, Size 6Y", verified: true },
    { name: "David W.", rating: 5, quote: "The dad hat is perfect. Embroidery is clean and comfortable for all-day wear.", date: "November 20, 2024", product: "Spot Dad Hat – Black", verified: true },
    { name: "Amanda C.", rating: 5, quote: "Got this for my husband and now he wants everything from the store! Fantastic quality.", date: "December 5, 2024", product: "Minimal Spot Hoodie – Black, Size L", verified: true },
    { name: "Tom B.", rating: 5, quote: "Shipping was fast and the packaging was lovely. The shirt exceeded my expectations.", date: "November 30, 2024", product: "Spot Tee – Navy, Size XL", verified: true },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const maxIndex = Math.max(0, reviews.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section id="reviews" className="py-24 bg-background overflow-hidden" aria-labelledby="reviews-heading">
      <GlassFilter />
      <div className="section-container">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 id="reviews-heading" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">What Customers Say</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}</div>
              <span className="text-lg font-semibold text-foreground">4.9/5</span>
              <span className="text-muted-foreground">from 200+ reviews</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background/80 backdrop-blur-sm disabled:opacity-30 hidden md:flex"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background/80 backdrop-blur-sm disabled:opacity-30 hidden md:flex"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
            {visibleReviews.map((review, index) => (
              <AnimatedSection key={review.name + review.date} animation="fade-up" delay={index * 100}>
                <LiquidGlassCard className="h-full">
                  <article className="p-6 flex flex-col h-full">
                    <Quote className="w-8 h-8 text-primary/50 mb-4" />
                    <blockquote className="text-foreground mb-4 flex-grow">"{review.quote}"</blockquote>
                    <p className="text-xs text-muted-foreground mb-3 bg-primary/10 px-2 py-1 rounded-full inline-block w-fit">{review.product}</p>
                    <div className="flex items-center gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`} />)}</div>
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold text-foreground">{review.name}</p><p className="text-xs text-muted-foreground">{review.date}</p></div>
                      {review.verified && <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">Verified</span>}
                    </div>
                  </article>
                </LiquidGlassCard>
              </AnimatedSection>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-4 mt-6 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="bg-background/80 backdrop-blur-sm disabled:opacity-30"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="bg-background/80 backdrop-blur-sm disabled:opacity-30"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Review pagination">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Go to review page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
