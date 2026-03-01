import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Leaf,
  Target,
  Users,
  Award,
  Globe,
  Recycle,
  TreePine,
  Handshake,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  Quote,
  Building,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import { SEO, BreadcrumbSchema } from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";
import { useSEOPageMeta } from "@/hooks/useCMS";

import heroFarm from "@/assets/hero-farm.jpeg";

interface AboutUsContent {
  id: string;
  section: string;
  content_key: string;
  content_value: string | null;
  content_type: string;
}

interface Director {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
}

interface GlobalOperation {
  id: string;
  location_name: string;
  country: string;
  description: string | null;
  operations_type: string | null;
  is_active: boolean;
}

const getValues = (t: (key: string, fallback?: string) => string) => [
  {
    icon: ShieldCheck,
    title: t("about.values.qualityFirst.title", "Quality First"),
    description: t(
      "about.values.qualityFirst.desc",
      "We maintain the highest standards in every product, ensuring consistency and reliability for our customers.",
    ),
  },
  {
    icon: Handshake,
    title: t("about.values.customerPartnership.title", "Customer Partnership"),
    description: t(
      "about.values.customerPartnership.desc",
      "We build lasting relationships with our clients, understanding their needs and delivering tailored solutions.",
    ),
  },
  {
    icon: Leaf,
    title: t("about.values.sustainability.title", "Sustainability"),
    description: t(
      "about.values.sustainability.desc",
      "Environmental responsibility is at the core of everything we do, from sourcing to delivery.",
    ),
  },
  {
    icon: Award,
    title: t("about.values.excellence.title", "Excellence"),
    description: t(
      "about.values.excellence.desc",
      "We strive for excellence in every aspect of our operations, continuously improving our processes.",
    ),
  },
];

const getSustainabilityPillars = (
  t: (key: string, fallback?: string) => string,
) => [
  {
    icon: Recycle,
    title: t(
      "about.sustainability.responsibleSourcing.title",
      "Responsible Sourcing",
    ),
    description: t(
      "about.sustainability.responsibleSourcing.desc",
      "All our plant-based products come from certified sustainable sources. We partner with RSPO-certified palm oil suppliers and support local UK rapeseed farmers.",
    ),
  },
  {
    icon: TreePine,
    title: t("about.sustainability.carbonReduction.title", "Carbon Reduction"),
    description: t(
      "about.sustainability.carbonReduction.desc",
      "We're committed to reducing our carbon footprint through efficient logistics, renewable energy in our facilities, and continuous process optimization.",
    ),
  },
  {
    icon: Globe,
    title: t("about.sustainability.communityImpact.title", "Community Impact"),
    description: t(
      "about.sustainability.communityImpact.desc",
      "We support the communities where our products originate, investing in education, infrastructure, and sustainable farming practices.",
    ),
  },
];

