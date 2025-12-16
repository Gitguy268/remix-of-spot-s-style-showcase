import AnimatedSection from "@/components/AnimatedSection";
import celeb1 from "@/assets/celeb-1.jpeg";
import celeb2 from "@/assets/celeb-2.jpeg";
import celeb3 from "@/assets/celeb-3.png";

const Celebs = () => {
  const celebs = [
    { 
      name: "Taylor Swift", 
      image: celeb1,
      caption: "Rocking the Spot Tee at MusiCares",
      alt: "Taylor Swift wearing a red Spot t-shirt at a charity event"
    },
    { 
      name: "Queen Elizabeth II", 
      image: celeb2,
      caption: "A royal favorite since 2022",
      alt: "Queen Elizabeth II wearing a red Spot t-shirt at a formal event"
    },
    { 
      name: "Jeremy Clarkson", 
      image: celeb3,
      caption: "Casual trackside style",
      alt: "Jeremy Clarkson wearing a white Spot t-shirt next to a Porsche"
    },
  ];

  return (
    <section className="py-24 bg-card overflow-hidden" aria-labelledby="celebs-heading">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 id="celebs-heading" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Celebs in <span className="text-gradient">Spot</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Spotted on icons worldwide.
            </p>
          </div>
        </AnimatedSection>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {celebs.map((celeb, index) => (
            <AnimatedSection
              key={celeb.name}
              animation="scale-in"
              delay={index * 150}
            >
              <article className="group relative aspect-square rounded-2xl overflow-hidden border border-border card-hover">
                <img
                  src={celeb.image}
                  alt={celeb.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                
                {/* Label - Always visible */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-base font-semibold text-foreground">
                    {celeb.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {celeb.caption}
                  </p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Celebs;
