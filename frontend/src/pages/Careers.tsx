import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Heart, Globe, Mail } from "lucide-react";
import { useJobOpenings } from "@/hooks/useJobOpenings";
import JobListings from "@/components/careers/JobListings";
import GeneralApplicationSection from "@/components/careers/GeneralApplicationSection";
import { SEO, BreadcrumbSchema } from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEOPageMeta } from "@/hooks/useCMS";

const Careers = () => {
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  const { data: seoMeta } = useSEOPageMeta("/careers");
  const { data: jobs, isLoading } = useJobOpenings(true, currentLanguage);
  const hasJobs = !isLoading && jobs && jobs.length > 0;

  const benefits = [
    {
      icon: Users,
      title: t("careers.benefit.greatTeam", "Great Team"),
      description: t("careers.benefit.greatTeamDesc", "Work with passionate professionals who share your commitment to sustainability"),
    },
    {
      icon: Heart,
      title: t("careers.benefit.health", "Health & Wellbeing"),
      description: t("careers.benefit.healthDesc", "Comprehensive health insurance and wellness programs for you and your family"),
    },
    {
      icon: Globe,
      title: t("careers.benefit.globalImpact", "Global Impact"),
      description: t("careers.benefit.globalImpactDesc", "Contribute to sustainable practices that make a difference worldwide"),
    },
    {
      icon: Briefcase,
      title: t("careers.benefit.careerGrowth", "Career Growth"),
      description: t("careers.benefit.careerGrowthDesc", "Continuous learning opportunities and clear paths for advancement"),
    },
  ];

  return (
    <Layout>
      <SEO
        title={seoMeta?.title || "Careers"}
        description={seoMeta?.description || "Join Bio Green Wax Ltd and be part of a growing company committed to sustainable solutions in natural oils and waxes. Explore job opportunities and career growth."}
        keywords={seoMeta?.keywords || "bio green wax careers, oil industry jobs, wax industry jobs, UK jobs, sustainability careers"}
        url="/careers"
        noindex={seoMeta?.no_index}
      />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Careers', url: '/careers' }]} />
      {/* Hero - Compact */}
      <section className="gradient-primary text-primary-foreground py-4 md:py-6">
        <div className="container-wide">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-1 md:mb-2">
            {t("careers.title", "Join Our Team")}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90 max-w-2xl">
            {t("careers.subtitle", "Be part of a growing company committed to sustainable solutions in natural oils and waxes.")}
          </p>
        </div>
      </section>

      {/* Job Listings or General Application - Now at top */}
      {hasJobs ? (
        <>
          <JobListings />
          <GeneralApplicationSection />
        </>
      ) : (
        <GeneralApplicationSection showAsMainContent />
      )}

      {/* Why Join Us - Now at bottom */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-wide">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 md:mb-4">{t("careers.whyJoin", "Why Join Bio Green Wax?")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
              {t("careers.whyJoinDesc", "We're more than just a company – we're a team dedicated to making sustainable products accessible to industries worldwide.")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-xl p-3 md:p-6 border shadow-sm card-hover"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 md:mb-4">
                  <benefit.icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-1 md:mb-2 text-xs sm:text-sm md:text-base">{benefit.title}</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-3 md:line-clamp-none">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-wide text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 md:mb-4">
            {t("careers.haveQuestions", "Have Questions?")}
          </h2>
          <p className="text-muted-foreground mb-4 md:mb-8 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
            {t("careers.haveQuestionsDesc", "Reach out to our HR team for any questions about careers at Bio Green Wax.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
            <Button asChild size="sm" className="text-xs md:text-sm">
              <a href="mailto:hr@biogreenwax.com">
                <Mail className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                hr@biogreenwax.com
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs md:text-sm">
              <Link to={getLocalizedPath("/contact")}>{t("contact.title", "Contact Us")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