const About = () => {
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  const { data: seoMeta } = useSEOPageMeta("/about");

  const { data: aboutContent, isLoading: isLoadingContent } = useQuery<AboutUsContent[]>({
    queryKey: ["about-us-content", currentLanguage],
    queryFn: () =>
      apiClient.get<AboutUsContent[]>(
        `/api/about-us-content?lang=${currentLanguage}`,
      ),
  });

  const { data: directors } = useQuery<Director[]>({
    queryKey: ["directors", currentLanguage],
    queryFn: () =>
      apiClient.get<Director[]>(`/api/directors?lang=${currentLanguage}`),
  });

  const { data: operations } = useQuery<GlobalOperation[]>({
    queryKey: ["global-operations", currentLanguage],
    queryFn: () =>
      apiClient.get<GlobalOperation[]>(
        `/api/global-operations?lang=${currentLanguage}`,
      ),
  });

  const getContent = (section: string, key: string): string => {
    const item = aboutContent?.find(
      (c) => c.section === section && c.content_key === key,
    );
    return item?.content_value || "";
  };

  const activeDirectors = directors?.filter((d) => d.is_active) || [];
  const activeOperations = operations?.filter((o) => o.is_active) || [];

  const values = getValues(t);
  const sustainabilityPillars = getSustainabilityPillars(t);

  return (
    <Layout>
      <SEO
        title={seoMeta?.title || t("about.seo.title", "About Us")}
        description={
          seoMeta?.description ||
          t(
            "about.seo.description",
            "Learn about Bio Green Wax Ltd, a leading UK supplier of premium edible oils and industrial waxes. Discover our commitment to quality, sustainability, and customer partnership.",
          )
        }
        keywords={
          seoMeta?.keywords ||
          "about bio green wax, UK oil supplier, sustainable oils, company history, edible oil distributor"
        }
        url="/about"
        noindex={seoMeta?.no_index}
      />
      <BreadcrumbSchema
        items={[
          { name: t("nav.home", "Home"), url: "/" },
          { name: t("nav.about", "About Us"), url: "/about" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroFarm})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
        </div>
        <div className="relative container-wide py-4 md:py-6">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-1 md:mb-2">
              {getContent("hero", "title") || (!isLoadingContent ? t("about.hero.title", "About Bio Green Wax") : "")}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-primary-foreground/90">
              {getContent("hero", "subtitle") || (!isLoadingContent ? t(
                "about.hero.subtitle",
                "Your trusted UK partner for premium edible oils and industrial waxes, delivering quality and sustainability worldwide.",
              ) : "")}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-start">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3 md:mb-6">
                {getContent("story", "title") || (!isLoadingContent ? t("about.story.title", "Our Story") : "")}
              </h2>
              <div className="space-y-4 text-muted-foreground text-xs sm:text-sm md:text-base">
                {isLoadingContent ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </div>
                ) : (
                  (getContent("story", "content") || "")
                    .split("\n\n")
                    .map((paragraph, index) =>
                      paragraph ? <p key={index}>{paragraph}</p> : null,
                    )
                )}
              </div>

              {getContent("experience", "content") && (
                <div className="mt-6 p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                  <h3 className="font-semibold text-sm md:text-base mb-2">
                    {getContent("experience", "title") ||
                      (!isLoadingContent ? t(
                        "about.story.experienceTitle",
                        "Young Company, Experienced Leadership",
                      ) : "")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getContent("experience", "content")}
                  </p>
                </div>
              )}
            </div>

            {/* Company Info Card */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-heading font-semibold text-lg">
                      Bio Green Wax Ltd
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "about.companyInfo.registered",
                        "Registered in England & Wales",
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      {t("about.companyInfo.companyNumber", "Company Number")}
                    </span>
                    <span className="font-medium">
                      {getContent("company_info", "company_number") ||
                        "15814481"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      {t("about.companyInfo.incorporated", "Incorporated")}
                    </span>
                    <span className="font-medium">
                      {getContent("company_info", "incorporated_date") ||
                        "2 July 2024"}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-muted-foreground block mb-1">
                      {t("about.companyInfo.address", "Registered Address")}
                    </span>
                    <span className="font-medium text-xs">
                      {getContent("company_info", "registered_address") ||
                        "Bio Green Wax Ltd, 128 City Road, London, United Kingdom, EC1V 2NX"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Directors Section */}
      {activeDirectors.length > 0 && (
        <section className="py-6 md:py-12 lg:py-16 bg-muted">
          <div className="container-wide">
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2">
                {t("about.leadership.title", "Our Leadership")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                {t(
                  "about.leadership.subtitle",
                  "Meet the experienced professionals driving Bio Green Wax forward",
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {activeDirectors.map((director) => (
                <Card key={director.id} className="bg-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4 md:gap-6">
                      <div className="flex-shrink-0">
                        {director.photo_url ? (
                          <OptimizedImage
                            src={director.photo_url}
                            alt={director.name}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="h-10 w-10 md:h-14 md:w-14 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-lg md:text-xl">
                          {director.name}
                        </h3>
                        <p className="text-sm text-primary font-medium mb-2">
                          {director.title}
                        </p>
                        {director.linkedin_url && (
                          <a
                            href={director.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-3"
                          >
                            <Linkedin className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t(
                                "about.leadership.linkedIn",
                                "LinkedIn Profile",
                              )}
                            </span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-4 md:line-clamp-none">
                          {director.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Director's Message */}
      {getContent("director_message", "content") && (
        <section className="py-8 md:py-16">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white border-0 shadow-lg overflow-hidden">
                <div className="bg-primary p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <Quote className="h-8 w-8 text-accent" />
                    <h2 className="text-lg md:text-xl font-heading font-semibold text-primary-foreground">
                      {getContent("director_message", "title") ||
                        (!isLoadingContent ? t(
                          "about.directorMessage.title",
                          "A Message from Our Managing Director",
                        ) : "")}
                    </h2>
                  </div>
                </div>
                <CardContent className="p-6 md:p-8">
                  <div className="prose prose-sm md:prose max-w-none text-muted-foreground space-y-4">
                    {(getContent("director_message", "content") || "")
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-sm md:text-base leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                  <div className="mt-8 pt-6 border-t flex items-center gap-4">
                    {activeDirectors[0]?.photo_url && (
                      <OptimizedImage
                        src={activeDirectors[0].photo_url}
                        alt={getContent("director_message", "signature")}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-heading font-semibold text-lg">
                        {getContent("director_message", "signature") ||
                          "Hantash Najam"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getContent("director_message", "signature_title") ||
                          "Managing Director, Bio Green Wax Ltd"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Global Operations */}
      {activeOperations.length > 0 && (
        <section className="py-6 md:py-12 lg:py-16 bg-primary text-primary-foreground">
          <div className="container-wide">
            <div className="text-center mb-6 md:mb-10">
              <Globe className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 text-accent" />
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2">
                {t("about.globalOperations.title", "Global Operations")}
              </h2>
              <p className="text-sm md:text-base text-primary-foreground/80 max-w-2xl mx-auto">
                {t(
                  "about.globalOperations.subtitle",
                  "Our sales and operations teams work across multiple time zones to serve you better",
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activeOperations.map((op) => (
                <Card
                  key={op.id}
                  className="bg-white/10 border-white/20 backdrop-blur"
                >
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <h3 className="font-heading font-semibold text-base md:text-lg">
                      {op.location_name}
                    </h3>
                    <p className="text-sm text-primary-foreground/80">
                      {op.country}
                    </p>
                    <p className="text-xs text-primary-foreground/60 mt-1">
                      {op.operations_type}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission Section */}
      <section className="py-8 md:py-16">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="h-10 w-10 md:h-16 md:w-16 mx-auto mb-3 md:mb-6 text-primary" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3 md:mb-6">
              {getContent("mission", "title") || (!isLoadingContent ? t("about.mission.title", "Our Mission") : "")}
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-muted-foreground leading-relaxed">
              {getContent("mission", "content") || (!isLoadingContent ? t(
                "about.mission.content",
                "To be the UK's most trusted supplier of quality oils and waxes, delivering exceptional products with outstanding service while maintaining our commitment to sustainability and ethical business practices.",
              ) : "")}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-6 md:py-12 lg:py-16 bg-muted">
        <div className="container-wide">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 md:mb-4">
              {t("about.coreValues.title", "Our Core Values")}
            </h2>
            <p className="text-xs sm:text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "about.coreValues.subtitle",
                "The principles that guide everything we do",
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {values.map((value) => (
              <Card
                key={value.title}
                className="card-hover border-0 shadow-md text-center bg-white"
              >
                <CardContent className="p-3 md:p-6">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                    <value.icon className="h-5 w-5 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-xs sm:text-sm md:text-lg font-heading font-semibold mb-1 md:mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-3 md:line-clamp-none">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-wide">
          <div className="text-center mb-6 md:mb-12">
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-green-light/20 rounded-full text-green-light mb-2 md:mb-4">
              <Leaf className="h-3.5 w-3.5 md:h-5 md:w-5" />
              <span className="font-medium text-xs md:text-base">
                {t("about.sustainability.badge", "Sustainability Commitment")}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 md:mb-4">
              {t("about.sustainability.title", "Building a Greener Future")}
            </h2>
            <p className="text-xs sm:text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "about.sustainability.subtitle",
                "Environmental responsibility isn't just part of our name—it's central to how we operate.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-8">
            {sustainabilityPillars.map((pillar) => (
              <Card key={pillar.title} className="border-0 shadow-md bg-white">
                <CardContent className="p-3 md:p-6">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-accent/20 flex items-center justify-center mb-2 md:mb-4">
                    <pillar.icon className="h-5 w-5 md:h-7 md:w-7 text-accent" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-xl font-heading font-semibold mb-1 md:mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-xs md:text-base text-muted-foreground line-clamp-3 md:line-clamp-none">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 md:mt-12 text-center">
            <p className="text-xs md:text-base text-muted-foreground mb-3 md:mb-4">
              {t(
                "about.sustainability.learnMore",
                "Learn more about our certifications and sustainability practices",
              )}
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs md:text-sm"
            >
              <Link to={getLocalizedPath("/certifications")}>
                {t(
                  "about.sustainability.viewCertifications",
                  "View Our Certifications",
                )}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* UK Location */}
      <section className="py-6 md:py-12 lg:py-16 bg-muted">
        <div className="container-wide">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 md:mb-4">
              {t("about.location.title", "Our UK Location")}
            </h2>
            <p className="text-xs sm:text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "about.location.subtitle",
                "Strategically located to serve customers across the UK and beyond",
              )}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="aspect-video">
                <iframe
                  src="https://www.google.com/maps?q=Bio+Green+Wax+Ltd,+UK&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bio Green Wax Ltd, UK"
                ></iframe>
              </div>
            </div>

            <div className="space-y-3 md:space-y-6">
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="p-3 md:p-6">
                  <h3 className="text-sm sm:text-base md:text-xl font-heading font-semibold mb-2 md:mb-4">
                    {t("about.location.headOffice", "Head Office")}
                  </h3>
                  <div className="space-y-2 md:space-y-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-xs md:text-base">
                          Bio Green Wax Ltd
                        </p>
                        <p className="text-muted-foreground text-xs md:text-base">
                          {getContent("company_info", "registered_address") ||
                            "Bio Green Wax Ltd, 128 City Road, London, United Kingdom, EC1V 2NX"}
                        </p>
                        <p className="text-[10px] md:text-sm text-muted-foreground mt-1 md:mt-2">
                          Company No:{" "}
                          {getContent("company_info", "company_number") ||
                            "15814481"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      <a
                        href="tel:+442071013847"
                        className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-base"
                      >
                        +44 20 7101 3847
                      </a>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      <a
                        href="mailto:info@biogreenwax.com"
                        className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-base"
                      >
                        info@biogreenwax.com
                      </a>
                    </div>
                    <div className="flex items-start gap-2 md:gap-3">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5" />
                      <div className="text-muted-foreground text-xs md:text-base">
                        <p>
                          {t(
                            "about.location.hours.weekdays",
                            "Monday - Friday: 8:00 AM - 6:00 PM",
                          )}
                        </p>
                        <p>
                          {t(
                            "about.location.hours.saturday",
                            "Saturday: 9:00 AM - 1:00 PM",
                          )}
                        </p>
                        <p>
                          {t("about.location.hours.sunday", "Sunday: Closed")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 md:py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold mb-2 md:mb-4">
            {t("about.cta.title", "Ready to Work With Us?")}
          </h2>
          <p className="text-primary-foreground/80 mb-4 md:mb-6 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
            {t(
              "about.cta.subtitle",
              "Get in touch with our team to discuss your requirements and discover how Bio Green Wax can support your business.",
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs md:text-sm"
            >
              <Link to={getLocalizedPath("/contact")}>
                {t("about.cta.contactUs", "Contact Us")}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-white text-primary hover:bg-white/90 font-semibold text-xs md:text-sm border-0"
            >
              <Link to={getLocalizedPath("/products")}>
                {t("about.cta.viewProducts", "View Our Products")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
