import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import OptimizedImage from "@/components/OptimizedImage";
import { useContactInfo, useProductCategories, useSectors } from "@/hooks/useCMS";
import { useLanguage } from "@/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: contactInfo } = useContactInfo();
  const { t, getLocalizedPath, direction, currentLanguage } = useLanguage();
  const { data: dbCategories } = useProductCategories(true, currentLanguage);

  // Get phone and whatsapp from contact info
  const phone = contactInfo?.find((c) => c.key === "phone")?.value || "+44 20 7101 3847";
  const whatsapp = contactInfo?.find((c) => c.key === "whatsapp")?.value || "+44 7700 900123";
  const salesEmail = "sales@biogreenwax.com";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: dbSectors } = useSectors(true, currentLanguage);

  const productCategories = useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) {
      return [
        { name: "Edible Oils", href: "/products?category=edible-oils", description: "Sunflower, Palm, Coconut & more" },
        { name: "Plant-Based Waxes", href: "/products?category=plant-waxes", description: "Soy, Sunflower, Palm Stearin" },
        { name: "Industrial Waxes", href: "/products?category=industrial-waxes", description: "Paraffin, Microcrystalline, PE Wax" },
        { name: "Wax Blends", href: "/products?category=wax-blends", description: "Custom formulated wax blends" },
      ];
    }
    return dbCategories.map((cat) => ({
      name: cat.name,
      href: `/products?category=${cat.slug}`,
      description: cat.description || "",
    }));
  }, [dbCategories]);

  const sectorLinks = useMemo(() => {
    if (!dbSectors || dbSectors.length === 0) {
      return [
        { name: "Candle Making", href: "/sectors/candle-making" },
        { name: "Cosmetics & Personal Care", href: "/sectors/cosmetics" },
        { name: "Food Industry", href: "/sectors/food" },
        { name: "Packaging & Coatings", href: "/sectors/packaging" },
        { name: "Textiles & Leather", href: "/sectors/textiles" },
        { name: "Rubber & Plastics", href: "/sectors/rubber-plastics" },
      ];
    }
    return dbSectors
      .map((s) => ({
        name: s.name,
        href: `/sectors/${s.slug}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dbSectors]);

  const navLinks = [
    { name: t("nav.home", "Home"), href: "/" },
    { name: t("nav.about", "About Us"), href: "/about" },
    { name: t("nav.news", "News"), href: "/news" },
    { name: t("nav.certifications", "Certifications"), href: "/certifications" },
    { name: t("nav.careers", "Careers"), href: "/careers" },
    { name: t("nav.contact", "Contact"), href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#F5F0E8]/95 backdrop-blur-md shadow-md"
          : "bg-[#F5F0E8]"
      )}
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-[#1B5E20] text-white">
        <div className="container-wide py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span>{t("topBanner.text", "Premium Quality Oils & Waxes — Trusted by Industries Worldwide")}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`mailto:${salesEmail}`} className="flex items-center gap-2 hover:text-gray-200 transition-colors">
              <Mail className="h-4 w-4" />
              <span>{salesEmail}</span>
            </a>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gray-200 transition-colors">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </a>
            <a href={`https://wa.me/${whatsapp.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>{whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={cn(
        "container-wide py-4 transition-all duration-300",
        isScrolled && "py-2"
      )}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={getLocalizedPath("/")} className="flex items-center gap-3">
            <OptimizedImage
              src={logo}
              alt="Bio Green Wax Ltd"
              className={cn(
                "transition-all duration-300",
                isScrolled ? "h-12" : "h-16"
              )}
              priority={true}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to={getLocalizedPath("/")}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors text-foreground/80 hover:text-primary",
                        location.pathname === "/" && "text-primary"
                      )}
                    >
                      {t("nav.home")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to={getLocalizedPath("/about")}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors text-foreground/80 hover:text-primary",
                        location.pathname === "/about" && "text-primary"
                      )}
                    >
                      {t("nav.about")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Products Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-foreground/80 hover:text-primary bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary">
                    {t("nav.products")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {productCategories.map((category) => (
                        <li key={category.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={getLocalizedPath(category.href)}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.name}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {category.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="md:col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            to={getLocalizedPath("/products")}
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-medium text-center"
                          >
                            {t("products.viewAll")} →
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Sectors Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-foreground/80 hover:text-primary bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary">
                    {t("nav.sectors")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4">
                      {sectorLinks.map((sector) => (
                        <li key={sector.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={getLocalizedPath(sector.href)}
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm font-medium"
                            >
                              {sector.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to={getLocalizedPath("/news")}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors text-foreground/80 hover:text-primary",
                        location.pathname === "/news" && "text-primary"
                      )}
                    >
                      {t("nav.news")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to={getLocalizedPath("/certifications")}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors text-foreground/80 hover:text-primary",
                        location.pathname === "/certifications" && "text-primary"
                      )}
                    >
                      {t("nav.certifications")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to={getLocalizedPath("/careers")}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors text-foreground/80 hover:text-primary",
                        location.pathname === "/careers" && "text-primary"
                      )}
                    >
                      {t("nav.careers")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to={getLocalizedPath("/contact")}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors text-foreground/80 hover:text-primary",
                        location.pathname === "/contact" && "text-primary"
                      )}
                    >
                      {t("nav.contact")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <LanguageSwitcher />
            
            <Button asChild className="ml-4 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={getLocalizedPath("/contact?type=callback")}>{t("nav.enquire")}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-t shadow-lg animate-slide-down">
            <div className="container-wide py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={getLocalizedPath(link.href)}
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{t("nav.products")}</p>
                {productCategories.map((category) => (
                  <Link
                    key={category.name}
                    to={getLocalizedPath(category.href)}
                    className="block py-2 pl-4 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{t("nav.sectors")}</p>
                {sectorLinks.map((sector) => (
                  <Link
                    key={sector.name}
                    to={getLocalizedPath(sector.href)}
                    className="block py-2 pl-4 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {sector.name}
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-center">
                <LanguageSwitcher />
              </div>
              
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to={getLocalizedPath("/contact?type=callback")} onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.enquire")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
