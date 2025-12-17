import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — Blacklabspotsshop</title>
        <meta name="description" content="Privacy Policy for Blacklabspotsshop. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-24">
          <div className="section-container max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 17, 2024</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, subscribe to our newsletter, or contact us for support.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Name and contact information (email, shipping address)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with us</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Respond to your questions and requests</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our products and services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground">
                  We do not sell your personal information. We share your information only with 
                  service providers who help us operate our business (e.g., Printify for order 
                  fulfillment, Stripe for payments) and as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your 
                  personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your experience, analyze site 
                  traffic, and for marketing purposes. You can manage cookie preferences through 
                  your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
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

export default Privacy;