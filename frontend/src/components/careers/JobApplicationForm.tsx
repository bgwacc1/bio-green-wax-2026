import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, CheckCircle, X } from "lucide-react";
import { useSubmitJobApplication, useSendApplicationEmail } from "@/hooks/useJobApplications";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

interface JobApplicationFormProps {
  jobId?: string;
  jobTitle?: string;
  isGeneralApplication?: boolean;
  onSuccess?: () => void;
}

const JobApplicationForm = ({
  jobId,
  jobTitle,
  isGeneralApplication = false,
  onSuccess,
}: JobApplicationFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    current_company: "",
    current_position: "",
    experience_years: "",
    linkedin_url: "",
    cover_letter: "",
    why_suitable: "",
    value_addition: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitMutation = useSubmitJobApplication();
  const sendEmailMutation = useSendApplicationEmail();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let cvUrl: string | undefined;
      let cvFilename: string | undefined;

      // Upload CV if provided - convert to base64
      if (cvFile) {
        cvFilename = cvFile.name;
        cvUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(cvFile);
        });
      }

      // Submit application
      const applicationData = {
        job_opening_id: isGeneralApplication ? null : jobId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        current_company: formData.current_company || undefined,
        current_position: formData.current_position || undefined,
        experience_years: formData.experience_years
          ? parseInt(formData.experience_years)
          : undefined,
        linkedin_url: formData.linkedin_url || undefined,
        cover_letter: formData.cover_letter || undefined,
        why_suitable: formData.why_suitable || undefined,
        value_addition: formData.value_addition || undefined,
        cv_url: cvUrl,
        cv_filename: cvFilename,
        is_general_application: isGeneralApplication,
      };

      const application = await submitMutation.mutateAsync(applicationData);

      if (!application?.id) {
        throw new Error("Failed to create application - no ID returned");
      }

      // Application saved successfully - show success immediately
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
      onSuccess?.();

      // Send email notification in the background (non-blocking)
      // This won't affect the user experience if it fails
      sendEmailMutation.mutate({
        applicationId: application.id,
        applicantName: formData.full_name,
        applicantEmail: formData.email,
        applicantPhone: formData.phone || undefined,
        currentCompany: formData.current_company || undefined,
        currentPosition: formData.current_position || undefined,
        experienceYears: formData.experience_years
          ? parseInt(formData.experience_years)
          : undefined,
        linkedinUrl: formData.linkedin_url || undefined,
        coverLetter: formData.cover_letter || undefined,
        whySuitable: formData.why_suitable || undefined,
        valueAddition: formData.value_addition || undefined,
        cvUrl: cvUrl,
        cvFilename: cvFilename,
        jobTitle: isGeneralApplication ? undefined : jobTitle,
        isGeneralApplication,
      });
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(`Failed to submit application: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-heading font-bold mb-2">
          {t("careers.form.submitted", "Application Submitted!")}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t("careers.form.submittedDesc", "Thank you for your interest in joining Bio Green Wax. We have received your application and will review it shortly. If your profile matches our requirements, we will get in touch with you.")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t("careers.form.fullName", "Full Name")} *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("careers.form.email", "Email")} *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("careers.form.phone", "Phone")}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">{t("careers.form.linkedin", "LinkedIn Profile URL")}</Label>
          <Input
            id="linkedin_url"
            type="url"
            value={formData.linkedin_url}
            onChange={(e) =>
              setFormData({ ...formData, linkedin_url: e.target.value })
            }
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_company">{t("careers.form.currentCompany", "Current Company")}</Label>
          <Input
            id="current_company"
            value={formData.current_company}
            onChange={(e) =>
              setFormData({ ...formData, current_company: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_position">{t("careers.form.currentPosition", "Current Position")}</Label>
          <Input
            id="current_position"
            value={formData.current_position}
            onChange={(e) =>
              setFormData({ ...formData, current_position: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience_years">{t("careers.form.yearsExp", "Years of Experience")}</Label>
          <Input
            id="experience_years"
            type="number"
            min="0"
            max="50"
            value={formData.experience_years}
            onChange={(e) =>
              setFormData({ ...formData, experience_years: e.target.value })
            }
          />
        </div>
      </div>

      {!isGeneralApplication && (
        <div className="space-y-2">
          <Label htmlFor="why_suitable">
            {t("careers.form.whySuitable", "Why are you suitable for this role?")} *
          </Label>
          <Textarea
            id="why_suitable"
            value={formData.why_suitable}
            onChange={(e) =>
              setFormData({ ...formData, why_suitable: e.target.value })
            }
            rows={4}
            placeholder={t("careers.form.whySuitablePlaceholder", "Describe your relevant experience and skills that make you a good fit for this position...")}
            required
          />
        </div>
      )}

      {isGeneralApplication && (
        <>
          <div className="space-y-2">
            <Label htmlFor="value_addition">
              {t("careers.form.whyInterested", "Why are you interested in joining Bio Green Wax?")} *
            </Label>
            <Textarea
              id="value_addition"
              value={formData.value_addition}
              onChange={(e) =>
                setFormData({ ...formData, value_addition: e.target.value })
              }
              rows={4}
              placeholder={t("careers.form.whyInterestedPlaceholder", "Tell us about your interest in our company and industry...")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="why_suitable">
              {t("careers.form.valueAddition", "What value can you bring to the company?")} *
            </Label>
            <Textarea
              id="why_suitable"
              value={formData.why_suitable}
              onChange={(e) =>
                setFormData({ ...formData, why_suitable: e.target.value })
              }
              rows={4}
              placeholder={t("careers.form.valueAdditionPlaceholder", "Describe your skills, experience, and how you can contribute to Bio Green Wax...")}
              required
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="cover_letter">{t("careers.form.coverLetter", "Cover Letter (Optional)")}</Label>
        <Textarea
          id="cover_letter"
          value={formData.cover_letter}
          onChange={(e) =>
            setFormData({ ...formData, cover_letter: e.target.value })
          }
          rows={4}
          placeholder={t("careers.form.coverLetterPlaceholder", "Any additional information you'd like to share...")}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("careers.form.uploadCV", "Upload CV/Resume")} *</Label>
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
              {cvFile ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm">{cvFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setCvFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t("careers.form.uploadCVDesc", "Click to upload CV (PDF or Word, max 10MB)")}
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required={!cvFile}
            />
          </label>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("careers.form.submitting", "Submitting...")}
          </>
        ) : (
          t("careers.form.submit", "Submit Application")
        )}
      </Button>
    </form>
  );
};

export default JobApplicationForm;
