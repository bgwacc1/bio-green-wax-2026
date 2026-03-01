import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "sonner";

export interface JobApplication {
  id: string;
  job_opening_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  current_company: string | null;
  current_position: string | null;
  experience_years: number | null;
  linkedin_url: string | null;
  cover_letter: string | null;
  why_suitable: string | null;
  value_addition: string | null;
  cv_url: string | null;
  cv_filename: string | null;
  is_general_application: boolean;
  email_sent: boolean;
  is_read: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  job_opening?: {
    title: string;
  } | null;
}

export interface JobApplicationInput {
  job_opening_id?: string | null;
  full_name: string;
  email: string;
  phone?: string;
  current_company?: string;
  current_position?: string;
  experience_years?: number;
  linkedin_url?: string;
  cover_letter?: string;
  why_suitable?: string;
  value_addition?: string;
  cv_url?: string;
  cv_filename?: string;
  is_general_application?: boolean;
}

export const useJobApplications = () => {
  return useQuery({
    queryKey: ["job-applications"],
    queryFn: async () => {
      return apiClient.get<JobApplication[]>("/api/job-applications");
    },
  });
};

export const useSubmitJobApplication = () => {
  return useMutation({
    mutationFn: async (input: JobApplicationInput) => {
      return apiClient.post<JobApplication>("/api/job-applications", input);
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit application: ${error.message}`);
    },
  });
};

export const useSendApplicationEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      applicationId: string;
      applicantName: string;
      applicantEmail: string;
      applicantPhone?: string;
      currentCompany?: string;
      currentPosition?: string;
      experienceYears?: number;
      linkedinUrl?: string;
      coverLetter?: string;
      whySuitable?: string;
      valueAddition?: string;
      cvUrl?: string;
      cvFilename?: string;
      jobTitle?: string;
      isGeneralApplication: boolean;
    }) => {
      // Email sending is not implemented in the MySQL backend
      // This would need a separate email service integration
      console.log("Email sending not implemented:", params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
    },
    onError: (error: Error) => {
      console.error("Failed to send email:", error);
    },
  });
};

export const useMarkApplicationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      return apiClient.put(`/api/job-applications/${id}/read?is_read=${is_read}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
    },
  });
};

export const useDeleteJobApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/job-applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      toast.success("Application deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete application: ${error.message}`);
    },
  });
};
