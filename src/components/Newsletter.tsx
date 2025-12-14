import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to Spot's Pack!", {
        description: "You'll receive exclusive drops and early access.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-card to-background">
      <div className="section-container max-w-2xl text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Join Spot's <span className="text-gradient">Pack</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Exclusive drops, behind-the-scenes, and early access.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
            required
          />
          <Button type="submit" variant="default" size="lg" className="h-12">
            Subscribe
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
