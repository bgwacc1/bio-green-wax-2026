import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import OptimizedImage from "@/components/OptimizedImage";
import { useContactInfo, useProductCategories, useSectors } from "@/hooks/useCMS";
import { useLanguage } from "@/i18n/LanguageContext";

const API_BASE = "/api";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: contactInfo } = useContactInfo();
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  const { data: dbCategories } = useProductCategories(true, currentLanguage);
  const { data: dbSectors } = useSectors(true, currentLanguage);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus("success");
        setNewsletterMsg(data.message || "Subscribed!");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setNewsletterMsg(data.error || "Something went wrong");
      }
    } catch {
      setNewsletterStatus("error");
      setNewsletterMsg("Something went wrong");
    }
    setTimeout(() => setNewsletterStatus("idle"), 4000);
  };

  const getContact = (key: string, fallback: string = "") => {
    return contactInfo?.find((c) => c.key === key)?.value || fallback;
  };

  const phone = getContact("phone", "+44 20 7101 3847");
  const email = getContact("email", "info@biogreenwax.com");
  const salesEmail = getContact("sales_email", "sales@biogreenwax.com");
  const whatsapp = getContact("whatsapp", "+44 20 7101 3847");
  const address = getContact("address", "Bio Green Wax Ltd, 128 City Road, London, United Kingdom, EC1V 2NX");
  const companyRegistration = getContact("company_registration", "15814481");

  const productLinks = [
    ...(dbCategories || []).map((cat) => ({
      name: cat.name,
      href: "/products?category=" + cat.slug,
    })),
    { name: t("products.categories.all", "View All"), href: "/products" },
  ];

  const sectorLinks = (dbSectors || []).slice(0, 4).map((s) => ({
    name: s.name,
    href: "/sectors/" + s.slug,
  }));

  const companyLinks = [
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.news"), href: "/news" },
    { name: t("nav.certifications"), href: "/certifications" },
    { name: t("nav.careers"), href: "/careers" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="container-wide py-5 sm:py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold mb-1">
                {t("footer.newsletter.title")}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-primary-foreground/80">
                {t("footer.newsletter.subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNewsletterSubmit()}
                  placeholder={t("footer.newsletter.placeholder")}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 max-w-xs text-sm"
                  disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                />
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm"
                  onClick={handleNewsletterSubmit}
                  disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                >
                  {newsletterStatus === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : newsletterStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    t("footer.newsletter.button")
                  )}
                </Button>
              </div>
              {newsletterStatus !== "idle" && (
                <p className={`text-xs ${newsletterStatus === "success" ? "text-green-300" : "text-red-300"}`}>
                  {newsletterMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-wide py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-2">
            <Link to={getLocalizedPath("/")} className="inline-block mb-3 md:mb-4">
              <OptimizedImage
                src={logo}
                alt="Bio Green Wax Ltd"
                className="h-10 sm:h-12 md:h-16 brightness-0 invert"
              />
            </Link>
            <p className="text-xs sm:text-sm md:text-base text-primary-foreground/80 mb-4 md:mb-6 max-w-sm">
              {t("footer.companyDescription")}
            </p>
            <div className="space-y-2 sm:space-y-3">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{phone}</span>
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>{whatsapp}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="break-all">{email}</span>
              </a>
              <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-primary-foreground/80">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <span>{address}</span>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/60 mt-1">
                    {t("footer.companyNo")}: {companyRegistration}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">{t("footer.productsTitle")}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={getLocalizedPath(link.href)}
                    className="text-xs sm:text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h4 className="font-heading font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">{t("footer.sectorsTitle")}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {sectorLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={getLocalizedPath(link.href)}
                    className="text-xs sm:text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">{t("footer.companyTitle")}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={getLocalizedPath(link.href)}
                    className="text-xs sm:text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container-wide py-4 sm:py-5 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="text-[10px] sm:text-xs md:text-sm text-primary-foreground/70 text-center md:text-left">
              {t("footer.copyright").replace("{year}", currentYear.toString())}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to={getLocalizedPath("/privacy")}
                className="text-[10px] sm:text-xs md:text-sm text-primary-foreground/70 hover:text-accent transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                to={getLocalizedPath("/terms")}
                className="text-[10px] sm:text-xs md:text-sm text-primary-foreground/70 hover:text-accent transition-colors"
              >
                {t("footer.terms")}
              </Link>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
