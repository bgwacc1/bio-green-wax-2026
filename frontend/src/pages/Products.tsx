import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts, useProductCategories, useSEOPageMeta } from "@/hooks/useCMS";
import { SEO, BreadcrumbSchema } from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";

const Products = () => {
  const { data: seoMeta } = useSEOPageMeta("/products");
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "all";
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, getLocalizedPath, currentLanguage } = useLanguage();

  const { data: products, isLoading: productsLoading } = useProducts(true, currentLanguage);
  const { data: dbCategories, isLoading: categoriesLoading } = useProductCategories(true, currentLanguage);

  const getCategoryLabel = (categorySlug: string, fallbackLabel?: string): string => {
    const cat = dbCategories?.find(c => c.slug === categorySlug);
    return cat?.name || fallbackLabel || categorySlug;
  };

  const categories = useMemo(() => {
    const cats = [{ id: "all", label: t("products.categories.all") }];
    if (dbCategories) {
      dbCategories.forEach((cat) => {
        cats.push({ id: cat.slug, label: cat.name });
      });
    }
    return cats;
  }, [dbCategories, t]);

  // Sync state with URL when URL changes (e.g., from navigation dropdown)
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // Filter products - check if product belongs to any selected category (using categories array)
  // Also ensure no duplicates when showing all products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products;
    
    if (selectedCategory !== "all") {
      result = products.filter((p) => 
        p.categories?.includes(selectedCategory) || p.category === selectedCategory
      );
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          (p.applications as string[])?.some((a) => a.toLowerCase().includes(lowerQuery))
      );
    }
    
    return result;
  }, [products, selectedCategory, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };

  if (productsLoading || categoriesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={seoMeta?.title || "Our Products - Edible Oils & Industrial Waxes"}
        description={seoMeta?.description || "Explore Bio Green Wax's comprehensive range of premium edible oils, plant-based waxes, and industrial petrochemical waxes. Sunflower oil, palm oil, coconut oil, paraffin wax and more."}
        keywords={seoMeta?.keywords || "edible oils, sunflower oil, palm oil, coconut oil, rapeseed oil, olive oil, paraffin wax, microcrystalline wax, beeswax, industrial wax, UK wholesale"}
        url="/products"
        noindex={seoMeta?.no_index}
      />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Products', url: '/products' }]} />
      {/* Hero Banner - Compact */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="container-wide">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            {t("products.page.title")}
          </h1>
          <p className="text-base text-primary-foreground/90 max-w-2xl">
            {t("products.page.subtitle")}
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-muted border-b">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    selectedCategory === category.id && "bg-primary text-primary-foreground"
                  )}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("products.page.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-muted-foreground">
              {t("products.page.showing")} <span className="font-semibold text-foreground">{filteredProducts.length}</span> {t("products.page.productsCount")}
              {selectedCategory !== "all" && (
                <span> {t("products.page.in")} <span className="font-semibold text-foreground">{categories.find(c => c.id === selectedCategory)?.label}</span></span>
              )}
              {searchQuery && (
                <span> {t("products.page.matching")} "<span className="font-semibold text-foreground">{searchQuery}</span>"</span>
              )}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                return (
                  <Card key={product.id} className="group card-hover overflow-hidden border-0 shadow-md bg-white">
                    <div className="aspect-video overflow-hidden bg-muted">
                      <OptimizedImage
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {getCategoryLabel(product.category, product.category_label)}
                      </Badge>
                      <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(product.applications as string[])?.slice(0, 2).map((app) => (
                          <span
                            key={app}
                            className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                          >
                            {app}
                          </span>
                        ))}
                        {(product.applications as string[])?.length > 2 && (
                          <span className="text-xs px-2 py-1 text-muted-foreground">
                            +{(product.applications as string[]).length - 2} more
                          </span>
                        )}
                      </div>
                      <Link
                        to={getLocalizedPath(`/products/${product.slug}`)}
                        className="inline-flex items-center text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                      >
                        {t("home.services.learnMore")}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("products.page.noProducts")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("products.page.noProductsDesc")}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  handleCategoryChange("all");
                }}
              >
                {t("products.page.clearFilters")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            {t("products.page.cantFind")}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t("products.page.cantFindDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary">
              <Link to={getLocalizedPath("/contact?type=quote")}>{t("products.page.requestQuote")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={getLocalizedPath("/contact")}>{t("nav.contact")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
