import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Celebs from "@/components/Celebs";
import Products from "@/components/Products";
import VideoSection from "@/components/VideoSection";
import PhotoStories from "@/components/PhotoStories";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Blacklabspotsshop — Spot-inspired T-Shirts & Hoodies</title>
        <meta
          name="description"
          content="Playful, premium gear inspired by Spot, the black Labrador. Explore T-shirts, hoodies, and accessories with unique Labrador designs."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blacklabspotsshop — Spot-inspired T-Shirts & Hoodies" />
        <meta
          property="og:description"
          content="Playful, premium gear inspired by Spot, the black Labrador. See celebs wearing Spot and explore 3D models, videos, and more."
        />
        <meta name="theme-color" content="#2cbbc3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Celebs />
          <Products />
          <VideoSection />
          <PhotoStories />
          <Reviews />
          <FAQ />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
