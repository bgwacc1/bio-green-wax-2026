import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = () => {
  const { t, getLocalizedPath } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary via-primary to-green-dark text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 sm:mb-4 md:mb-6">
            {t("home.cta.title")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-foreground/90 mb-5 sm:mb-6 md:mb-8">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-xs sm:text-sm md:text-base md:px-6 md:py-3"
            >
              <Link to={getLocalizedPath("/contact?type=callback")}>
                <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t("home.cta.requestCallback")}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-white text-primary hover:bg-white/90 font-semibold text-xs sm:text-sm md:text-base md:px-6 md:py-3 border-0"
            >
              <Link to={getLocalizedPath("/contact?type=quote")}>
                {t("home.cta.requestQuote")}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
