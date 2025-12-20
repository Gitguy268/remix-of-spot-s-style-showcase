import { Helmet } from "react-helmet";
import { Heart, Sparkles, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import spotTeeModel from "@/assets/spot-tee-model.png";
import spotCozy from "@/assets/spot-cozy.png";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Love for Labs",
      description: "Every design celebrates the joy and loyalty that black Labradors bring to our lives.",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "We use only the finest fabrics—soft, durable, and designed to last through countless adventures.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Built by dog lovers, for dog lovers. Your support helps us give back to Lab rescue organizations.",
    },
    {
      icon: Globe,
      title: "Worldwide Shipping",
      description: "From our print partners to your doorstep, anywhere in the world. 5-7 day delivery guaranteed.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Spot — Our Story | Blacklabspotsshop</title>
        <meta
          name="description"
          content="Meet Spot, the black Labrador who inspired it all. Learn about our mission to create premium apparel that celebrates the joy of Labs."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-24">
          <div className="section-container">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>About Spot</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Hero */}
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                  Meet <span className="text-gradient">Spot</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  The playful black Labrador who inspired a movement of comfort, quality, and canine celebration.
                </p>
              </div>
            </AnimatedSection>

            {/* Origin Story */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <AnimatedSection animation="slide-left">
                <div className="aspect-square rounded-2xl overflow-hidden glow-border">
                  <img
                    src={spotTeeModel}
                    alt="Spot the black Labrador, the inspiration behind Blacklabspotsshop"
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-right" delay={200}>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">The Spot Story</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    It all started with a rescue. Spot came into our lives as a bundle of energy with the softest ears
                    and the most expressive eyes. Like all Labs, he had this way of making every moment feel special—whether
                    it was a morning walk or an afternoon nap on the couch.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We wanted to capture that feeling. The comfort of a loyal companion. The joy of unconditional love.
                    The playful spirit that makes every day brighter. So we created apparel that embodies everything
                    Spot represents.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Today, Blacklabspotsshop is more than a brand—it's a community of Lab lovers who understand that
                    the best things in life come with wagging tails.
                  </p>
                </div>
              </AnimatedSection>
            </div>

            {/* Mission */}
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-16 p-8 md:p-12 bg-card rounded-2xl border border-border">
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  To create premium, comfortable apparel that celebrates the bond between humans and their beloved Labs,
                  while supporting rescue organizations and spreading joy to dog lovers worldwide.
                </p>
              </div>
            </AnimatedSection>

            {/* Values */}
            <AnimatedSection animation="fade-up" delay={100}>
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">What We Stand For</h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
              {values.map((value, index) => (
                <AnimatedSection key={value.title} animation="fade-up" delay={index * 100}>
                  <div className="p-6 bg-card rounded-xl border border-border h-full">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Behind the Scenes */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <AnimatedSection animation="slide-left" className="order-2 md:order-1">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">Behind the Scenes</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Every piece in our collection is designed with intention. We work with premium print-on-demand
                    partners who share our commitment to quality, using only the softest ring-spun cotton and
                    eco-friendly inks.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our designs are created in-house, inspired by real moments with real Labs. From the playful
                    expressions to the cozy fabric choices—every detail is considered.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We're a small team, but we pour our hearts into every order. When you wear Blacklabspotsshop,
                    you're wearing a piece of our story.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-right" delay={200} className="order-1 md:order-2">
                <div className="aspect-square rounded-2xl overflow-hidden glow-border">
                  <img
                    src={spotCozy}
                    alt="Premium Spot apparel crafted with care and quality materials"
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>
            </div>

            {/* CTA */}
            <AnimatedSection animation="fade-up">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">Join the Pack</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Explore our collection and find your perfect piece. Every purchase supports our mission.
                </p>
                <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="xl">
                    Shop the Collection
                  </Button>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
