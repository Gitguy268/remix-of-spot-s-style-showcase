import { Link } from "react-router-dom";
import { Mail, Shield } from "lucide-react";
import { GlassDock, GlassFilter, DockIcon } from "@/components/GlassDock";
import MinecraftModeToggle from "@/components/MinecraftModeToggle";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();

  const links = [
    { label: t("footer.privacyPolicy"), href: "/privacy" },
    { label: t("footer.terms"), href: "/terms" },
    { label: t("footer.contact"), href: "/contact" },
  ];

  const socialIcons: DockIcon[] = [
    { src: "https://cdn-icons-png.flaticon.com/128/3670/3670151.png", alt: "Instagram", href: "https://www.instagram.com/lucasvandeweerd/" },
    { src: "https://cdn-icons-png.flaticon.com/128/1384/1384060.png", alt: "YouTube", href: "https://www.youtube.com/@LucasVanDeWeerd" },
  ];

  return (
    <footer className="py-16 bg-background border-t border-border">
      <GlassFilter />
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="text-2xl font-bold text-gradient">Blacklabspotsshop</span>
            <p className="text-muted-foreground mt-4 mb-4">{t("footer.tagline")}</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:hitlijsten_demping_7b@icloud.com" className="hover:text-primary transition-colors">hitlijsten_demping_7b@icloud.com</a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3">
              <li><a href="https://blacklabspotsshop.printify.me/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.shopAll")}</a></li>
              <li><Link to="/#products" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.featuredCollection")}</Link></li>
              <li><Link to="/#reviews" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.customerReviews")}</Link></li>
              <li><Link to="/#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">{t("footer.policies")}</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}><Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center mb-8"><GlassDock icons={socialIcons} /></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground mr-2">{t("footer.weAccept")}</span>
            {["Visa", "Mastercard", "Amex", "Discover", "Apple Pay", "Google Pay"].map((payment) => (
              <span key={payment} className="text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-md">{payment}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>{t("footer.secureCheckout")}</span>
          </div>
        </div>

        <div className="border-t border-border/50 pt-4"><MinecraftModeToggle /></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Blacklabspotsshop. {t("footer.allRights")}</p>
          <p className="text-xs text-muted-foreground">{t("footer.fulfilledBy")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
