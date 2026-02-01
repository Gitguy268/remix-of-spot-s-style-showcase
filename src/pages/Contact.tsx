import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { z } from "zod";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000)
});

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [honeypot, setHoneypot] = useState(""); // Spam protection
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          ...formData,
          honeypot // Include honeypot for spam check
        }
      });

      if (error) throw error;

      if (data?.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        toast({
          title: "Message sent!",
          description: "We'll get back to you within 24-48 hours.",
        });
      } else {
        throw new Error(data?.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
      toast({
        title: "Failed to send message",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    }
  };
  if (status === "success") {
    return <>
        <Helmet>
          <title>Contact Us — Blacklabspotsshop</title>
          <meta name="description" content="Contact Blacklabspotsshop for questions about orders, products, or collaborations." />
        </Helmet>

        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="py-24">
            <div className="section-container max-w-2xl text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">Message Sent!</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for reaching out. We'll get back to you within 24-48 hours.
              </p>
              <Button variant="glass" onClick={() => setStatus("idle")}>
                Send Another Message
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>;
  }
  return <>
      <Helmet>
        <title>Contact Us — Blacklabspotsshop</title>
        <meta name="description" content="Contact Blacklabspotsshop for questions about orders, products, or collaborations. We typically respond within 24-48 hours." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-24">
          <div className="section-container">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Get in Touch</h1>
              
              {/* Breadcrumb */}
              <Breadcrumb className="justify-center mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Contact</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Have a question about an order or want to collaborate? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="p-6 bg-card rounded-xl border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <a href="mailto:hello@blacklabspotsshop.com" className="text-muted-foreground hover:text-primary transition-colors">hitlijsten_demping_7b@icloud.com</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-muted-foreground">
                          Blacklabspotsshop<br />
                          Online Store — Ships Worldwide
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Response Time</p>
                        <p className="text-muted-foreground">
                          We typically respond within 24-48 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-card rounded-xl border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Common Questions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <a href="/#faq" className="hover:text-primary transition-colors">Where's my order?</a></li>
                    <li>• <a href="/#faq" className="hover:text-primary transition-colors">What's your return policy?</a></li>
                    <li>• <a href="/#faq" className="hover:text-primary transition-colors">How do I find my size?</a></li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} className={errors.name ? "border-destructive" : ""} placeholder="Your name" />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} className={errors.email ? "border-destructive" : ""} placeholder="you@example.com" />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input id="subject" value={formData.subject} onChange={e => setFormData({
                  ...formData,
                  subject: e.target.value
                })} className={errors.subject ? "border-destructive" : ""} placeholder="Order inquiry, collaboration, etc." />
                  {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea id="message" value={formData.message} onChange={e => setFormData({
                  ...formData,
                  message: e.target.value
                })} className={`min-h-[150px] ${errors.message ? "border-destructive" : ""}`} placeholder="How can we help?" />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                </div>

                {/* Honeypot field - hidden from users, catches bots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <Input 
                    type="text" 
                    id="website" 
                    name="website" 
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="glass" 
                  size="xl" 
                  className="w-full"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>;
};
export default Contact;