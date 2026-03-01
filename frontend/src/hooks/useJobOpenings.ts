import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "sonner";

export interface JobOpening {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  employment_type: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface JobOpeningInput {
  title: string;
  department?: string;
  location?: string;
  type?: string;
  employment_type?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  is_active?: boolean;
  display_order?: number;
}

export const useJobOpenings = (activeOnly = false, lang = 'en') => {
  return useQuery({
    queryKey: ["job-openings", activeOnly, lang],
    queryFn: async () => {
      return apiClient.get<JobOpening[]>(`/api/job-openings?active_only=${activeOnly}&lang=${lang}`);
    },
  });
};

export const useCreateJobOpening = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: JobOpeningInput) => {
      return apiClient.post<JobOpening>("/api/job-openings", input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-openings"] });
      toast.success("Job opening created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create job opening: ${error.message}`);
    },
  });
};

export const useUpdateJobOpening = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...input }: JobOpeningInput & { id: string }) => {
      return apiClient.put<JobOpening>(`/api/job-openings/${id}`, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-openings"] });
      toast.success("Job opening updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update job opening: ${error.message}`);
    },
  });
};

export const useDeleteJobOpening = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/job-openings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-openings"] });
      toast.success("Job opening deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete job opening: ${error.message}`);
    },
  });
};
