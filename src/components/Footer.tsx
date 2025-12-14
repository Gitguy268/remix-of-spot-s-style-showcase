import { CreditCard } from "lucide-react";

const Footer = () => {
  const links = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const payments = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"];

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-gradient">Blacklabspotsshop</span>
            <p className="text-sm text-muted-foreground mt-2">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2">
              {payments.map((payment) => (
                <span
                  key={payment}
                  className="text-xs text-muted-foreground bg-muted/10 px-2 py-1 rounded"
                >
                  {payment}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Powered by */}
        <div className="text-center mt-8 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Powered by Printify
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
