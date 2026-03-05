import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimatedSection from "@/components/AnimatedSection";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { useTranslation } from "@/hooks/useTranslation";

const FAQ = () => {
  const { t } = useTranslation();

  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
    { question: t("faq.q7"), answer: t("faq.a7") },
  ];

  return (
    <section id="faq" className="py-24 bg-card overflow-hidden" aria-labelledby="faq-heading">
      <div className="section-container">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{t("faq.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("faq.subtitle")}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-in" delay={200}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <LiquidGlassCard key={index} className="overflow-hidden">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="text-left hover:no-underline py-4 px-6">
                      <span className="font-semibold text-foreground">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 px-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </LiquidGlassCard>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-in" delay={400}>
          <div className="text-center mt-12">
            <p className="text-muted-foreground">{t("faq.stillQuestions")} <a href="mailto:support@blacklabspotsshop.com" className="text-primary hover:underline">{t("faq.contactUs")}</a></p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQ;
