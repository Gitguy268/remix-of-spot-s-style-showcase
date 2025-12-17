import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions — Blacklabspotsshop</title>
        <meta name="description" content="Terms and Conditions for Blacklabspotsshop. Read our terms of service, return policy, and user agreement." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-24">
          <div className="section-container max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Terms & Conditions</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 17, 2024</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using Blacklabspotsshop, you agree to be bound by these Terms and 
                  Conditions. If you do not agree, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Products & Pricing</h2>
                <p className="text-muted-foreground mb-4">
                  All products are print-on-demand through our partner Printify. Prices are displayed 
                  in USD and include applicable taxes where required. We reserve the right to modify 
                  prices at any time without notice.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Product colors may vary slightly from images due to monitor settings</li>
                  <li>Sizes follow standard US sizing charts</li>
                  <li>All sales are final unless product is defective</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Orders & Shipping</h2>
                <p className="text-muted-foreground mb-4">
                  Orders are processed within 2-5 business days. Shipping times vary by location:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>USA: 5-7 business days</li>
                  <li>Europe: 7-14 business days</li>
                  <li>Rest of World: 10-21 business days</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Tracking information is provided once your order ships.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Returns & Refunds</h2>
                <p className="text-muted-foreground mb-4">
                  We accept returns within 30 days of delivery for defective or damaged items only. 
                  Due to the custom, print-on-demand nature of our products:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Items must be unworn and in original condition</li>
                  <li>Contact us within 7 days of receiving a defective item</li>
                  <li>Include photos of any defects</li>
                  <li>Refunds processed within 5-10 business days</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All designs, logos, and content on this site are the property of Blacklabspotsshop. 
                  You may not reproduce, distribute, or use our intellectual property without written 
                  permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  Blacklabspotsshop shall not be liable for any indirect, incidental, or consequential 
                  damages arising from your use of our products or services. Our liability is limited 
                  to the purchase price of the product.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Information</h2>
                <p className="text-muted-foreground">For questions about these terms:</p>
                <div className="mt-4 p-4 bg-card rounded-lg border border-border">
                  <p className="text-foreground font-medium">Blacklabspotsshop</p>
                  <p className="text-muted-foreground">Email: hello@blacklabspotsshop.com</p>
                </div>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Terms;