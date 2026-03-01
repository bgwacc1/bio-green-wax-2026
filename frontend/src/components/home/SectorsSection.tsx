import { Link } from "react-router-dom";
import { Flame, Sparkles, UtensilsCrossed, Package, Shirt, Cog, Factory, Droplet, Leaf, Zap, Building2, Truck, Beaker, Pill, Heart, Sun, Moon, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectors } from "@/hooks/useCMS";
import { useLanguage } from "@/i18n/LanguageContext";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame, Sparkles, UtensilsCrossed, Package, Shirt, Cog,
  Factory, Droplet, Leaf, Zap, Building2, Truck,
  Beaker, Pill, Heart, Sun, Moon, Star
};

const SectorsSection = () => {
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  const { data: dbSectors, isLoading } = useSectors(true, currentLanguage);

  const sectors = dbSectors?.map(s => ({
    icon: s.icon,
    name: s.name,
    description: s.description || "",
    slug: s.slug,
    color: s.color,
  })) || [];

  if (!isLoading && sectors.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {t("home.sectors.title")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 rounded-lg border bg-white animate-pulse">
                <div className="w-14 h-14 rounded-lg bg-muted mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 md:mb-4">
            {t("home.sectors.title")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t("home.sectors.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {sectors.map((sector) => {
            const IconComponent = iconMap[sector.icon] || Cog;
            return (
              <Link
                key={sector.slug}
                to={getLocalizedPath(`/sectors/${sector.slug}`)}
                className="group block p-3 sm:p-4 md:p-6 rounded-lg border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-2 sm:mb-3 md:mb-4",
                    sector.color
                  )}
                >
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-heading font-semibold mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                  {sector.name}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
                  {sector.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SectorsSection;
