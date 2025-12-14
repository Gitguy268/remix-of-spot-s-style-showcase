import { Star } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const Reviews = () => {
  const reviews = [
    {
      name: "Ava R.",
      rating: 5,
      quote: "Soft, durable, and the Spot design gets compliments every time.",
    },
    {
      name: "Noah D.",
      rating: 5,
      quote: "Hoodie quality surprised me—warm but not bulky. Embroidery is legit.",
    },
    {
      name: "Mia K.",
      rating: 4,
      quote: "Fast shipping, great fit. My new go-to tee.",
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-card overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              What Customers <span className="text-gradient">Say</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Sample reviews shown for design—replace with real customer feedback.
            </p>
          </div>
        </AnimatedSection>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <AnimatedSection
              key={index}
              animation="scale-in"
              delay={index * 150}
            >
              <div className="bg-background rounded-xl p-6 border border-border card-hover h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-4 leading-relaxed">
                  "{review.quote}"
                </p>

                {/* Name */}
                <p className="text-sm font-semibold text-muted-foreground">
                  — {review.name}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
