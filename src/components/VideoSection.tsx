import { useRef, useEffect, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import spotTeeProduct from "@/assets/spot-tee-product.png";

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Spot in <span className="text-gradient">Motion</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Playful vibes, everyday wear.
            </p>
          </div>
        </AnimatedSection>

        {/* Video Container */}
        <AnimatedSection animation="scale-in" delay={200} parallax parallaxSpeed={0.15}>
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden glow-border aspect-video max-w-4xl mx-auto"
          >
            {hasError ? (
              <img
                src={spotTeeProduct}
                alt="Spot collection preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                src="/videos/spot-video.mp4"
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                poster={spotTeeProduct}
                onError={() => setHasError(true)}
              />
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default VideoSection;
