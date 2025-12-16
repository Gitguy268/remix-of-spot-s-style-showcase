import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimatedSection from "@/components/AnimatedSection";

const FAQ = () => {
  const faqs = [
    { question: "What sizes do you offer?", answer: "T-shirts: XS to 3XL. Hoodies: S to 3XL. Kids: 2T to 12Y. Hats: One size fits most with adjustable straps. Check our Size Chart – model is 5'10\" wearing size M." },
    { question: "What materials are your products made from?", answer: "T-shirts: 100% ring-spun cotton, 180 GSM. Hoodies: 80% cotton / 20% polyester, 320 GSM with brushed fleece. Kids: 100% GOTS organic cotton, 160 GSM. Embroidery: 12,000+ stitch count with tear-away backing." },
    { question: "How should I care for my Spot apparel?", answer: "Machine wash cold inside-out with like colors. Tumble dry low or hang dry. Do not bleach or iron directly on prints. Our DTG prints are designed to last without cracking or fading." },
    { question: "How long does shipping take?", answer: "Production: 2-4 business days. US/UK: 5-7 days. International: 7-14 days. We ship via USPS, Royal Mail, and DHL. Tracking provided for all orders. Express shipping available at checkout." },
    { question: "What is your return policy?", answer: "30-day return window. Items must be unworn, unwashed, with tags attached. Email support@blacklabspotsshop.com with your order number. Prepaid return labels for US orders. Refunds processed within 5-7 business days." },
    { question: "Is my payment secure?", answer: "Yes. We use Stripe (PCI-DSS Level 1 certified). We accept Visa, Mastercard, Amex, Apple Pay, and Google Pay. Card details are never stored on our servers." },
    { question: "Who is Spot?", answer: "Spot is a real black Labrador who inspired this brand! Every design features his likeness, and a portion of proceeds supports local animal shelters." },
  ];

  return (
    <section id="faq" className="py-24 bg-card overflow-hidden" aria-labelledby="faq-heading">
      <div className="section-container">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about Spot gear.</p>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-in" delay={200}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left hover:no-underline py-4"><span className="font-semibold text-foreground">{faq.question}</span></AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-in" delay={400}>
          <div className="text-center mt-12">
            <p className="text-muted-foreground">Still have questions? <a href="mailto:support@blacklabspotsshop.com" className="text-primary hover:underline">Contact us</a></p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQ;
