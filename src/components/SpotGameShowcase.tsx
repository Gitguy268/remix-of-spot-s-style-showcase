import { Button } from "@/components/ui/button";
import { Gamepad2, Cookie, Ghost, Timer, ExternalLink } from "lucide-react";
import spotGameScreenshot from "@/assets/spot-game-screenshot.png";

const SpotGameShowcase = () => {
  const pros = [
    { icon: Gamepad2, text: "Instant fun: One-click play with quick, rewarding rounds." },
    { icon: Cookie, text: "Cute retro vibe: Crisp pixel art and playful animations." },
    { icon: Ghost, text: "Easy to learn: Simple controls perfect for all ages." },
    { icon: Timer, text: "Replayable: Biscuit scores and monster counts keep you chasing that next high score." },
  ];

  const stats = [
    { label: "Biscuits", value: "∞", description: "Collect them all" },
    { label: "Monsters", value: "Watch out!", description: "Dodge to survive" },
    { label: "Time", value: "Beat the clock", description: "Race against time" },
  ];

  return (
    <section 
      id="spot-game-showcase" 
      className="relative py-20 md:py-32 overflow-hidden"
      aria-label="Spot's Game showcase section"
    >
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${spotGameScreenshot})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="relative section-container">
        {/* Main showcase content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
            <Gamepad2 className="w-4 h-4" />
            New Experience
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Spot's <span className="text-gradient">Game</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Meet Spot and his own pixel adventure! Collect biscuits, dodge monsters, and race the clock in a bite-sized, super fun mini-game.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-4 md:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1 hidden md:block">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Pros list */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
          {pros.map((pro, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <pro.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{pro.text}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="glass" 
            size="xl"
            asChild
          >
            <a 
              href="https://019b4b76-8bc8-77ea-847c-154dc36744df.arena.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Play Now
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="lg"
            onClick={() => document.getElementById('spot-game-details')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Details section */}
      <div id="spot-game-details" className="relative section-container mt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Why Spot's Game is so fun
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Designed for instant joy, Spot's Game turns simple mechanics into addictive challenges. Whether you're collecting biscuits or outsmarting monsters, every run feels fresh.
              </p>
              <p className="leading-relaxed">
                Built for the web and optimized for quick loads, it keeps the action smooth and snappy across devices.
              </p>
              <p className="leading-relaxed">
                Spot's game blends cozy visuals with quick challenges—ideal for short breaks and sharing with friends. Tap play, collect biscuits, and see how long you can last!
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-lg">
              <img 
                src={spotGameScreenshot} 
                alt="Screenshot of Spot's pixel game showing biscuits, monsters, and timer HUD" 
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotGameShowcase;
