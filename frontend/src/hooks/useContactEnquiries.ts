import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const useContactEnquiries = () => {
  return useQuery({
    queryKey: ["contact-enquiries"],
    queryFn: async () => {
      return apiClient.get<ContactEnquiry[]>("/api/contact-enquiries");
    },
  });
};

export const useMarkEnquiryRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      return apiClient.put(`/api/contact-enquiries/${id}/read?is_read=${is_read}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-enquiries"] });
    },
    onError: (error) => {
      console.error("Error updating enquiry:", error);
      toast({
        title: "Error",
        description: "Failed to update enquiry status",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteContactEnquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/contact-enquiries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-enquiries"] });
      toast({
        title: "Success",
        description: "Enquiry deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting enquiry:", error);
      toast({
        title: "Error",
        description: "Failed to delete enquiry",
        variant: "destructive",
      });
    },
  });
};

export const useSubmitContactEnquiry = () => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
      subject: string;
      message: string;
    }) => {
      const result = await apiClient.post<ContactEnquiry>("/api/contact-enquiries", {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        subject: data.subject,
        message: data.message,
      });
      return { success: true, id: result.id };
    },
    onError: (error) => {
      console.error("Error submitting enquiry:", error);
    },
  });
};
