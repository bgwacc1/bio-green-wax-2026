import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Briefcase, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useJobOpenings, JobOpening } from "@/hooks/useJobOpenings";
import JobApplicationForm from "./JobApplicationForm";
import { useLanguage } from "@/i18n/LanguageContext";

const JobListings = () => {
  const { t, currentLanguage } = useLanguage();
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Pass language to hook - translations are automatically merged by API
  const { data: jobs, isLoading } = useJobOpenings(true, currentLanguage);

  const translateEmploymentType = (type: string) => {
    const typeMap: Record<string, string> = {
      'Permanent': t("careers.employmentType.permanent", "Permanent"),
      'Full-time': t("careers.employmentType.fullTime", "Full-time"),
      'Part-time': t("careers.employmentType.partTime", "Part-time"),
      'Contract': t("careers.employmentType.contract", "Contract"),
      'Temporary': t("careers.employmentType.temporary", "Temporary"),
      'Internship': t("careers.employmentType.internship", "Internship"),
    };
    return typeMap[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-12">
        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-wide">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-2 md:mb-4">{t("careers.currentOpenings", "Current Openings")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
              {t("careers.currentOpeningsDesc", "Explore our current job opportunities and find your perfect role at Bio Green Wax.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="card-hover bg-white">
                <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base md:text-xl">{job.title}</CardTitle>
                    <Badge className="text-[10px] md:text-xs shrink-0">{translateEmploymentType(job.employment_type)}</Badge>
                  </div>
                  <CardDescription className="flex flex-wrap gap-2 md:gap-3 mt-1 md:mt-2">
                    {job.department && (
                      <span className="flex items-center gap-1 text-[10px] md:text-sm">
                        <Briefcase className="h-3 w-3 md:h-4 md:w-4" />
                        {job.department}
                      </span>
                    )}
                    {job.location && (
                      <span className="flex items-center gap-1 text-[10px] md:text-sm">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                        {job.location}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 mb-2 md:mb-4">
                    {job.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs md:text-sm"
                    onClick={() => setSelectedJob(job)}
                  >
                    {t("careers.viewDetails", "View Details")}
                    <ArrowRight className="ml-1.5 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob && !showApplicationForm} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap gap-4 mt-2">
                  <Badge variant="secondary">{translateEmploymentType(selectedJob.employment_type)}</Badge>
                  {selectedJob.department && (
                    <span className="flex items-center gap-1 text-sm">
                      <Briefcase className="h-4 w-4" />
                      {selectedJob.department}
                    </span>
                  )}
                  {selectedJob.location && (
                    <span className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      {selectedJob.location}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">{t("careers.aboutRole", "About the Role")}</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedJob.description}
                  </p>
                </div>

                {selectedJob.responsibilities && (
                  <div>
                    <h3 className="font-semibold mb-2">{t("careers.responsibilities", "Responsibilities")}</h3>
                    <div className="text-muted-foreground whitespace-pre-wrap">
                      {(selectedJob.responsibilities || '').split("\n").map((item, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob.requirements && (
                  <div>
                    <h3 className="font-semibold mb-2">{t("careers.requirements", "Requirements")}</h3>
                    <div className="text-muted-foreground whitespace-pre-wrap">
                      {(() => {
                        const reqText = typeof selectedJob.requirements === 'string' ? selectedJob.requirements : String(selectedJob.requirements || '');
                        return reqText.split("\n").map((item, i) => (
                          <div key={i} className="flex items-start gap-2 mb-1">
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setShowApplicationForm(true)}
                >
                  {t("careers.applyNow", "Apply Now")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Form Dialog */}
      <Dialog
        open={showApplicationForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("careers.applyFor", "Apply for")} {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              {t("careers.completeForm", "Complete the form below to submit your application")}
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <JobApplicationForm
              jobId={selectedJob.id}
              jobTitle={selectedJob.title}
              onSuccess={() => {
                setShowApplicationForm(false);
                setSelectedJob(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobListings;
