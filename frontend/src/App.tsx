import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { InactivityWarning } from "@/components/admin/InactivityWarning";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { LanguageProvider } from "@/i18n";
import HreflangTags from "@/components/HreflangTags";
import ScrollToTop from "./components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Careers = lazy(() => import("./pages/Careers"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Sector = lazy(() => import("./pages/Sector"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminSpecifications = lazy(() => import("./pages/admin/AdminSpecifications"));
const AdminPendingChanges = lazy(() => import("./pages/admin/AdminPendingChanges"));
const ContentCreatorDashboard = lazy(() => import("./pages/admin/ContentCreatorDashboard"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const detectLangFromPath = (): string => {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const validLangs = ['en','de','fr','es','it','pt','ru','zh','ja','ko','ar','th','vi','tr','pl','sw'];
  if (pathParts.length > 0 && validLangs.includes(pathParts[0])) {
    return pathParts[0];
  }
  return localStorage.getItem('preferredLanguage') || 'en';
};

const prefetchHomepageData = () => {
  const lang = detectLangFromPath();
  const url = (import.meta.env.DEV ? '/api' : 'https://www.biogreenwax.com') + `/homepage-data?lang=${lang}`;
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('prefetch failed');
      return res.json();
    })
    .then(data => {
      if (!data || !data.hero_slides) return;
      queryClient.setQueryData(["homepage-data", lang], data);
      queryClient.setQueryData(["hero-slides", false, lang], data.hero_slides);
      queryClient.setQueryData(["products", "featured", lang], data.featured_products);
      queryClient.setQueryData(["sectors", true, lang], data.sectors);
      queryClient.setQueryData(["product-categories", true, lang], data.product_categories);
      queryClient.setQueryData(["news-articles", true, lang], data.news_articles);
      queryClient.setQueryData(["contact-info"], data.contact_info);
    })
    .catch(() => {});
};
if (!window.location.pathname.startsWith('/admin')) {
  prefetchHomepageData();
}

const PublicRoutes = () => (
  <Routes>
    <Route index element={<Index />} />
    <Route path="about" element={<About />} />
    <Route path="products" element={<Products />} />
    <Route path="products/:id" element={<ProductDetail />} />
    <Route path="contact" element={<Contact />} />
    <Route path="news" element={<News />} />
    <Route path="news/:slug" element={<NewsArticle />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="terms" element={<Terms />} />
    <Route path="careers" element={<Careers />} />
    <Route path="certifications" element={<Certifications />} />
    <Route path="sectors/:slug" element={<Sector />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InactivityWarning />
        <BrowserRouter>
          <LanguageProvider>
            <HreflangTags />
            <AnalyticsProvider>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Language-prefixed public routes */}
                <Route path="/:lang/*" element={<PublicRoutes />} />
                
                {/* Default (English) public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:slug" element={<NewsArticle />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/sectors/:slug" element={<Sector />} />
                
                {/* Admin Routes - English only */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/specifications"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminSpecifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pending-changes"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminPendingChanges />
                    </ProtectedRoute>
                  }
                />
                
                {/* Content Creator Routes */}
                <Route
                  path="/creator"
                  element={
                    <ProtectedRoute requireAnyRole>
                      <ContentCreatorDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </AnalyticsProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
