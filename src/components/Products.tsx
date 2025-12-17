import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Ruler } from "lucide-react";
import spotTeeProduct from "@/assets/spot-tee-product.png";
import spotTeeModel from "@/assets/spot-tee-model.png";
import spotCozy from "@/assets/spot-cozy.png";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

const Products = () => {
  const categories = ["All", "T-Shirts", "Hoodies", "Accessories", "Kids"];
  const [activeCategory, setActiveCategory] = useState("All");

  const products = [
    {
      name: "Spot Tee",
      price: "$41.47 – $45.99",
      image: spotTeeProduct,
      badge: "New",
      category: "T-Shirts",
      fabric: "100% ring-spun cotton, 180 GSM",
      fit: "Relaxed unisex fit",
      colors: ["Black", "White", "Navy", "Red"],
      delivery: "Ships in 5-7 days",
      sizes: "XS – 3XL",
    },
    {
      name: "Minimal Spot Hoodie",
      price: "$40.60 – $52.00",
      image: spotTeeModel,
      badge: "Bestseller",
      category: "Hoodies",
      fabric: "80% cotton / 20% polyester, 320 GSM",
      fit: "Regular fit with kangaroo pocket",
      colors: ["Black", "Charcoal", "Forest Green"],
      delivery: "Ships in 5-7 days",
      sizes: "S – 2XL",
    },
    {
      name: "Spot Dad Hat",
      price: "$36.43 – $39.00",
      image: spotCozy,
      category: "Accessories",
      fabric: "Cotton twill, embroidered logo",
      fit: "Adjustable strap, one size fits most",
      colors: ["Black", "Khaki", "Navy"],
      delivery: "Ships in 5-7 days",
      sizes: "One Size",
    },
    {
      name: "Kids Spot Tee",
      price: "$28.99 – $32.00",
      image: spotTeeProduct,
      category: "Kids",
      fabric: "100% organic cotton, 160 GSM",
      fit: "Kids regular fit",
      colors: ["White", "Light Blue", "Pink"],
      delivery: "Ships in 5-7 days",
      sizes: "2T – 12Y",
    },
    {
      name: "Classic Spot Hoodie",
      price: "$45.00 – $55.00",
      image: spotTeeModel,
      category: "Hoodies",
      fabric: "80% cotton / 20% polyester, 320 GSM",
      fit: "Oversized fit with drawstring hood",
      colors: ["Black", "Grey Heather"],
      delivery: "Ships in 5-7 days",
      sizes: "S – 3XL",
    },
    {
      name: "Spot Snapback",
      price: "$32.00 – $36.00",
      image: spotCozy,
      category: "Accessories",
      fabric: "Acrylic wool blend",
      fit: "Flat brim, adjustable snap closure",
      colors: ["Black", "Navy"],
      delivery: "Ships in 5-7 days",
      sizes: "One Size",
    },
  ];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-background to-card overflow-hidden" aria-labelledby="products-heading">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8">
            <h2 id="products-heading" className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Spot</span> Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium apparel featuring Spot, the black Labrador. Soft fabrics, playful designs, worldwide shipping.
            </p>
          </div>
        </AnimatedSection>

        {/* Size Guide Link */}
        <AnimatedSection animation="fade-in" delay={50}>
          <div className="flex justify-center mb-8">
            <a 
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Ruler className="w-4 h-4" aria-hidden="true" />
              <span>Size Chart & Fit Guide</span>
              <span className="text-muted-foreground">— Model is 5'10", wearing size M</span>
            </a>
          </div>
        </AnimatedSection>

        {/* Category Tabs */}
        <AnimatedSection animation="fade-in" delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                role="tab"
                aria-selected={activeCategory === category}
                aria-controls="products-grid"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/10 text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Product Grid */}
        <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" role="tabpanel">
          {filteredProducts.map((product, index) => (
            <AnimatedSection
              key={product.name + index}
              animation="fade-up"
              delay={index * 100}
            >
              <ProductCard {...product} />
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fade-in" delay={400}>
          <div className="text-center">
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="glass-outline" size="xl">
                View All Products
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Products;
