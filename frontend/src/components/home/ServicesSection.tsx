import { Link } from "react-router-dom";
import { Factory, Truck, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";

const ServicesSection = () => {
  const { t, getLocalizedPath } = useLanguage();

  const services = [
    {
      icon: Factory,
      titleKey: "home.services.production",
      descKey: "home.services.productionDesc",
      link: "/about#production",
    },
    {
      icon: Truck,
      titleKey: "home.services.distribution",
      descKey: "home.services.distributionDesc",
      link: "/about#distribution",
    },
    {
      icon: TrendingUp,
      titleKey: "home.services.trading",
      descKey: "home.services.tradingDesc",
      link: "/about#trading",
    },
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 md:mb-4">
            {t("home.services.title")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t("home.services.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {services.map((service) => (
            <Card key={service.titleKey} className="card-hover border-0 shadow-md bg-white">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4 md:mb-6">
                  <service.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold mb-2 md:mb-3">
                  {t(service.titleKey)}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 md:mb-4">
                  {t(service.descKey)}
                </p>
                <Link
                  to={getLocalizedPath(service.link)}
                  className="inline-flex items-center text-sm sm:text-base text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  {t("home.services.learnMore")}
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
