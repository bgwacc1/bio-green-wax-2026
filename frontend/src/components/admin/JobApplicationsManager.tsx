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
import { Loader2, Eye, Trash2, Download, Mail, MailOpen, FileText, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  useJobApplications,
  useMarkApplicationRead,
  useDeleteJobApplication,
  JobApplication,
} from "@/hooks/useJobApplications";

const JobApplicationsManager = () => {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const { data: applications, isLoading } = useJobApplications();
  const markReadMutation = useMarkApplicationRead();
  const deleteMutation = useDeleteJobApplication();

  const handleViewApplication = async (application: JobApplication) => {
    setSelectedApplication(application);
    if (!application.is_read) {
      await markReadMutation.mutateAsync({ id: application.id, is_read: true });
    }
  };

  const handleDownloadCV = async (application: JobApplication) => {
    if (!application.cv_url) return;

    try {
      // For base64 URLs or direct URLs
      if (application.cv_url.startsWith('data:')) {
        const response = await fetch(application.cv_url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = application.cv_filename || 'cv.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Regular URL download
        const a = document.createElement('a');
        a.href = application.cv_url;
        a.download = application.cv_filename || 'cv.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading CV:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      await deleteMutation.mutateAsync(id);
      setSelectedApplication(null);
    }
  };

  const unreadCount = applications?.filter((a) => !a.is_read).length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {applications?.length || 0} application(s)
          </p>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-[10px] sm:text-xs">{unreadCount} unread</Badge>
          )}
        </div>
      </div>

      {applications && applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((application) => (
            <div
              key={application.id}
              className={`border rounded-lg p-3 sm:p-4 bg-card hover:shadow-sm transition-shadow ${
                !application.is_read ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {application.is_read ? (
                    <MailOpen className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  ) : (
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {application.full_name}
                    </h3>
                    {application.is_general_application ? (
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">General</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] sm:text-xs">
                        {application.job_opening?.title || "Unknown"}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {application.email}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(application.created_at), "MMM d, yyyy")}
                    </span>
                    {application.cv_url && (
                      <span className="flex items-center gap-1 text-primary">
                        <FileText className="h-3 w-3" />
                        CV attached
                      </span>
                    )}
                  </div>

                  {/* Mobile actions */}
                  <div className="flex sm:hidden items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewApplication(application)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    {application.cv_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCV(application)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(application.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Desktop actions */}
                <div className="hidden sm:flex items-start gap-1 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewApplication(application)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {application.cv_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadCV(application)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(application.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">No applications yet</p>
        </div>
      )}

      <Dialog
        open={!!selectedApplication}
        onOpenChange={() => setSelectedApplication(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {selectedApplication?.is_general_application
                ? "General Application"
                : `Application for ${selectedApplication?.job_opening?.title || "Unknown Position"}`}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p>{selectedApplication.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p>{selectedApplication.email}</p>
                </div>
                {selectedApplication.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phone
                    </p>
                    <p>{selectedApplication.phone}</p>
                  </div>
                )}
                {selectedApplication.current_company && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Company
                    </p>
                    <p>{selectedApplication.current_company}</p>
                  </div>
                )}
                {selectedApplication.current_position && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Position
                    </p>
                    <p>{selectedApplication.current_position}</p>
                  </div>
                )}
                {selectedApplication.experience_years && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Experience
                    </p>
                    <p>{selectedApplication.experience_years} years</p>
                  </div>
                )}
                {selectedApplication.linkedin_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      LinkedIn
                    </p>
                    <a
                      href={selectedApplication.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </div>

              {selectedApplication.cover_letter && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Cover Letter
                  </p>
                  <p className="whitespace-pre-wrap bg-muted/30 p-4 rounded-lg text-sm">
                    {selectedApplication.cover_letter}
                  </p>
                </div>
              )}

              {selectedApplication.why_suitable && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Why They Are Suitable
                  </p>
                  <p className="whitespace-pre-wrap bg-muted/30 p-4 rounded-lg text-sm">
                    {selectedApplication.why_suitable}
                  </p>
                </div>
              )}

              {selectedApplication.value_addition && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Value Addition to Company
                  </p>
                  <p className="whitespace-pre-wrap bg-muted/30 p-4 rounded-lg text-sm">
                    {selectedApplication.value_addition}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={selectedApplication.email_sent ? "default" : "secondary"}>
                    {selectedApplication.email_sent ? "Email Sent" : "Email Pending"}
                  </Badge>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Submitted {format(new Date(selectedApplication.created_at), "PPp")}
                  </span>
                </div>
                {selectedApplication.cv_url && (
                  <Button onClick={() => handleDownloadCV(selectedApplication)} size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobApplicationsManager;