import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Music, Pause, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBirthdayMusic } from '@/hooks/useBirthdayMusic';
import { hasDismissedBirthdayToday, dismissBirthdayToday } from '@/utils/birthdayUtils';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  '#2cbbc3', // teal (primary)
  '#e1f1f2', // light teal
  '#FFD700', // gold
  '#FF69B4', // pink
  '#FF6B6B', // coral
  '#9B59B6', // purple
  '#3498DB', // blue
];

export const BirthdayCelebration = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const { isPlaying, isLoading, toggle, cleanup } = useBirthdayMusic();

  // Check if should show on mount
  useEffect(() => {
    if (!hasDismissedBirthdayToday()) {
      setIsVisible(true);
    }
  }, []);

  // Initialize confetti
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
      });
    }

    particlesRef.current = particles;
  }, []);

  // Animate confetti
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size / 2);
      ctx.restore();

      // Update position
      particle.y += particle.speedY;
      particle.x += particle.speedX;
      particle.rotation += particle.rotationSpeed;

      // Reset particle if it goes off screen
      if (particle.y > canvas.height) {
        particle.y = -particle.size;
        particle.x = Math.random() * canvas.width;
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Setup canvas and animation
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, initParticles, animate]);

  const handleDismiss = useCallback(() => {
    setIsFadingOut(true);
    dismissBirthdayToday();
    cleanup();
    
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  }, [cleanup]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Birthday celebration for Spot"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto animate-scale-in">
        {/* Birthday Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary">
          <Cake className="w-12 h-12 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gradient">
          Happy Birthday Spot!
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-foreground/80 mb-8">
          🎉 Celebrating our favorite black Labrador! 🐾
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={toggle}
            variant="default"
            size="lg"
            className="gap-2"
            disabled={isLoading}
            aria-label={isPlaying ? 'Pause birthday music' : 'Play birthday music'}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Loading...
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                Pause Music
              </>
            ) : (
              <>
                <Music className="w-5 h-5" />
                Play Music
              </>
            )}
          </Button>

          <Button
            onClick={handleDismiss}
            variant="outline"
            size="lg"
            className="gap-2"
            aria-label="Continue to website"
          >
            <X className="w-5 h-5" />
            Continue to Site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCelebration;
