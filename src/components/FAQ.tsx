import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedSection from "@/components/AnimatedSection";

const FAQ = () => {
  const faqs = [
    {
      question: "What sizes do you offer?",
      answer:
        "Standard adult and kids sizes. Fit true-to-size; size charts included on product pages.",
    },
    {
      question: "Materials & care?",
      answer:
        "Soft cotton blends, pre-shrunk. Wash cold, tumble dry low.",
    },
    {
      question: "Shipping & returns?",
      answer:
        "Worldwide shipping with tracking. 30-day return policy for unused items.",
    },
    {
      question: "How is the embroidery quality?",
      answer:
        "We use high-density stitching for crisp details that last. Each design is tested for durability through multiple washes.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-background overflow-hidden">
      <div className="section-container max-w-3xl">
        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Common <span className="text-gradient">Questions</span>
            </h2>
          </div>
        </AnimatedSection>

        {/* Accordion */}
        <AnimatedSection animation="fade-in" delay={200}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:glow-border"
              >
                <AccordionTrigger className="text-left text-foreground font-semibold hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQ;
