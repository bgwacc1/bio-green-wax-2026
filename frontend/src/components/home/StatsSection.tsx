import { Globe, Users, Award, Leaf } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Globe,
      valueKey: "home.stats.uk.value",
      labelKey: "home.stats.uk.label",
      descKey: "home.stats.uk.desc",
    },
    {
      icon: Users,
      valueKey: "home.stats.clients.value",
      labelKey: "home.stats.clients.label",
      descKey: "home.stats.clients.desc",
    },
    {
      icon: Award,
      valueKey: "home.stats.established.value",
      labelKey: "home.stats.established.label",
      descKey: "home.stats.established.desc",
    },
    {
      icon: Leaf,
      valueKey: "home.stats.quality.value",
      labelKey: "home.stats.quality.label",
      descKey: "home.stats.quality.desc",
    },
  ];

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="container-wide">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-2 md:mb-4">
            {t("home.stats.title")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto px-2">
            {t("home.stats.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.labelKey}
              className="text-center p-3 sm:p-4 md:p-6 rounded-lg bg-primary-foreground/5 backdrop-blur-sm"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-accent/20 text-accent mb-2 sm:mb-3 md:mb-4">
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-accent mb-1 md:mb-2">
                {t(stat.valueKey)}
              </div>
              <div className="text-xs sm:text-sm md:text-lg font-semibold mb-0.5 md:mb-1">{t(stat.labelKey)}</div>
              <div className="text-xs sm:text-sm text-primary-foreground/70 line-clamp-2">
                {t(stat.descKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
