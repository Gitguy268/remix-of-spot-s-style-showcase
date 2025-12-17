import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const result = emailSchema.safeParse(email.trim());
    
    if (!result.success) {
      setStatus("error");
      setError(result.error.errors[0].message);
      return;
    }

    // Simulate successful subscription
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <section className="py-24 bg-gradient-to-b from-card to-background overflow-hidden">
        <div className="section-container max-w-2xl text-center">
          <AnimatedSection animation="scale-in">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Welcome to Spot's <span className="text-gradient">Pack</span>!
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              You're in! Watch your inbox for exclusive drops, behind-the-scenes content, and early access to new products.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setStatus("idle")}
              className="mx-auto"
            >
              Subscribe another email
            </Button>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-card to-background overflow-hidden" aria-labelledby="newsletter-heading">
      <div className="section-container max-w-2xl text-center">
        <AnimatedSection animation="scale-in">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>

          <h2 id="newsletter-heading" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Join Spot's <span className="text-gradient">Pack</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Exclusive drops, behind-the-scenes, and early access.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" noValidate>
            <div className="flex-1 relative">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className={`w-full bg-card border-border text-foreground placeholder:text-muted-foreground h-12 ${
                  status === "error" ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "email-error" : undefined}
              />
              {status === "error" && (
                <div id="email-error" className="absolute left-0 top-full mt-1 flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
            <Button type="submit" variant="glass" size="xl" className="h-12">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-8">
            By subscribing, you agree to receive marketing emails. No spam, unsubscribe anytime. 
            View our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Newsletter;