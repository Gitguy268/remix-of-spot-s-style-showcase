import { useRef, useEffect, useState } from "react";
import spotBook1 from "@/assets/spot-book-1.jpeg";
import spotBook2 from "@/assets/spot-book-2.jpeg";
import spotBook3 from "@/assets/spot-book-3.jpeg";
import spotBook4 from "@/assets/spot-book-4.jpeg";
import spotBook5 from "@/assets/spot-book-5.jpeg";
import spotBook6 from "@/assets/spot-book-6.jpeg";
import spotBook7 from "@/assets/spot-book-7.jpeg";
import spotBook8 from "@/assets/spot-book-8.jpeg";
import spotBook9 from "@/assets/spot-book-9.jpeg";

const bookImages = [
  spotBook1,
  spotBook2,
  spotBook3,
  spotBook4,
  spotBook5,
  spotBook6,
  spotBook7,
  spotBook8,
  spotBook9,
];

const SpotBook = () => {
  const bookRef = useRef<HTMLDivElement>(null);
  const [rotations, setRotations] = useState<number[]>(
    Array(bookImages.length + 2).fill(0)
  );

  useEffect(() => {
    const updateBook = (clientX: number) => {
      if (!bookRef.current) return;

      const rect = bookRef.current.getBoundingClientRect();
      const spineX = rect.left;
      const width = rect.width;

      const startX = spineX + width * 0.75;
      const endX = spineX - width * 0.75;

      let progress = (startX - clientX) / (startX - endX);
      progress = Math.max(0, Math.min(1, progress));

      const totalPages = bookImages.length + 2;
      const maxRotation = -170;

      const newRotations = Array(totalPages)
        .fill(0)
        .map((_, index) => {
          const pageFactor = index / (totalPages - 1);
          return progress * maxRotation * pageFactor;
        });

      setRotations(newRotations);
    };

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => updateBook(e.clientX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        requestAnimationFrame(() => updateBook(e.touches[0].clientX));
      }
    };

    // Start closed
    updateBook(window.innerWidth * 2);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const totalPages = bookImages.length + 2;

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Spot's Photo Book
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Move your mouse left and right to flip through Spot's adventures
          </p>
        </div>

        <div
          className="w-full h-[500px] md:h-[600px] flex justify-center items-center"
          style={{ perspective: "1500px" }}
        >
          <div
            className="transform -rotate-2"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={bookRef}
              className="relative w-[280px] h-[400px] md:w-[320px] md:h-[460px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Bottom cover */}
              <div
                className="absolute top-0 left-0 w-full h-full rounded-r-2xl rounded-l border-2 border-primary/60 bg-card"
                style={{
                  transformOrigin: "left center",
                  transform: `rotateY(${rotations[0]}deg) translateZ(0px)`,
                  backfaceVisibility: "visible",
                }}
              />

              {/* Photo pages */}
              {bookImages.map((image, index) => (
                <div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full rounded-r-2xl rounded-l border border-primary/40 overflow-hidden"
                  style={{
                    transformOrigin: "left center",
                    transform: `rotateY(${rotations[index + 1]}deg) translateZ(${index + 1}px)`,
                    backfaceVisibility: "visible",
                  }}
                >
                  <img
                    src={image}
                    alt={`Spot photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Top cover */}
              <div
                className="absolute top-0 left-0 w-full h-full rounded-r-2xl rounded-l border-2 border-primary bg-card flex flex-col justify-center items-center text-center p-6"
                style={{
                  transformOrigin: "left center",
                  transform: `rotateY(${rotations[totalPages - 1]}deg) translateZ(${totalPages - 1}px)`,
                  backfaceVisibility: "visible",
                }}
              >
                <div className="rotate-2">
                  <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                    Spot
                  </h3>
                  <p className="text-muted-foreground font-mono text-sm tracking-wider">
                    A Photo Album
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotBook;
