import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Package } from "lucide-react";
import { useFeaturedProducts, useProductCategories, Product, ProductCategory } from "@/hooks/useCMS";
import { useLanguage } from "@/i18n/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";

interface ProductsSectionProps {
  preloadedProducts?: Product[];
  preloadedCategories?: ProductCategory[];
}

const ProductsSection = ({ preloadedProducts, preloadedCategories }: ProductsSectionProps) => {
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  const { data: fetchedProducts, isLoading } = useFeaturedProducts(currentLanguage);
  const { data: fetchedCategories } = useProductCategories(true, currentLanguage);
  const featuredProducts = preloadedProducts || fetchedProducts;
  const dbCategories = preloadedCategories || fetchedCategories;

  const getCategoryLabel = (categorySlug: string, fallbackLabel?: string): string => {
    const cat = dbCategories?.find(c => c.slug === categorySlug);
    return cat?.name || fallbackLabel || categorySlug;
  };

  if (!preloadedProducts && isLoading) {
    return (
      <section className="section-padding bg-muted">
        <div className="container-wide">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="section-padding bg-muted">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4 mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-2 md:mb-4">
                {t("home.products.title")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl">
                {t("home.products.subtitle")}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-fit text-xs sm:text-sm">
              <Link to={getLocalizedPath("/products")}>
                {t("home.products.cta")}
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </div>
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t("products.noResults")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-2 md:mb-4">
              {t("home.products.title")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl">
              {t("home.products.subtitle")}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit text-xs sm:text-sm">
            <Link to={getLocalizedPath("/products")}>
              {t("home.products.cta")}
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {featuredProducts.map((product) => {
            return (
              <Card key={product.id} className="card-hover overflow-hidden border-0 shadow-md bg-white">
                <div className="aspect-video overflow-hidden bg-muted">
                  {product.image_url ? (
                    <OptimizedImage
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-2 sm:p-3 md:p-4">
                  <span className="text-[10px] sm:text-xs font-medium text-accent uppercase tracking-wider">
                    {getCategoryLabel(product.category, product.category_label)}
                  </span>
                  <h3 className="text-xs sm:text-sm md:text-base font-heading font-semibold mt-0.5 sm:mt-1 mb-1 sm:mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
                    {product.description}
                  </p>
                  <Link
                    to={getLocalizedPath(`/products/${product.slug}`)}
                    className="inline-flex items-center text-[10px] sm:text-xs md:text-sm text-primary font-medium mt-1.5 sm:mt-2 md:mt-3 hover:text-primary/80 transition-colors"
                  >
                    {t("home.services.learnMore")}
                    <ArrowRight className="ml-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
