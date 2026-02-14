import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import AnimatedSection from "@/components/AnimatedSection";
import ProductQuickView from "@/components/ProductQuickView";
import ParticleBackground from "@/components/ParticleBackground";
import ProductComparison from "@/components/ProductComparison";
import MobileProductCarousel from "@/components/MobileProductCarousel";
import BirthdayCountdown from "@/components/BirthdayCountdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, Ruler } from "lucide-react";
import spotTeeProduct from "@/assets/spot-tee-product.png";
import spotHoodie from "@/assets/spot-hoodie.png";
import spotCap from "@/assets/spot-cap.png";
import spotNecklace from "@/assets/spot-necklace.png";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

interface Product {
  name: string;
  price: string;
  image: string;
  badge?: string;
  category: string;
  fabric: string;
  fit: string;
  colors: string[];
  delivery: string;
  sizes: string;
  shopUrl: string;
}

const Products = () => {
  const categories = ["All", "T-Shirts", "Hoodies", "Accessories", "Kids"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [compareProducts, setCompareProducts] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const products: Product[] = [
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
      shopUrl: "https://blacklabspotsshop.printify.me/product/4797138/spot-tee",
    },
    {
      name: "Minimal Spot Hoodie",
      price: "$40.60 – $52.00",
      image: spotHoodie,
      badge: "Bestseller",
      category: "Hoodies",
      fabric: "80% cotton / 20% polyester, 320 GSM",
      fit: "Regular fit with kangaroo pocket",
      colors: ["Black", "Charcoal", "Forest Green", "Royal Blue"],
      delivery: "Ships in 5-7 days",
      sizes: "S – 2XL",
      shopUrl: "https://blacklabspotsshop.printify.me/product/4797139/minimal-spot-hoodie",
    },
    {
      name: "Spot Dad Hat",
      price: "$36.43 – $39.00",
      image: spotCap,
      category: "Accessories",
      fabric: "Cotton twill, embroidered logo",
      fit: "Adjustable strap, one size fits most",
      colors: ["Black", "Khaki", "Navy", "Charcoal"],
      delivery: "Ships in 5-7 days",
      sizes: "One Size",
      shopUrl: "https://blacklabspotsshop.printify.me/product/4797140/spot-dad-hat",
    },
    {
      name: "Spot Heart Necklace",
      price: "$24.99 – $32.00",
      image: spotNecklace,
      badge: "New",
      category: "Accessories",
      fabric: "Gold-plated stainless steel",
      fit: "18-inch chain with 2-inch extender",
      colors: ["Gold", "Silver", "Rose Gold"],
      delivery: "Ships in 5-7 days",
      sizes: "One Size",
      shopUrl: "https://blacklabspotsshop.printify.me/product/4797141/spot-heart-necklace",
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
      shopUrl: "https://blacklabspotsshop.printify.me/product/4797142/kids-spot-tee",
    },
    {
      name: "Classic Spot Hoodie",
      price: "$45.00 – $55.00",
      image: spotHoodie,
      category: "Hoodies",
      fabric: "80% cotton / 20% polyester, 320 GSM",
      fit: "Oversized fit with drawstring hood",
      colors: ["Black", "Grey Heather", "Royal Blue"],
      delivery: "Ships in 5-7 days",
      sizes: "S – 3XL",
      shopUrl: "https://blacklabspotsshop.printify.me/product/4797143/classic-spot-hoodie",
    },
    {
      name: "Spot Snapback",
      price: "$32.00 – $36.00",
      image: spotCap,
      category: "Accessories",
      fabric: "Acrylic wool blend",
      fit: "Flat brim, adjustable snap closure",
      colors: ["Black", "Navy", "Charcoal"],
      delivery: "Ships in 5-7 days",
      sizes: "One Size",
      shopUrl: "https://blacklabspotsshop.printify.me/product/4797144/spot-snapback",
    },
  ];

  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setActiveCategory(category);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleToggleCompare = (productName: string) => {
    setCompareProducts((prev) => {
      if (prev.includes(productName)) {
        return prev.filter((name) => name !== productName);
      }
      if (prev.length >= 3) return prev;
      return [...prev, productName];
    });
  };

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const renderProductCard = (product: Product, index: number) => (
    <ProductCard
      key={product.name + index}
      {...product}
      onQuickView={() => handleQuickView(product)}
      isCompareSelected={compareProducts.includes(product.name)}
      onToggleCompare={() => handleToggleCompare(product.name)}
      compareDisabled={compareProducts.length >= 3}
    />
  );

  return (
    <section id="products" className="py-24 overflow-hidden relative" aria-labelledby="products-heading">
      <ParticleBackground />
      <div className="section-container relative z-10">
        {/* Birthday Countdown */}
        <AnimatedSection animation="fade-up">
          <div className="mb-12">
            <BirthdayCountdown />
          </div>
        </AnimatedSection>

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
                onClick={() => handleCategoryChange(category)}
                role="tab"
                aria-selected={activeCategory === category}
                aria-controls="products-grid"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Product Grid - Mobile Carousel / Desktop Grid */}
        <div id="products-grid" role="tabpanel">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : isMobile ? (
            <MobileProductCarousel className="mb-12">
              {filteredProducts.map((product, index) => (
                <div key={product.name + index} className="min-w-[280px] snap-center">
                  {renderProductCard(product, index)}
                </div>
              ))}
            </MobileProductCarousel>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.map((product, index) => (
                <AnimatedSection
                  key={product.name + index}
                  animation="fade-up"
                  delay={index * 100}
                >
                  {renderProductCard(product, index)}
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fade-in" delay={400}>
          <div className="text-center">
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="glass-outline" size="xl">
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView 
          open={quickViewOpen} 
          onClose={() => setQuickViewOpen(false)} 
          product={selectedProduct} 
        />
      )}

      {/* Product Comparison */}
      <ProductComparison
        products={products}
        selectedProducts={compareProducts}
        onToggleProduct={handleToggleCompare}
        onClearComparison={() => setCompareProducts([])}
      />
    </section>
  );
};

export default Products;
