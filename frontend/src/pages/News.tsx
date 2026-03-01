import { Layout } from "@/components/layout";
import { useNewsArticles } from "@/hooks/useCMS";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { SEO, BreadcrumbSchema } from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";
import { useSEOPageMeta } from "@/hooks/useCMS";

const News = () => {
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  const { data: seoMeta } = useSEOPageMeta("/news");
  // Pass language to hook - translations are automatically merged by API
  const { data: articles, isLoading } = useNewsArticles(true, currentLanguage);

  return (
    <Layout>
      <SEO
        title={seoMeta?.title || "News & Updates"}
        description={seoMeta?.description || "Stay informed with the latest news, industry insights, and company updates from Bio Green Wax Ltd. Read about edible oils, industrial waxes, and sustainability."}
        keywords={seoMeta?.keywords || "bio green wax news, oil industry news, wax industry updates, UK supplier news, sustainability updates"}
        url="/news"
        noindex={seoMeta?.no_index}
      />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'News', url: '/news' }]} />
      {/* Hero Section - Compact */}
      <section className="gradient-primary text-primary-foreground py-4 md:py-6">
        <div className="container-wide">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-1 md:mb-2">
            {t("news.pageTitle", "News & Updates")}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90 max-w-2xl">
            {t("news.pageSubtitle", "Stay informed with the latest news, industry insights, and company updates from Bio Green Wax Ltd.")}
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-wide">
          {isLoading ? (
            <div className="flex justify-center py-8 md:py-12">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm border card-hover"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    {article.image_url ? (
                      <OptimizedImage
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                        <div className="text-center">
                          <Calendar className="h-8 w-8 md:h-12 md:w-12 text-primary/40 mx-auto mb-1 md:mb-2" />
                          <span className="text-xs md:text-sm text-muted-foreground">{t("news.articlePlaceholder", "News Article")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-6">
                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm text-muted-foreground mb-2 md:mb-3">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      <time dateTime={article.published_at || article.created_at}>
                        {format(
                          new Date(article.published_at || article.created_at),
                          "MMM d, yyyy"
                        )}
                      </time>
                    </div>
                    <h2 className="text-sm sm:text-base md:text-xl font-heading font-semibold mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-muted-foreground mb-2 md:mb-4 line-clamp-2 md:line-clamp-3 text-xs md:text-base">
                        {article.excerpt}
                      </p>
                    )}
                    <Link
                      to={getLocalizedPath(`/news/${article.slug}`)}
                      className="inline-flex items-center gap-1.5 md:gap-2 text-primary font-medium hover:gap-2 md:hover:gap-3 transition-all text-xs md:text-base"
                    >
                      {t("news.readMore", "Read More")}
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 md:py-16">
              <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold mb-2 md:mb-4">
                {t("news.noArticles", "No News Articles Yet")}
              </h2>
              <p className="text-muted-foreground mb-4 md:mb-8 max-w-md mx-auto text-xs sm:text-sm md:text-base">
                {t("news.noArticlesDesc", "We're working on bringing you the latest news and updates. Check back soon!")}
              </p>
              <Button asChild size="sm" className="text-xs md:text-sm">
                <Link to={getLocalizedPath("/")}>{t("news.returnHome", "Return Home")}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;
