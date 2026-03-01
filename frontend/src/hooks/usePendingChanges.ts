import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "sonner";

export interface PendingChange {
  id: string;
  table_name: string;
  record_id: string | null;
  change_type: "create" | "update" | "delete";
  original_data: unknown | null;
  new_data: unknown | null;
  status: "pending" | "approved" | "rejected" | "revision_requested";
  revision_notes: string | null;
  created_by: string;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

export const usePendingChanges = (status?: string) => {
  return useQuery({
    queryKey: ["pending-changes", status],
    queryFn: async (): Promise<PendingChange[]> => {
      try {
        const endpoint = status 
          ? `/api/pending-changes?status=${encodeURIComponent(status)}`
          : "/api/pending-changes";
        return await apiClient.get<PendingChange[]>(endpoint);
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useMyPendingChanges = () => {
  return useQuery({
    queryKey: ["my-pending-changes"],
    queryFn: async (): Promise<PendingChange[]> => {
      try {
        return await apiClient.get<PendingChange[]>("/api/pending-changes/my");
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePendingChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tableName,
      recordId,
      changeType,
      originalData,
      newData,
    }: {
      tableName: string;
      recordId?: string;
      changeType: "create" | "update" | "delete";
      originalData?: unknown;
      newData?: unknown;
    }) => {
      return apiClient.post<PendingChange>("/api/pending-changes", {
        table_name: tableName,
        record_id: recordId || null,
        change_type: changeType,
        original_data: originalData || null,
        new_data: newData || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
      toast.success("Change submitted for approval");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdatePendingChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      newData,
    }: {
      id: string;
      newData: unknown;
    }) => {
      return apiClient.put<PendingChange>(`/api/pending-changes/${id}`, newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
      toast.success("Change updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useReviewPendingChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
      revisionNotes,
    }: {
      id: string;
      action: "approve" | "reject" | "request_revision";
      revisionNotes?: string;
    }) => {
      return apiClient.put<PendingChange>(`/api/pending-changes/${id}/review`, {
        action,
        revision_notes: revisionNotes || null,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
      
      const messages = {
        approved: "Change approved and applied",
        rejected: "Change rejected",
        revision_requested: "Revision requested",
      };
      toast.success(messages[data.status as keyof typeof messages] || "Review submitted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useApplyPendingChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (change: PendingChange) => {
      // The backend handles applying changes when approved
      // This is just for deleting the pending change after manual apply
      await apiClient.delete(`/api/pending-changes/${change.id}`);
      return change;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Change applied successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to apply change: ${error.message}`);
    },
  });
};

export const useDeletePendingChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/pending-changes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
      toast.success("Pending change deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
