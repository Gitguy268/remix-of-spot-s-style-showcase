import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Celebs from "@/components/Celebs";
import Products from "@/components/Products";
import Spot3DViewer from "@/components/Spot3DViewer";
import VideoSection from "@/components/VideoSection";
import PhotoStories from "@/components/PhotoStories";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingShopButton from "@/components/FloatingShopButton";
import SpotTeeGenerator from "@/components/SpotTeeGenerator";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://blacklabspotsshop.com/#organization",
      "name": "Blacklabspotsshop",
      "url": "https://blacklabspotsshop.com",
      "logo": "https://blacklabspotsshop.com/favicon.ico",
      "description": "Premium apparel featuring Spot, the black Labrador. Soft fabrics, playful designs, worldwide shipping.",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@blacklabspotsshop.com",
        "contactType": "customer service"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://blacklabspotsshop.com/#website",
      "url": "https://blacklabspotsshop.com",
      "name": "Blacklabspotsshop",
      "publisher": { "@id": "https://blacklabspotsshop.com/#organization" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://blacklabspotsshop.com/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@id": "https://blacklabspotsshop.com",
            "name": "Home"
          }
        }
      ]
    },
    {
      "@type": "Product",
      "name": "Spot Tee",
      "image": "https://blacklabspotsshop.com/spot-tee-product.png",
      "description": "Premium 100% ring-spun cotton t-shirt featuring Spot the black Labrador. Relaxed unisex fit.",
      "brand": {
        "@type": "Brand",
        "name": "Blacklabspotsshop"
      },
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "41.47",
        "highPrice": "45.99",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@id": "https://blacklabspotsshop.com/#organization" }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "200"
      }
    },
    {
      "@type": "Product",
      "name": "Minimal Spot Hoodie",
      "image": "https://blacklabspotsshop.com/spot-hoodie.png",
      "description": "Premium 80% cotton / 20% polyester hoodie with embroidered Spot logo. Regular fit with kangaroo pocket.",
      "brand": {
        "@type": "Brand",
        "name": "Blacklabspotsshop"
      },
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "40.60",
        "highPrice": "52.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@id": "https://blacklabspotsshop.com/#organization" }
      }
    }
  ]
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Blacklabspotsshop — Spot-inspired T-Shirts & Hoodies | Premium Dog Apparel</title>
        <meta
          name="description"
          content="Shop premium t-shirts, hoodies, and accessories featuring Spot, the black Labrador. 100% cotton, 5-7 day delivery, 30-day returns. Rated 4.9/5 by 200+ customers."
        />
        <meta name="keywords" content="black labrador t-shirt, dog apparel, Spot tee, premium cotton hoodie, pet lover gifts, labrador merchandise" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blacklabspotsshop — Spot-inspired T-Shirts & Hoodies" />
        <meta property="og:description" content="Premium apparel featuring Spot, the beloved black Labrador. 100% cotton, 5-7 day delivery, 30-day returns." />
        <meta property="og:image" content="https://blacklabspotsshop.com/og-image.png" />
        <meta property="og:url" content="https://blacklabspotsshop.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blacklabspotsshop — Spot-inspired T-Shirts & Hoodies" />
        <meta name="twitter:description" content="Premium apparel featuring Spot, the beloved black Labrador." />
        <meta name="theme-color" content="#2cbbc3" />
        <link rel="canonical" href="https://blacklabspotsshop.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <ScrollProgress />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Celebs />
          <Products />
          <SpotTeeGenerator />
          <Spot3DViewer />
          <VideoSection />
          <PhotoStories />
          <Reviews />
          <FAQ />
          <Newsletter />
        </main>
        <Footer />
        <BackToTop />
        <FloatingShopButton />
      </div>
    </>
  );
};

export default Index;