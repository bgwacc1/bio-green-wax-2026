import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

// Types
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  key: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  full_description: string | null;
  category: string;
  category_label: string;
  categories: string[];
  image_url: string | null;
  specifications: { label: string; value: string }[];
  applications: string[];
  packaging: string[];
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  priority_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content_value: string;
  content_type: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface HomepageData {
  hero_slides: HeroSlide[];
  featured_products: Product[];
  sectors: Sector[];
  product_categories: ProductCategory[];
  news_articles: NewsArticle[];
  contact_info: ContactInfo[];
}

export const useHomepageData = (lang = 'en') => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["homepage-data", lang],
    queryFn: async () => {
      const data = await apiClient.get<HomepageData>(`/api/homepage-data?lang=${lang}`);
      queryClient.setQueryData(["hero-slides", false, lang], data.hero_slides);
      queryClient.setQueryData(["products", "featured", lang], data.featured_products);
      queryClient.setQueryData(["sectors", true, lang], data.sectors);
      queryClient.setQueryData(["product-categories", true, lang], data.product_categories);
      queryClient.setQueryData(["news-articles", true, lang], data.news_articles);
      queryClient.setQueryData(["contact-info"], data.contact_info);
      return data;
    },
    staleTime: 3 * 60 * 1000,
  });
};

// Hero Slides Hooks
export const useHeroSlides = (adminView = false, lang = 'en') => {
  return useQuery({
    queryKey: ["hero-slides", adminView, lang],
    queryFn: async () => {
      const includeImages = adminView ? '&include_images=true' : '';
      const data = await apiClient.get<HeroSlide[]>(`/api/hero-slides?active_only=${!adminView}&lang=${lang}${includeImages}`);
      return data;
    },
  });
};

export const useCreateHeroSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slide: Omit<HeroSlide, "id" | "created_at" | "updated_at">) => {
      return apiClient.post<HeroSlide>("/api/hero-slides", slide);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      toast.success("Hero slide created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateHeroSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HeroSlide> & { id: string }) => {
      return apiClient.put<HeroSlide>(`/api/hero-slides/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      toast.success("Hero slide updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteHeroSlide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/hero-slides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      toast.success("Hero slide deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Contact Info Hooks
export const useContactInfo = () => {
  return useQuery({
    queryKey: ["contact-info"],
    queryFn: async () => {
      return apiClient.get<ContactInfo[]>("/api/contact-info");
    },
  });
};

export const useUpdateContactInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      return apiClient.put<ContactInfo>(`/api/contact-info/${id}?value=${encodeURIComponent(value)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
      toast.success("Contact info updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useCreateContactInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: { key: string; value: string; label: string }) => {
      return apiClient.post<ContactInfo>("/api/contact-info", info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
      toast.success("Contact info created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// News Articles Hooks
export const useNewsArticles = (publishedOnly = true, lang = 'en') => {
  return useQuery({
    queryKey: ["news-articles", publishedOnly, lang],
    queryFn: async () => {
      return apiClient.get<NewsArticle[]>(`/api/news-articles?published_only=${publishedOnly}&lang=${lang}`);
    },
  });
};

export const useCreateNewsArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (article: Omit<NewsArticle, "id" | "created_at" | "updated_at">) => {
      return apiClient.post<NewsArticle>("/api/news-articles", article);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      toast.success("Article created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateNewsArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsArticle> & { id: string }) => {
      return apiClient.put<NewsArticle>(`/api/news-articles/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      toast.success("Article updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteNewsArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/news-articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      toast.success("Article deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Products Hooks
export const useProducts = (activeOnly = true, lang = 'en') => {
  return useQuery({
    queryKey: ["products", activeOnly, lang],
    queryFn: async () => {
      const includeImages = !activeOnly ? '&include_images=true' : '';
      const data = await apiClient.get<Product[]>(`/api/products?active_only=${activeOnly}&lang=${lang}${includeImages}`);
      return data.map((item) => ({
        ...item,
        specifications: item.specifications || [],
        applications: item.applications || [],
        packaging: item.packaging || [],
        categories: item.categories || [],
      }));
    },
  });
};

// Fetch featured products for homepage
export const useFeaturedProducts = (lang = 'en') => {
  return useQuery({
    queryKey: ["products", "featured", lang],
    queryFn: async () => {
      const data = await apiClient.get<Product[]>(`/api/products?active_only=true&featured_only=true&lang=${lang}`);
      return data.map((item) => ({
        ...item,
        specifications: item.specifications || [],
        applications: item.applications || [],
        packaging: item.packaging || [],
        categories: item.categories || [],
      }));
    },
  });
};

// Fetch single product by slug
export const useProductBySlug = (slug: string | undefined, lang = 'en') => {
  return useQuery({
    queryKey: ["product", slug, lang],
    queryFn: async () => {
      if (!slug) return null;
      const data = await apiClient.get<Product>(`/api/products/${slug}?lang=${lang}`);
      return {
        ...data,
        specifications: data.specifications || [],
        applications: data.applications || [],
        packaging: data.packaging || [],
        categories: data.categories || [],
      };
    },
    enabled: !!slug,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
      return apiClient.post<Product>("/api/products", product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      return apiClient.put<Product>(`/api/products/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Product Categories Hooks
export const useProductCategories = (activeOnly = true, lang = 'en') => {
  return useQuery({
    queryKey: ["product-categories", activeOnly, lang],
    queryFn: async () => {
      return apiClient.get<ProductCategory[]>(`/api/product-categories?active_only=${activeOnly}&lang=${lang}`);
    },
  });
};

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Omit<ProductCategory, "id" | "created_at" | "updated_at">) => {
      return apiClient.post<ProductCategory>("/api/product-categories", category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductCategory> & { id: string }) => {
      return apiClient.put<ProductCategory>(`/api/product-categories/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/product-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Site Content Hooks
export const useSiteContent = (page: string) => {
  return useQuery({
    queryKey: ["site-content", page],
    queryFn: async () => {
      return apiClient.get<SiteContent[]>(`/api/site-content?page=${encodeURIComponent(page)}`);
    },
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content_value }: { id: string; content_value: string }) => {
      return apiClient.put<SiteContent>(`/api/site-content/${id}?content_value=${encodeURIComponent(content_value)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Content updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useCreateSiteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: Omit<SiteContent, "id" | "created_at" | "updated_at">) => {
      return apiClient.post<SiteContent>("/api/site-content", content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Content created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Image Upload Helper - Now uses base64
export const uploadCMSImage = async (file: File, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const deleteCMSImage = async (imageUrl: string): Promise<void> => {
  // With base64 images, there's nothing to delete from storage
  return;
};

// Sector Interface
export interface Sector {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

// Sectors Hooks
export const useSectors = (activeOnly = true, lang = 'en') => {
  return useQuery({
    queryKey: ["sectors", activeOnly, lang],
    queryFn: async () => {
      const includeImages = !activeOnly ? '&include_images=true' : '';
      return apiClient.get<Sector[]>(`/api/sectors?active_only=${activeOnly}&lang=${lang}${includeImages}`);
    },
  });
};

// SEO Page Meta
export interface SEOPageMeta {
  id: string;
  page_path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  no_index: boolean;
  is_active: boolean;
}

export const useSEOPageMeta = (pagePath: string) => {
  return useQuery({
    queryKey: ["seo-page-meta", pagePath],
    queryFn: async () => {
      const data = await apiClient.get<SEOPageMeta>(`/api/seo-page-meta/by-path?path=${encodeURIComponent(pagePath)}`);
      if ((data as any).error) return null;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
