import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingShopButton from "@/components/FloatingShopButton";
import { isBirthday } from "@/utils/birthdayUtils";

const CombinedBackground = lazy(() => import("@/components/CombinedBackground"));
const Celebs = lazy(() => import("@/components/Celebs"));
const Products = lazy(() => import("@/components/Products"));
const Spot3DViewer = lazy(() => import("@/components/Spot3DViewer"));
const VideoSection = lazy(() => import("@/components/VideoSection"));
const PhotoScanner = lazy(() => import("@/components/PhotoScanner"));
const PhotoStories = lazy(() => import("@/components/PhotoStories"));
const Reviews = lazy(() => import("@/components/Reviews"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const SpotTeeGenerator = lazy(() => import("@/components/SpotTeeGenerator"));
const SpotGameShowcase = lazy(() => import("@/components/SpotGameShowcase"));
const SpotBook = lazy(() => import("@/components/SpotBook"));
const BirthdayCelebration = lazy(() => import("@/components/BirthdayCelebration"));
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
        "email": "hitlijsten_demping_7b@icloud.com",
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
  const showBirthdayCelebration = isBirthday();

  return (
    <>
      {showBirthdayCelebration && (
        <Suspense fallback={null}><BirthdayCelebration /></Suspense>
      )}
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
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <ScrollProgress />
      <Suspense fallback={null}><CombinedBackground /></Suspense>
      <div className="min-h-screen relative" style={{ zIndex: 2 }}>
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <Celebs />
            <Products />
            <SpotTeeGenerator />
            <SpotGameShowcase />
            <Spot3DViewer />
            <VideoSection />
            <PhotoScanner />
            <PhotoStories />
            <SpotBook />
            <Reviews />
            <FAQ />
            <Newsletter />
          </Suspense>
        </main>
        <Footer />
        <BackToTop />
        <FloatingShopButton />
      </div>
    </>
  );
};

export default Index;