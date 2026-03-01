import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNewsArticles, NewsArticle } from "@/hooks/useCMS";

interface NewsSectionProps {
  preloadedArticles?: NewsArticle[];
}

const NewsSection = ({ preloadedArticles }: NewsSectionProps) => {
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  const { data: fetchedArticles } = useNewsArticles(true, currentLanguage);
  const newsArticles = preloadedArticles || fetchedArticles;

  const formatDate = (dateString: string) => {
    const localeMap: Record<string, string> = {
      en: "en-GB", de: "de-DE", fr: "fr-FR", es: "es-ES", it: "it-IT",
      pt: "pt-PT", ru: "ru-RU", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR",
      ar: "ar-SA", th: "th-TH", vi: "vi-VN", tr: "tr-TR", pl: "pl-PL", sw: "sw-KE"
    };
    return new Date(dateString).toLocaleDateString(localeMap[currentLanguage] || "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const displayArticles = newsArticles?.slice(0, 3) || [];

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-2 md:mb-4">
              {t("home.news.title")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl">
              {t("home.news.subtitle")}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit text-xs sm:text-sm">
            <Link to={getLocalizedPath("/news")}>
              {t("home.news.cta")}
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>

        {displayArticles.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {t("home.news.noArticles", "No news articles available yet.")}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {displayArticles.map((article) => (
              <Card key={article.id} className="card-hover border-0 shadow-md bg-white">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold mb-2 sm:mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">
                    {article.excerpt || article.content?.substring(0, 150)}
                  </p>
                  <Link
                    to={getLocalizedPath(`/news/${article.slug || article.id}`)}
                    className="inline-flex items-center text-xs sm:text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    {t("home.news.readMore")}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
