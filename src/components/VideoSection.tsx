import { useRef, useEffect } from "react";

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <section className="py-24 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Spot in <span className="text-gradient">Motion</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Playful vibes, everyday wear.
          </p>
        </div>

        {/* Video Container */}
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden glow-border aspect-video max-w-4xl mx-auto"
        >
          <video
            ref={videoRef}
            src="/videos/spot-video.mp4"
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
