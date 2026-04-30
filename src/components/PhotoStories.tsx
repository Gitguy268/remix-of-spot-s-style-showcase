import AnimatedSection from "@/components/AnimatedSection";

const IMG_HOODIE = "https://images-api.printify.com/mockup/6931d763af55177fda0d5f67/68053/99231/minimal-black-labrador-embroidered-hoodie.jpg?camera_label=front&revision=1764882839842&s=1024";
const IMG_WARM_SPOT = "https://images-api.printify.com/mockup/69352a18282b17ae9609258e/94945/101396/warm-spot.jpg?camera_label=front&revision=1765111794521&s=1024";
const IMG_POLO = "https://images-api.printify.com/mockup/697f2f66bb695bec2a04e52c/118322/109526/spot-polo.jpg?camera_label=front&revision=1769943300786&s=1024";

const PhotoStories = () => {
  const stories = [
    {
      image: IMG_HOODIE,
      alt: "Minimal Black Labrador embroidered hoodie showing soft fabric and tasteful stitching",
      text: "Premium fabrics, cozy on cool days, breathable when it matters.",
    },
    {
      image: IMG_WARM_SPOT,
      alt: "Warm Spot sweater close-up highlighting embroidery quality",
      text: "Thoughtful embroidery—crisp edges and durable stitching for long-term wear.",
    },
    {
      image: IMG_POLO,
      alt: "Spot Polo styled for everyday wear demonstrating modern fit",
      text: "Designed for real life: playful, resilient, and always photogenic.",
    },
  ];

  return (
    <section id="story" className="py-24 overflow-hidden relative">
      <div className="section-container relative z-10">
        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Why Spot's Gear Feels <span className="text-gradient">Better</span>
            </h2>
          </div>
        </AnimatedSection>

        {/* Stories Grid */}
        <div className="space-y-24">
          {stories.map((story, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-16 items-center`}
            >
              {/* Image */}
              <AnimatedSection
                animation={index % 2 === 0 ? "slide-left" : "slide-right"}
                className="w-full lg:w-1/2"
                parallax
                parallaxSpeed={0.2}
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden glow-border bg-muted/10 flex items-center justify-center">
                  <img
                    src={story.image}
                    alt={story.alt}
                    className="w-full h-full object-contain p-4"
                    loading="lazy"
                  />
                </div>
              </AnimatedSection>

              {/* Text */}
              <AnimatedSection
                animation={index % 2 === 0 ? "slide-right" : "slide-left"}
                delay={200}
                className="w-full lg:w-1/2"
              >
                <p className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
                  {story.text}
                </p>
              </AnimatedSection>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoStories;
