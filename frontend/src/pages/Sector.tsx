import { Layout } from "@/components/layout";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { SEO, BreadcrumbSchema } from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";

interface DbSector {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

interface SectorData {
  title: string;
  description: string;
  image_url: string | null;
  overview: string;
  applications: string[];
  products: { name: string; description: string }[];
  benefits: string[];
}

// Fallback data for sectors (used when database has no extended content)
const fallbackSectorData: Record<string, Omit<SectorData, 'title' | 'description' | 'image_url'>> = {
  "candle-making": {
    overview:
      "Bio Green Wax provides the candle industry with premium natural and synthetic waxes that deliver exceptional burn quality, scent throw, and aesthetic appeal. Our waxes are carefully selected and tested to meet the demanding requirements of professional candle makers.",
    applications: [
      "Container candles",
      "Pillar candles",
      "Votive candles",
      "Tealights",
      "Wax melts",
      "Specialty and decorative candles",
    ],
    products: [
      { name: "Soy Wax", description: "100% natural soy wax for clean-burning candles" },
      { name: "Palm Wax", description: "Crystalline wax for unique visual effects" },
      { name: "Paraffin Wax", description: "High-quality paraffin for excellent scent throw" },
      { name: "Beeswax", description: "Pure beeswax for premium natural candles" },
    ],
    benefits: [
      "Consistent quality across batches",
      "Excellent hot and cold scent throw",
      "Clean burning with minimal soot",
      "Wide range of melting points available",
      "Technical support and guidance",
    ],
  },
  cosmetics: {
    overview:
      "Our cosmetic-grade oils and waxes are essential ingredients in skincare, haircare, and beauty formulations. We supply purified, tested materials that meet the stringent requirements of the personal care industry.",
    applications: [
      "Lip balms and lipsticks",
      "Creams and lotions",
      "Hair products",
      "Makeup formulations",
      "Sunscreens",
      "Natural skincare",
    ],
    products: [
      { name: "Castor Oil", description: "High-quality castor oil for hair and skin products" },
      { name: "Coconut Oil", description: "Refined and virgin coconut oil options" },
      { name: "Carnauba Wax", description: "Premium plant wax for glossy finishes" },
      { name: "Microcrystalline Wax", description: "Flexible wax for emulsions" },
    ],
    benefits: [
      "Cosmetic-grade purity standards",
      "Full documentation and COAs",
      "Sustainable sourcing options",
      "Custom blending available",
      "Regulatory compliance support",
    ],
  },
  food: {
    overview:
      "We supply the food industry with certified food-grade oils and waxes for coating, processing, and ingredient applications. All products meet strict food safety standards and come with full traceability.",
    applications: [
      "Confectionery coatings",
      "Cheese waxing",
      "Fruit and vegetable coatings",
      "Food processing lubricants",
      "Edible oil applications",
      "Baking and cooking",
    ],
    products: [
      { name: "Sunflower Oil", description: "High-oleic sunflower oil for cooking and frying" },
      { name: "Rapeseed Oil", description: "Low-saturated fat cooking oil" },
      { name: "Food-Grade Microcrystalline", description: "FDA-approved wax for food coatings" },
      { name: "Carnauba Wax", description: "Natural glazing agent" },
    ],
    benefits: [
      "FSSC 22000 certified",
      "Full batch traceability",
      "Allergen-free options",
      "Kosher and Halal certified products",
      "Extended shelf life solutions",
    ],
  },
  packaging: {
    overview:
      "Our waxes provide excellent barrier properties for packaging applications, protecting products from moisture, oxygen, and other environmental factors. We offer both traditional and sustainable coating solutions.",
    applications: [
      "Paper and cardboard coatings",
      "Corrugated box treatments",
      "Food packaging barriers",
      "Protective wraps",
      "Industrial packaging",
      "Sustainable packaging alternatives",
    ],
    products: [
      { name: "Paraffin Wax", description: "Traditional barrier coating wax" },
      { name: "Microcrystalline Wax", description: "Flexible coating solutions" },
      { name: "Polyethylene Wax", description: "High-performance industrial coatings" },
      { name: "Natural Wax Blends", description: "Sustainable packaging options" },
    ],
    benefits: [
      "Excellent moisture barrier",
      "Heat-sealable options",
      "Sustainable alternatives available",
      "Custom formulations",
      "Cost-effective solutions",
    ],
  },
  textiles: {
    overview:
      "We supply the textile and leather industries with specialized waxes and oils for finishing, waterproofing, and conditioning. Our products enhance the appearance and durability of fabrics and leather goods.",
    applications: [
      "Fabric finishing",
      "Waterproofing treatments",
      "Leather conditioning",
      "Thread lubrication",
      "Canvas and outdoor fabrics",
      "Specialty textile treatments",
    ],
    products: [
      { name: "Paraffin Emulsions", description: "Water-repellent fabric treatments" },
      { name: "Microcrystalline Wax", description: "Leather finishing and conditioning" },
      { name: "Castor Oil", description: "Textile lubrication and softening" },
      { name: "Specialty Blends", description: "Custom formulations for specific needs" },
    ],
    benefits: [
      "Improved water resistance",
      "Enhanced fabric hand feel",
      "Extended material life",
      "Environmentally friendly options",
      "Technical application support",
    ],
  },
  "rubber-plastics": {
    overview:
      "Our industrial waxes serve as processing aids, mold release agents, and performance additives in rubber and plastic manufacturing. We offer products that improve processing efficiency and end-product quality.",
    applications: [
      "Internal lubricants",
      "External lubricants",
      "Mold release agents",
      "Processing aids",
      "Surface modification",
      "Anti-blocking agents",
    ],
    products: [
      { name: "Polyethylene Wax", description: "High-performance processing aid" },
      { name: "Oxidized Polyethylene Wax", description: "Improved compatibility additive" },
      { name: "Paraffin Wax", description: "General purpose lubricant" },
      { name: "Microcrystalline Wax", description: "Flexibility and toughness enhancer" },
    ],
    benefits: [
      "Improved processing efficiency",
      "Better surface finish",
      "Reduced cycle times",
      "Enhanced product properties",
      "Technical formulation support",
    ],
  },
  pharmaceuticals: {
    overview:
      "Bio Green Wax supplies pharmaceutical-grade oils and waxes that meet the stringent purity requirements of the healthcare industry. Our products are used in drug delivery systems, ointments, and medical device manufacturing.",
    applications: [
      "Tablet coatings",
      "Ointments and creams",
      "Suppositories",
      "Drug delivery systems",
      "Medical device lubrication",
      "Capsule formulations",
    ],
    products: [
      { name: "Pharmaceutical Grade Paraffin", description: "USP/BP grade for medicinal applications" },
      { name: "White Soft Paraffin", description: "High-purity petrolatum for ointments" },
      { name: "Microcrystalline Wax", description: "Pharmaceutical grade for creams" },
      { name: "Castor Oil", description: "USP grade for drug formulations" },
    ],
    benefits: [
      "Pharmaceutical-grade purity",
      "Full regulatory documentation",
      "USP/BP/EP compliance",
      "Batch traceability",
      "Stability testing support",
    ],
  },
  adhesives: {
    overview:
      "Our waxes are essential components in hot melt adhesive formulations, providing improved application properties, open time control, and cost-effective performance enhancement for adhesive manufacturers.",
    applications: [
      "Hot melt adhesives",
      "Pressure sensitive adhesives",
      "Packaging adhesives",
      "Bookbinding adhesives",
      "Woodworking adhesives",
      "Labeling adhesives",
    ],
    products: [
      { name: "Paraffin Wax", description: "Viscosity modifier and cost reducer" },
      { name: "Microcrystalline Wax", description: "Flexibility and adhesion enhancer" },
      { name: "Fischer-Tropsch Wax", description: "High-performance synthetic wax" },
      { name: "Polyethylene Wax", description: "Heat resistance and hardness" },
    ],
    benefits: [
      "Improved open time control",
      "Enhanced thermal stability",
      "Better substrate wetting",
      "Cost-effective formulations",
      "Consistent quality supply",
    ],
  },
  "polishes-coatings": {
    overview:
      "Bio Green Wax provides premium waxes for polish and coating formulations used in automotive, furniture, floor care, and industrial applications. Our waxes deliver superior gloss, protection, and durability.",
    applications: [
      "Car waxes and polishes",
      "Furniture polishes",
      "Floor waxes",
      "Shoe polishes",
      "Metal polishes",
      "Industrial protective coatings",
    ],
    products: [
      { name: "Carnauba Wax", description: "Premium natural wax for high gloss" },
      { name: "Microcrystalline Wax", description: "Buffability and protection" },
      { name: "Paraffin Wax", description: "Cost-effective base wax" },
      { name: "Montan Wax", description: "Hard wax for durable finishes" },
    ],
    benefits: [
      "Superior gloss and shine",
      "Excellent water beading",
      "Long-lasting protection",
      "Easy application",
      "Custom formulation support",
    ],
  },
  "paper-printing": {
    overview:
      "We supply waxes for paper coating, corrugated board treatment, and printing applications. Our products provide moisture barriers, improved printability, and enhanced paper properties.",
    applications: [
      "Paper coating",
      "Corrugated board treatment",
      "Packaging paper",
      "Printing inks",
      "Thermal paper",
      "Waxed paper products",
    ],
    products: [
      { name: "Paraffin Wax", description: "Moisture barrier coating" },
      { name: "Microcrystalline Wax", description: "Flexibility for coated papers" },
      { name: "Polyethylene Wax", description: "Slip and rub resistance" },
      { name: "Wax Emulsions", description: "Water-based coating solutions" },
    ],
    benefits: [
      "Excellent moisture barrier",
      "Improved printability",
      "Enhanced paper strength",
      "Food-safe options available",
      "Sustainable solutions",
    ],
  },
};

const Sector = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, getLocalizedPath, currentLanguage } = useLanguage();

  const { data: dbSector, isLoading } = useQuery({
    queryKey: ["sector", slug, currentLanguage],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const sectors = await apiClient.get<DbSector[]>(`/api/sectors?active_only=true&lang=${currentLanguage}`);
        return sectors.find(s => s.slug === slug) || null;
      } catch {
        return null;
      }
    },
    enabled: !!slug,
  });

  const fallbackContent = slug ? fallbackSectorData[slug] : null;
  
  const sector: SectorData | null = dbSector
    ? {
        title: dbSector.name,
        description: dbSector.description || "",
        image_url: dbSector.image_url,
        overview: fallbackContent?.overview || dbSector.description || "",
        applications: fallbackContent?.applications || [],
        products: fallbackContent?.products || [],
        benefits: fallbackContent?.benefits || [],
      }
    : null;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!sector) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-bold mb-4">{t("sectorPage.notFound", "Sector Not Found")}</h1>
            <p className="text-muted-foreground mb-8">
              {t("sectorPage.notFoundDesc", "The sector you're looking for doesn't exist.")}
            </p>
            <Button asChild>
              <Link to={getLocalizedPath("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("sectorPage.backToHome", "Back to Home")}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${sector.title} - Industries We Serve`}
        description={sector.description || sector.overview.slice(0, 160)}
        keywords={`${sector.title}, oils and waxes, ${sector.applications?.slice(0, 3).join(', ') || ''}, UK supplier`}
        url={`/sectors/${slug}`}
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Sectors', url: '/' },
        { name: sector.title, url: `/sectors/${slug}` }
      ]} />
      {/* Hero - Compact */}
      <section className="gradient-primary text-primary-foreground py-6">
        <div className="container-wide">
          <Link
            to={getLocalizedPath("/")}
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-3 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("sectorPage.backToHome", "Back to Home")}
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            {sector.title}
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl">
            {sector.description}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4">{t("sectorPage.overview", "Overview")}</h2>
              <p className="text-muted-foreground text-lg mb-8">{sector.overview}</p>
              <Button asChild>
                <Link to={getLocalizedPath("/contact?type=quote")}>
                  {t("sectorPage.requestQuote", "Request a Quote")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-muted rounded-xl aspect-video flex items-center justify-center overflow-hidden">
              {sector.image_url ? (
                <OptimizedImage
                  src={sector.image_url}
                  alt={sector.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground">Sector Image</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      {sector.applications.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-wide">
            <h2 className="text-3xl font-heading font-bold mb-8 text-center">
              {t("sectorPage.applications", "Applications")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {sector.applications.map((app) => (
                <div
                  key={app}
                  className="flex items-center gap-3 bg-white rounded-lg p-4 border"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {sector.products.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <h2 className="text-3xl font-heading font-bold mb-8 text-center">
              {t("sectorPage.recommendedProducts", "Recommended Products")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sector.products.map((product) => (
                <div
                  key={product.name}
                  className="bg-white rounded-xl p-6 border shadow-sm card-hover"
                >
                  <h3 className="font-heading font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to={getLocalizedPath("/products")}>
                  {t("sectorPage.viewAllProducts", "View All Products")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {sector.benefits.length > 0 && (
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-wide">
            <h2 className="text-3xl font-heading font-bold mb-8 text-center">
              {t("sectorPage.whyChoose", "Why Choose Bio Green Wax?")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {sector.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 bg-primary-foreground/10 rounded-lg p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            {t("sectorPage.readyToStart", "Ready to Get Started?")}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t("sectorPage.ctaDescription", `Contact our team to discuss your specific requirements and discover how we can support your ${sector.title.toLowerCase()} applications.`)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to={getLocalizedPath("/contact?type=quote")}>{t("sectorPage.requestQuote", "Request a Quote")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={getLocalizedPath("/contact?type=sample")}>{t("sectorPage.requestSample", "Request a Sample")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sector;