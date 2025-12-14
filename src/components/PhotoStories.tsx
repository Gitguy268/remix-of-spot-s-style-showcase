import spotCozy from "@/assets/spot-cozy.png";
import spotFestive from "@/assets/spot-festive.png";
import spotSweater from "@/assets/spot-sweater.png";

const PhotoStories = () => {
  const stories = [
    {
      image: spotCozy,
      text: "Premium fabrics, cozy on cool days, breathable when it matters.",
    },
    {
      image: spotFestive,
      text: "Thoughtful embroidery—crisp edges and durable stitching for long-term wear.",
    },
    {
      image: spotSweater,
      text: "Designed for real life: playful, resilient, and always photogenic.",
    },
  ];

  return (
    <section id="story" className="py-24 bg-secondary/5">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Why Spot's Gear Feels <span className="text-gradient">Better</span>
          </h2>
        </div>

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
              <div className="w-full lg:w-1/2">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden glow-border">
                  <img
                    src={story.image}
                    alt={`Story ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2">
                <p className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
                  {story.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoStories;
