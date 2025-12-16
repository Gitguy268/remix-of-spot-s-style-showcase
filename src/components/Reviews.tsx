import { Star, Quote } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

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
              <article className="bg-card rounded-xl p-6 border border-border h-full flex flex-col">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <blockquote className="text-foreground mb-4 flex-grow">"{review.quote}"</blockquote>
                <p className="text-xs text-muted-foreground mb-3 bg-muted/10 px-2 py-1 rounded inline-block w-fit">{review.product}</p>
                <div className="flex items-center gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`} />)}</div>
                <div className="flex items-center justify-between">
                  <div><p className="font-semibold text-foreground">{review.name}</p><p className="text-xs text-muted-foreground">{review.date}</p></div>
                  {review.verified && <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Verified</span>}
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
