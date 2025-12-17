import { Star, Quote } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { GlassFilter } from "@/components/GlassDock";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`relative flex flex-col overflow-hidden cursor-pointer transition-all duration-700 hover:scale-[1.02] ${className}`}
    style={{
      boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
      transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    }}
  >
    <div
      className="absolute inset-0 z-0 overflow-hidden rounded-3xl"
      style={{
        backdropFilter: "blur(8px)",
        filter: "url(#glass-distortion)",
        isolation: "isolate",
      }}
    />
    <div
      className="absolute inset-0 z-10 rounded-3xl"
      style={{ background: "rgba(44, 187, 195, 0.08)" }}
    />
    <div
      className="absolute inset-0 z-20 rounded-3xl overflow-hidden"
      style={{
        boxShadow:
          "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.2)",
      }}
    />
    <div className="relative z-30 h-full">{children}</div>
  </div>
);

const Reviews = () => {
  const reviews = [
    { name: "Sarah M.", rating: 5, quote: "The quality is incredible! Super soft cotton and the Spot design is even better in person.", date: "November 28, 2024", product: "Spot Tee – Black, Size M", verified: true },
    { name: "James R.", rating: 5, quote: "Bought matching hoodies for my family. The fabric feels premium and the embroidery is top-notch!", date: "December 2, 2024", product: "Minimal Spot Hoodie – Charcoal, Size L", verified: true },
    { name: "Emily K.", rating: 5, quote: "As a Lab lover, I had to get this. The fit is perfect and I get compliments every time I wear it.", date: "December 8, 2024", product: "Spot Tee – White, Size S", verified: true },
    { name: "Michael T.", rating: 4, quote: "Great hoodie, very comfortable. Runs slightly large so consider sizing down.", date: "November 15, 2024", product: "Classic Spot Hoodie – Grey, Size XL", verified: true },
    { name: "Lisa P.", rating: 5, quote: "My son loves his Kids Spot Tee! Washes well and the organic cotton is gentle on his skin.", date: "December 10, 2024", product: "Kids Spot Tee – Light Blue, Size 6Y", verified: true },
    { name: "David W.", rating: 5, quote: "The dad hat is perfect. Embroidery is clean and comfortable for all-day wear.", date: "November 20, 2024", product: "Spot Dad Hat – Black", verified: true },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
              <GlassCard className="rounded-3xl bg-card/30 border border-primary/20 h-full">
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
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
