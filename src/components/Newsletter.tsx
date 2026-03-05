import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { z } from "zod";
import { useTranslation } from "@/hooks/useTranslation";

const emailSchema = z.string().email("Please enter a valid email address");

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setStatus("error");
      setError(result.error.errors[0].message);
      return;
    }
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <section className="py-24 bg-gradient-to-b from-card to-background overflow-hidden">
        <div className="section-container max-w-2xl">
          <AnimatedSection animation="scale-in">
            <LiquidGlassCard className="p-8 text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {t("newsletter.successTitle")} <span className="text-gradient">{t("newsletter.successHighlight")}</span>!
              </h2>
              <p className="text-lg text-muted-foreground mb-8">{t("newsletter.successMessage")}</p>
              <Button variant="outline" onClick={() => setStatus("idle")} className="mx-auto">{t("newsletter.subscribeAnother")}</Button>
            </LiquidGlassCard>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-card to-background overflow-hidden" aria-labelledby="newsletter-heading">
      <div className="section-container max-w-2xl">
        <AnimatedSection animation="scale-in">
          <LiquidGlassCard className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <h2 id="newsletter-heading" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t("newsletter.title")} <span className="text-gradient">{t("newsletter.titleHighlight")}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">{t("newsletter.subtitle")}</p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" noValidate>
              <div className="flex-1 relative">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  className={`w-full bg-card border-border text-foreground placeholder:text-muted-foreground h-12 ${status === "error" ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={status === "error"}
                  aria-describedby={status === "error" ? "email-error" : undefined}
                />
                {status === "error" && (
                  <div id="email-error" className="absolute left-0 top-full mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />{error}
                  </div>
                )}
              </div>
              <Button type="submit" variant="glass" size="xl" className="h-12">{t("newsletter.subscribe")}</Button>
            </form>

            <p className="text-xs text-muted-foreground mt-8">
              {t("newsletter.disclaimer")}{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </LiquidGlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Newsletter;
