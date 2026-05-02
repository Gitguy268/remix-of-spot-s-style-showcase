import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import AnimatedSection from "@/components/AnimatedSection";
import ProductQuickView from "@/components/ProductQuickView";

import ProductComparison from "@/components/ProductComparison";
import MobileProductCarousel from "@/components/MobileProductCarousel";
import BirthdayCountdown from "@/components/BirthdayCountdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, Ruler } from "lucide-react";

const SHOP_URL = "https://blacklabspotsshop.printify.me/";

// Live Printify mockup images (kept at s=1024 for crisp grid thumbnails)
const IMG_SPOT_TEE = "https://images-api.printify.com/mockup/69352550a5ea87e0730ef6e1/73207/98445/spot-tee.jpg?camera_label=front&revision=1765091259729&s=1024";
const IMG_SPOT_HOODIE = "https://images-api.printify.com/mockup/6931d763af55177fda0d5f67/68053/99231/minimal-black-labrador-embroidered-hoodie.jpg?camera_label=front&revision=1764882839842&s=1024";
const IMG_SPOT_POLO = "https://images-api.printify.com/mockup/697f2f66bb695bec2a04e52c/118322/109526/spot-polo.jpg?camera_label=front&revision=1769943300786&s=1024";
const IMG_DAD_HAT = "https://images-api.printify.com/mockup/6931da472abb939a920d71ef/118240/109493/dad-hat-embroidered-black-lab-dog-portrait.jpg?camera_label=front&revision=1764874903251&s=1024";
const IMG_NECKLACE = "https://images-api.printify.com/mockup/6931d16d2abb939a920d6ef1/147718/111754/personalised-spot-necklace.jpg?camera_label=front&revision=1765092991375&s=1024";
const IMG_KIDS_TEE = "https://images-api.printify.com/mockup/6931d4448238115b130e6a7a/42727/105377/spot-funny-kids-t-shirt.jpg?camera_label=front&revision=1765091511573&s=1024";
const IMG_WARM_SPOT = "https://images-api.printify.com/mockup/69352a18282b17ae9609258e/94945/101396/warm-spot.jpg?camera_label=front&revision=1765111794521&s=1024";
const IMG_PILLOW = "https://images-api.printify.com/mockup/697f3cbabb695bec2a04e7a2/104323/101194/spot-pillow.jpg?camera_label=front&revision=1769946477041&s=1024";

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
  const { t } = useTranslation();
  const categoryKeys = [
    { key: "All", label: t("products.catAll") },
    { key: "T-Shirts", label: t("products.catTShirts") },
    { key: "Hoodies", label: t("products.catHoodies") },
    { key: "Accessories", label: t("products.catAccessories") },
    { key: "Kids", label: t("products.catKids") },
    { key: "Home", label: "Home" },
  ];
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [compareProducts, setCompareProducts] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const products: Product[] = [
    {
      name: "Spot TEE",
      price: "$41.47",
      image: IMG_SPOT_TEE,
      badge: "Bestseller",
      category: "T-Shirts",
      fabric: "100% ring-spun cotton, 180 GSM",
      fit: "Relaxed unisex fit",
      colors: ["Black", "White", "Navy", "Red"],
      delivery: "Ships in 5-7 days",
      sizes: "XS – 3XL",
      shopUrl: "https://blacklabspotsshop.printify.me/product/25456436/spot-tee",
    },
    {
      name: "Minimal Black Labrador Embroidered Hoodie",
      price: "$40.60",
      image: IMG_SPOT_HOODIE,
      badge: "New",
      category: "Hoodies",
      fabric: "80% cotton / 20% polyester, 320 GSM",
      fit: "Regular fit with kangaroo pocket",
      colors: ["Black", "Charcoal", "Forest Green", "Royal Blue"],
      delivery: "Ships in 5-7 days",
      sizes: "S – 2XL",
      shopUrl: "https://blacklabspotsshop.printify.me/product/25392440/minimal-black-labrador-embroidered-hoodie",
    },
    {
      name: "Spot Polo",
      price: "$37.90",
      image: IMG_SPOT_POLO,
      category: "T-Shirts",
      fabric: "Performance pique, breathable knit",
      fit: "Modern slim cut",
      colors: ["Black", "White", "Navy"],
      delivery: "Ships in 5-7 days",
      sizes: "S – 2XL",
      shopUrl: "https://blacklabspotsshop.printify.me/product/26576768/spot-polo",
    },
    {
      name: "Dad Hat — Embroidered Black Lab Portrait",
      price: "$36.43",
      image: IMG_DAD_HAT,
      category: "Accessories",
      fabric: "Cotton twill, embroidered logo",
      fit: "Adjustable strap, one size fits most",
      colors: ["Black", "Khaki", "Navy", "Charcoal"],
      delivery: "Ships in 5-7 days",
      sizes: "One Size",
      shopUrl: "https://blacklabspotsshop.printify.me/product/25392718/dad-hat-embroidered-black-lab-dog-portrait",
    },
    {
      name: "Personalised Spot Necklace",
      price: "$28.37",
      image: IMG_NECKLACE,
      badge: "Personalize",
      category: "Accessories",
      fabric: "Gold-plated stainless steel",
      fit: "18-inch chain with 2-inch extender",
      colors: ["Gold", "Silver", "Rose Gold"],
      delivery: "Ships in 5-7 days",
      sizes: "One Size",
      shopUrl: "https://blacklabspotsshop.printify.me/product/25391915/personalised-spot-necklace",
    },
    {
      name: "Spot Funny Kids T-Shirt",
      price: "$14.98",
      image: IMG_KIDS_TEE,
      category: "Kids",
      fabric: "100% organic cotton, 160 GSM",
      fit: "Kids regular fit",
      colors: ["White", "Light Blue", "Pink"],
      delivery: "Ships in 5-7 days",
      sizes: "2T – 12Y",
      shopUrl: "https://blacklabspotsshop.printify.me/product/25392168/spot-funny-kids-t-shirt",
    },
    {
      name: "Warm Spot Sweater",
      price: "$29.24",
      image: IMG_WARM_SPOT,
      category: "Hoodies",
      fabric: "Heavyweight cotton blend, brushed inside",
      fit: "Cozy oversized fit",
      colors: ["Cream", "Charcoal", "Olive"],
      delivery: "Ships in 5-7 days",
      sizes: "S – 2XL",
      shopUrl: "https://blacklabspotsshop.printify.me/product/25456666/warm-spot",
    },
    {
      name: "Spot Pillow",
      price: "$16.10",
      image: IMG_PILLOW,
      category: "Home",
      fabric: "Spun polyester cover with hidden zipper",
      fit: "18 × 18 inch with insert",
      colors: ["White / Black Print"],
      delivery: "Ships in 5-7 days",
      sizes: "One Size",
      shopUrl: "https://blacklabspotsshop.printify.me/product/26577129/spot-pillow",
    },
  ];

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  const handleQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  }, []);

  const handleToggleCompare = useCallback((productName: string) => {
    setCompareProducts((prev) => {
      if (prev.includes(productName)) {
        return prev.filter((name) => name !== productName);
      }
      if (prev.length >= 3) return prev;
      return [...prev, productName];
    });
  }, []);

  const filteredProducts = useMemo(() =>
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory),
    [activeCategory, products]
  );

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
              <span className="text-gradient">Spot</span> {t("products.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("products.subtitle")}
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
              <span>{t("products.sizeChart")}</span>
              <span className="text-muted-foreground">{t("products.sizeChartNote")}</span>
            </a>
          </div>
        </AnimatedSection>

        {/* Category Tabs */}
        <AnimatedSection animation="fade-in" delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Product categories">
            {categoryKeys.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                role="tab"
                aria-selected={activeCategory === key}
                aria-controls="products-grid"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  activeCategory === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {label}
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
                  delay={index * 40}
                >
                  {renderProductCard(product, index)}
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fade-in" delay={80}>
          <div className="text-center">
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="glass-outline" size="xl">
                <span>{t("products.viewAll")}</span>
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
