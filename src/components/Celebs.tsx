import spotTeeModel from "@/assets/spot-tee-model.png";

const Celebs = () => {
  const celebs = [
    { name: "Featured Style 1", image: spotTeeModel },
    { name: "Featured Style 2", image: spotTeeModel },
    { name: "Featured Style 3", image: spotTeeModel },
  ];

  return (
    <section className="py-24 bg-card">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Celebs in <span className="text-gradient">Spot</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Styled by fans everywhere.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {celebs.map((celeb, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-border card-hover"
            >
              <img
                src={celeb.image}
                alt={celeb.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Label */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-semibold text-foreground">
                  {celeb.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tap to replace with your photo
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Placeholder images — replace with real celebrity photos
        </p>
      </div>
    </section>
  );
};

export default Celebs;
