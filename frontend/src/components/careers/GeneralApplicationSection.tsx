import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Mail, ArrowRight } from "lucide-react";
import { useJobOpenings } from "@/hooks/useJobOpenings";
import JobApplicationForm from "./JobApplicationForm";
import { useLanguage } from "@/i18n/LanguageContext";

interface GeneralApplicationSectionProps {
  showAsMainContent?: boolean;
}

const GeneralApplicationSection = ({ showAsMainContent = false }: GeneralApplicationSectionProps) => {
  const { t, currentLanguage } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const { data: jobs } = useJobOpenings(true, currentLanguage);
  
  const hasJobs = jobs && jobs.length > 0;

  if (showAsMainContent) {
    // Show as main content when there are no jobs
    return (
      <section className="py-6 md:py-12 lg:py-16 bg-muted/30">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center mb-4 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
              <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 md:mb-4">
              {t("careers.loveToHear", "We'd Love to Hear From You")}
            </h2>
            <p className="text-muted-foreground mb-4 md:mb-8 text-xs sm:text-sm md:text-base">
              {t("careers.loveToHearDesc", "Great talent is always welcome! While we're not actively hiring for specific roles right now, we're excited to connect with passionate individuals who share our vision for sustainable solutions.")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-xl border p-4 md:p-8">
            <h3 className="text-sm sm:text-base md:text-xl font-heading font-semibold mb-2 md:mb-4 text-center">
              {t("careers.submitApplication", "Submit Your Application")}
            </h3>
            <p className="text-muted-foreground text-center mb-4 md:mb-8 text-xs sm:text-sm md:text-base">
              {t("careers.submitApplicationDesc", "Tell us about yourself and why you'd like to join Bio Green Wax. We'll keep your application on file for future opportunities.")}
            </p>
            <JobApplicationForm isGeneralApplication onSuccess={() => setShowForm(false)} />
          </div>
        </div>
      </section>
    );
  }

  // Show as a CTA section when there are jobs
  return (
    <section className="py-6 md:py-12 lg:py-16">
      <div className="container-wide">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-4 md:p-8 lg:p-12">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold mb-2 md:mb-4">
              {t("careers.noPerfectFit", "Don't See a Perfect Fit?")}
            </h2>
            <p className="text-muted-foreground mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
              {t("careers.noPerfectFitDesc", "We're always looking for talented individuals to join our team. Send us your application and tell us how you can contribute to Bio Green Wax.")}
            </p>
            <Button size="sm" className="text-xs md:text-sm" onClick={() => setShowForm(true)}>
              <Mail className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              {t("careers.submitGeneralApplication", "Submit General Application")}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">{t("careers.generalApplication", "General Application")}</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              {t("careers.generalApplicationDesc", "Tell us about yourself and why you'd like to join Bio Green Wax")}
            </DialogDescription>
          </DialogHeader>
          <JobApplicationForm isGeneralApplication onSuccess={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GeneralApplicationSection;
