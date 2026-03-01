import { Layout } from "@/components/layout";
import {
  HeroSection,
  ServicesSection,
  SectorsSection,
  ProductsSection,
  StatsSection,
  NewsSection,
  CTASection,
} from "@/components/home";
import { SEO, OrganizationSchema, LocalBusinessSchema } from "@/components/SEO";
import { useSEOPageMeta } from "@/hooks/useCMS";

const Index = () => {
  const { data: seoMeta } = useSEOPageMeta("/");

  return (
    <Layout>
      <SEO
        title={seoMeta?.title || "Premium Edible Oils & Industrial Waxes Supplier"}
        description={seoMeta?.description || "Bio Green Wax Ltd is a leading UK supplier of premium edible oils, plant-based waxes, and industrial petrochemical waxes. Quality products for food, cosmetics, and manufacturing industries."}
        keywords={seoMeta?.keywords || "edible oils, sunflower oil, palm oil, coconut oil, rapeseed oil, plant waxes, paraffin wax, industrial wax, UK supplier, wholesale oils"}
        url="/"
        noindex={seoMeta?.no_index}
      />
      <OrganizationSchema />
      <LocalBusinessSchema />
      <HeroSection />
      <ServicesSection />
      <SectorsSection />
      <ProductsSection />
      <StatsSection />
      <NewsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
