import { Layout } from "@/components/layout";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { SEO, ArticleSchema, BreadcrumbSchema } from "@/components/SEO";

interface NewsArticleType {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
}

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["news-article", slug],
    queryFn: async () => {
      if (!slug) return null;
      return apiClient.get<NewsArticleType>(`/api/news-articles/${slug}`);
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to News
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const articleDate = article.published_at || article.created_at;
  const articleDescription = article.content 
    ? DOMPurify.sanitize(article.content, { ALLOWED_TAGS: [] }).slice(0, 160) + '...'
    : `Read about ${article.title} from Bio Green Wax Ltd.`;

  return (
    <Layout>
      <SEO
        title={article.title}
        description={articleDescription}
        url={`/news/${article.slug}`}
        type="article"
        image={article.image_url || undefined}
        article={{
          publishedTime: articleDate,
          author: 'Bio Green Wax Ltd'
        }}
      />
      <ArticleSchema
        headline={article.title}
        description={articleDescription}
        image={article.image_url || undefined}
        datePublished={articleDate}
        url={`/news/${article.slug}`}
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'News', url: '/news' },
        { name: article.title, url: `/news/${article.slug}` }
      ]} />
      {/* Hero - Compact */}
      <section className="gradient-primary text-primary-foreground pt-24 pb-8">
        <div className="container-wide max-w-4xl">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-3 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.published_at || article.created_at}>
              {format(
                new Date(article.published_at || article.created_at),
                "MMMM d, yyyy"
              )}
            </time>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="section-padding">
        <div className="container-wide max-w-4xl">
          {article.image_url && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(article.content || '', {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
              })
            }}
          />
        </div>
      </article>

      {/* CTA */}
      <section className="pb-16">
        <div className="container-wide max-w-4xl">
          <div className="border-t pt-8">
            <Button asChild variant="outline">
              <Link to="/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All News
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsArticle;
