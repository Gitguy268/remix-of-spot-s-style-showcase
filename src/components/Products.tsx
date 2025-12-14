import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight } from "lucide-react";
import spotTeeProduct from "@/assets/spot-tee-product.png";
import spotTeeModel from "@/assets/spot-tee-model.png";
import spotCozy from "@/assets/spot-cozy.png";

const Products = () => {
  const categories = ["All", "T-Shirts", "Hoodies", "Accessories", "Kids"];
  const [activeCategory, setActiveCategory] = useState("All");

  const products = [
    {
      name: "Spot TEE",
      price: "from $41.47",
      image: spotTeeProduct,
      badge: "New",
      category: "T-Shirts",
    },
    {
      name: "Minimal Black Labrador Hoodie",
      price: "from $40.60",
      image: spotTeeModel,
      badge: "Bestseller",
      category: "Hoodies",
    },
    {
      name: "Dad Hat Embroidered Lab Portrait",
      price: "from $36.43",
      image: spotCozy,
      category: "Accessories",
    },
    {
      name: "Kids Spot Tee",
      price: "from $28.99",
      image: spotTeeProduct,
      category: "Kids",
    },
    {
      name: "Classic Lab Hoodie",
      price: "from $45.00",
      image: spotTeeModel,
      category: "Hoodies",
    },
    {
      name: "Paw Print Snapback",
      price: "from $32.00",
      image: spotCozy,
      category: "Accessories",
    },
  ];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-background to-card overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Spot</span> Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium apparel featuring Spot, the black Labrador. Soft fabrics, playful designs.
            </p>
          </div>
        </AnimatedSection>

        {/* Category Tabs */}
        <AnimatedSection animation="fade-in" delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
            <Button variant="outline" size="lg">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Products;
