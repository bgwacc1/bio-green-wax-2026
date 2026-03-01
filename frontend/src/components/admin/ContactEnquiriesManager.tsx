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
import { Loader2, Eye, Trash2, Mail, MailOpen, MessageSquare, Calendar, Building2 } from "lucide-react";
import { format } from "date-fns";
import {
  useContactEnquiries,
  useMarkEnquiryRead,
  useDeleteContactEnquiry,
  ContactEnquiry,
} from "@/hooks/useContactEnquiries";

const ContactEnquiriesManager = () => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);

  const { data: enquiries, isLoading } = useContactEnquiries();
  const markReadMutation = useMarkEnquiryRead();
  const deleteMutation = useDeleteContactEnquiry();

  const handleViewEnquiry = async (enquiry: ContactEnquiry) => {
    setSelectedEnquiry(enquiry);
    if (!enquiry.is_read) {
      await markReadMutation.mutateAsync({ id: enquiry.id, is_read: true });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      await deleteMutation.mutateAsync(id);
      setSelectedEnquiry(null);
    }
  };

  const unreadCount = enquiries?.filter((e) => !e.is_read).length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white rounded-lg p-4 sm:p-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold">Contact Enquiries</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          View and manage enquiries submitted through the contact form
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {enquiries?.length || 0} enquiry(ies)
          </p>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-[10px] sm:text-xs">{unreadCount} unread</Badge>
          )}
        </div>
      </div>

      {enquiries && enquiries.length > 0 ? (
        <div className="space-y-3">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className={`border rounded-lg p-3 sm:p-4 bg-card hover:shadow-sm transition-shadow ${
                !enquiry.is_read ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {enquiry.is_read ? (
                    <MailOpen className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  ) : (
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {enquiry.name}
                    </h3>
                    {!enquiry.is_read && (
                      <Badge variant="default" className="text-[10px] sm:text-xs">New</Badge>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {enquiry.email}
                  </p>

                  <p className="text-xs sm:text-sm font-medium line-clamp-1">
                    {enquiry.subject}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(enquiry.created_at), "MMM d, yyyy")}
                    </span>
                    {enquiry.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {enquiry.company}
                      </span>
                    )}
                  </div>

                  {/* Mobile actions */}
                  <div className="flex sm:hidden items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewEnquiry(enquiry)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(enquiry.id)}
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
                    onClick={() => handleViewEnquiry(enquiry)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(enquiry.id)}
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
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">No enquiries yet</p>
        </div>
      )}

      <Dialog
        open={!!selectedEnquiry}
        onOpenChange={() => setSelectedEnquiry(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {selectedEnquiry &&
                format(new Date(selectedEnquiry.created_at), "PPp")}
            </DialogDescription>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p>{selectedEnquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedEnquiry.email}
                  </a>
                </div>
                {selectedEnquiry.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phone
                    </p>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="text-primary hover:underline"
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                )}
                {selectedEnquiry.company && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Company
                    </p>
                    <p>{selectedEnquiry.company}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Subject
                </p>
                <p className="bg-muted/30 p-3 rounded-lg text-sm">
                  {selectedEnquiry.subject}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Message
                </p>
                <p className="whitespace-pre-wrap bg-muted/30 p-4 rounded-lg text-sm">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.subject)}`}
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                  </Button>
                </a>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactEnquiriesManager;