import { useRef, useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Grid, X } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
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
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [showGallery, setShowGallery] = useState(false);

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

  // Keyboard navigation for fullscreen view
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedPhoto === null) return;
      if (e.key === "ArrowLeft" && selectedPhoto > 0) {
        setSelectedPhoto(selectedPhoto - 1);
      } else if (e.key === "ArrowRight" && selectedPhoto < bookImages.length - 1) {
        setSelectedPhoto(selectedPhoto + 1);
      } else if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    },
    [selectedPhoto]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const goToPrev = () => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    }
  };

  const goToNext = () => {
    if (selectedPhoto !== null && selectedPhoto < bookImages.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  };

  const totalPages = bookImages.length + 2;

  return (
    <section className="py-16 md:py-24 overflow-hidden relative">
      <ParticleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Spot's Photo Book
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Move your mouse left and right to flip through Spot's adventures.
            Click any photo to view it full-screen.
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
                className="absolute top-0 left-0 w-full h-full rounded-r-2xl rounded-l border-2 border-primary/60 bg-card shadow-lg"
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
                  className="absolute top-0 left-0 w-full h-full rounded-r-2xl rounded-l border border-primary/40 overflow-hidden cursor-pointer group"
                  style={{
                    transformOrigin: "left center",
                    transform: `rotateY(${rotations[index + 1]}deg) translateZ(${index + 1}px)`,
                    backfaceVisibility: "visible",
                  }}
                  onClick={() => setSelectedPhoto(index)}
                >
                  <img
                    src={image}
                    alt={`Spot photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/80 text-foreground text-xs px-3 py-1.5 rounded-full font-medium">
                      View Full
                    </span>
                  </div>
                </div>
              ))}

              {/* Top cover */}
              <div
                className="absolute top-0 left-0 w-full h-full rounded-r-2xl rounded-l border-2 border-primary bg-card shadow-xl flex flex-col justify-center items-center text-center p-6"
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

        {/* View All Photos button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => setShowGallery(true)}
          >
            <Grid className="w-4 h-4" />
            View All Photos
          </Button>
        </div>
      </div>

      {/* Full-Screen Photo Dialog */}
      <Dialog
        open={selectedPhoto !== null}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-background/95 backdrop-blur-xl border-border overflow-hidden">
          <DialogTitle className="sr-only">
            Spot Photo {selectedPhoto !== null ? selectedPhoto + 1 : ""} of {bookImages.length}
          </DialogTitle>
          {selectedPhoto !== null && (
            <div className="relative flex items-center justify-center min-h-[50vh] max-h-[85vh]">
              <img
                src={bookImages[selectedPhoto]}
                alt={`Spot photo ${selectedPhoto + 1}`}
                className="w-full h-full max-h-[85vh] object-contain"
              />

              {/* Previous button */}
              {selectedPhoto > 0 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background shadow-md"
                  onClick={goToPrev}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}

              {/* Next button */}
              {selectedPhoto < bookImages.length - 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background shadow-md"
                  onClick={goToNext}
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}

              {/* Photo counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm text-foreground text-sm px-4 py-1.5 rounded-full border border-border">
                {selectedPhoto + 1} / {bookImages.length}
              </div>

              {/* View All button in fullscreen */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 left-4 gap-2 bg-background/80 hover:bg-background"
                onClick={() => {
                  setSelectedPhoto(null);
                  setShowGallery(true);
                }}
              >
                <Grid className="w-4 h-4" />
                All Photos
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* All Photos Gallery Dialog */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-bold text-foreground mb-1">
            All Photos
          </DialogTitle>
          <p className="text-sm text-muted-foreground mb-6">
            Click any photo to view it full-screen
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {bookImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer group border border-border hover:border-primary transition-colors"
                onClick={() => {
                  setShowGallery(false);
                  setSelectedPhoto(index);
                }}
              >
                <img
                  src={image}
                  alt={`Spot photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-200 flex items-end">
                  <span className="w-full text-center pb-3 text-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg">
                    Photo {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SpotBook;
