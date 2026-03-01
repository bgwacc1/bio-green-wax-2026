import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award } from "lucide-react";
import { useCertifications } from "@/hooks/useCertifications";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO, BreadcrumbSchema } from "@/components/SEO";
import { useSEOPageMeta } from "@/hooks/useCMS";
import OptimizedImage from "@/components/OptimizedImage";
import { useLanguage } from "@/i18n/LanguageContext";

// Fallback images for certifications without uploaded images
import iso9001Image from "@/assets/certifications/iso-9001.png";
import iso14001Image from "@/assets/certifications/iso-14001.png";
import rspoImage from "@/assets/certifications/rspo.png";
import fssc22000Image from "@/assets/certifications/fssc-22000.png";
import isccEuImage from "@/assets/certifications/iscc-eu.png";
import isccPlusImage from "@/assets/certifications/iscc-plus.png";

// Map certification names to fallback images
const fallbackImages: Record<string, string> = {
  "ISO 9001:2015": iso9001Image,
  "ISO 14001:2015": iso14001Image,
  "RSPO Certified": rspoImage,
  "FSSC 22000": fssc22000Image,
  "ISCC EU": isccEuImage,
  "ISCC PLUS": isccPlusImage,
};

const Certifications = () => {
  const { data: seoMeta } = useSEOPageMeta("/certifications");
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  // Pass language to hook - translations are automatically merged by API
  const { data: certifications, isLoading, error } = useCertifications(currentLanguage);

  const commitments = [
    t("certifications.commitment1", "100% traceability of raw materials"),
    t("certifications.commitment2", "Regular third-party audits"),
    t("certifications.commitment3", "Continuous improvement programs"),
    t("certifications.commitment4", "Supplier certification requirements"),
    t("certifications.commitment5", "Environmental impact assessments"),
    t("certifications.commitment6", "Customer satisfaction monitoring"),
  ];

  const getImageForCertification = (cert: { name: string; image_url: string | null }) => {
    if (cert.image_url) return cert.image_url;
    return fallbackImages[cert.name] || null;
  };

  return (
    <Layout>
      <SEO
        title={seoMeta?.title || "Certifications & Quality Standards"}
        description={seoMeta?.description || "View Bio Green Wax Ltd's quality certifications including ISO 9001, ISO 14001, RSPO, FSSC 22000, and ISCC certifications. Committed to quality and sustainability."}
        keywords={seoMeta?.keywords || "ISO 9001, ISO 14001, RSPO certified, FSSC 22000, ISCC EU, ISCC PLUS, quality certifications, oil certifications, wax certifications"}
        url="/certifications"
        noindex={seoMeta?.no_index}
      />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Certifications', url: '/certifications' }]} />
      {/* Hero - Compact */}
      <section className="gradient-primary text-primary-foreground py-4 md:py-6">
        <div className="container-wide">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-1 md:mb-2">
            {t("certifications.title", "Our Certifications")}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90 max-w-2xl">
            {t("certifications.subtitle", "Quality, sustainability, and safety are at the core of everything we do. Our certifications reflect our commitment to excellence.")}
          </p>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-wide">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 md:mb-4">
              {t("certifications.industryStandards", "Industry-Leading Standards")}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              {t("certifications.industryStandardsDesc", "We maintain multiple certifications to ensure our products meet the highest quality, safety, and sustainability standards.")}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-3 md:p-6 border">
                  <Skeleton className="w-16 h-16 md:w-32 md:h-32 mx-auto mb-2 md:mb-4" />
                  <Skeleton className="h-3 md:h-4 w-16 md:w-24 mx-auto mb-1 md:mb-2" />
                  <Skeleton className="h-4 md:h-6 w-24 md:w-40 mx-auto mb-1 md:mb-2" />
                  <Skeleton className="h-10 md:h-16 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-destructive text-sm md:text-base">{t("certifications.failed", "Failed to load certifications. Please try again later.")}</p>
            </div>
          ) : certifications && certifications.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
              {certifications.map((cert) => {
                const imageUrl = getImageForCertification(cert);
                return (
                  <div
                    key={cert.id}
                    className="bg-white rounded-xl p-3 md:p-6 border shadow-sm card-hover flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 md:w-32 md:h-32 mb-2 md:mb-4 flex items-center justify-center">
                      {imageUrl ? (
                        <OptimizedImage
                          src={imageUrl}
                          alt={`${cert.name} certification badge`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center">
                          <Award className="h-6 w-6 md:h-12 md:w-12 text-primary" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] md:text-sm font-medium text-accent mb-0.5 md:mb-1">
                      {cert.name}
                    </span>
                    <h3 className="text-xs sm:text-sm md:text-xl font-heading font-semibold mb-1 md:mb-2 line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground text-[10px] md:text-sm line-clamp-3 md:line-clamp-none">
                      {cert.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <Award className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-2 md:mb-4" />
              <p className="text-muted-foreground text-sm md:text-base">{t("certifications.noCertifications", "No certifications available at the moment.")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-6 md:py-12 lg:py-16 bg-muted/30">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 md:mb-4">
                {t("certifications.ourCommitment", "Our Quality Commitment")}
              </h2>
              <p className="text-muted-foreground mb-4 md:mb-8 text-xs sm:text-sm md:text-base">
                {t("certifications.commitmentDesc", "Beyond certifications, we maintain rigorous internal standards to ensure every product we deliver meets your expectations. Our commitment to quality extends throughout our entire supply chain.")}
              </p>
              <ul className="space-y-2 md:space-y-3">
                {commitments.map((commitment) => (
                  <li key={commitment} className="flex items-center gap-2 md:gap-3">
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base">{commitment}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-8 border">
              <h3 className="text-sm sm:text-base md:text-xl font-heading font-semibold mb-2 md:mb-4">
                Request Documentation
              </h3>
              <p className="text-muted-foreground mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
                Need copies of our certifications or compliance documentation for your 
                records? We're happy to provide them.
              </p>
              <Button asChild size="sm" className="text-xs md:text-sm">
                <Link to="/contact?type=general">Request Certificates</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-wide text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 md:mb-4">
            {t("certifications.cta.title", "Questions About Our Standards?")}
          </h2>
          <p className="text-muted-foreground mb-4 md:mb-8 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
            {t("certifications.cta.subtitle", "Our quality team is here to answer any questions about our certifications and quality processes.")}
          </p>
          <Button asChild size="sm" className="text-xs md:text-sm">
            <Link to={getLocalizedPath("/contact")}>{t("certifications.cta.button", "Contact Our Team")}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Certifications;
