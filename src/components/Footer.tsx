import { Link } from "react-router-dom";
import { Mail, Shield, Instagram, Twitter } from "lucide-react";
import { GlassDock, GlassFilter, DockIcon } from "@/components/GlassDock";

const Footer = () => {
  const links = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ];

  const socialIcons: DockIcon[] = [
    {
      src: "https://cdn-icons-png.flaticon.com/128/3670/3670151.png",
      alt: "Instagram",
      href: "https://www.instagram.com/lucasvandeweerd/",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/128/1384/1384060.png",
      alt: "YouTube",
      href: "https://www.youtube.com/@LucasVanDeWeerd",
    },
  ];

  return (
    <footer className="py-16 bg-background border-t border-border">
      <GlassFilter />
      <div className="section-container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & Contact */}
          <div>
            <span className="text-2xl font-bold text-gradient">Blacklabspotsshop</span>
            <p className="text-muted-foreground mt-4 mb-4">
              Premium apparel featuring Spot, the beloved black Labrador. 
              Soft fabrics, playful designs, worldwide shipping.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:hitlijsten_demping_7b@icloud.com" className="hover:text-primary transition-colors">
                  hitlijsten_demping_7b@icloud.com
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://blacklabspotsshop.printify.me/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shop All Products
                </a>
              </li>
              <li>
                <Link to="/#products" className="text-muted-foreground hover:text-primary transition-colors">
                  Featured Collection
                </Link>
              </li>
              <li>
                <Link to="/#reviews" className="text-muted-foreground hover:text-primary transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Policies</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links with Glass Effect */}
        <div className="flex justify-center mb-8">
          <GlassDock icons={socialIcons} />
        </div>

        {/* Payment & Security */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-border/50">
          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground mr-2">We accept:</span>
            {["Visa", "Mastercard", "Amex", "Discover", "Apple Pay", "Google Pay"].map((payment) => (
              <span
                key={payment}
                className="text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-md"
              >
                {payment}
              </span>
            ))}
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>Secure checkout powered by Stripe</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blacklabspotsshop. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Fulfilled by Printify • Ships worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;