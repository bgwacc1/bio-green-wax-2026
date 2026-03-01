import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Types for hero slides
export interface HeroSlideData {
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

// Helper to create a pending change
const createPendingChange = async ({
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
  return apiClient.post("/api/pending-changes", {
    table_name: tableName,
    record_id: recordId || null,
    change_type: changeType,
    original_data: originalData || null,
    new_data: newData || null,
  });
};

// Role-aware create hero slide hook
export const useCreateHeroSlideWithApproval = () => {
  const queryClient = useQueryClient();
  const { isContentCreator, isAdmin } = useAuth();

  return useMutation({
    mutationFn: async (slide: HeroSlideData) => {
      if (isAdmin) {
        // Admins can save directly
        const data = await apiClient.post("/api/hero-slides", slide);
        return { data, isPending: false };
      } else if (isContentCreator) {
        // Content creators create pending changes
        const pendingChange = await createPendingChange({
          tableName: "hero_slides",
          changeType: "create",
          newData: slide,
        });
        return { data: pendingChange, isPending: true };
      } else {
        throw new Error("Unauthorized");
      }
    },
    onSuccess: (result) => {
      if (result.isPending) {
        queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
        queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
        toast.success("Change submitted for approval");
      } else {
        queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
        toast.success("Hero slide created successfully");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Role-aware update hero slide hook
export const useUpdateHeroSlideWithApproval = () => {
  const queryClient = useQueryClient();
  const { isContentCreator, isAdmin } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HeroSlideData> & { id: string }) => {
      if (isAdmin) {
        // Admins can update directly
        const data = await apiClient.put(`/api/hero-slides/${id}`, updates);
        return { data, isPending: false };
      } else if (isContentCreator) {
        // Fetch current data for the record
        const heroSlides = await apiClient.get<HeroSlideData[]>(`/api/hero-slides?active_only=false`);
        const currentData = heroSlides.find((s: { id: string }) => s.id === id);
        
        if (!currentData) throw new Error("Hero slide not found");

        // Create pending change with original and new data
        const newData = { ...currentData, ...updates };
        const pendingChange = await createPendingChange({
          tableName: "hero_slides",
          recordId: id,
          changeType: "update",
          originalData: currentData,
          newData: newData,
        });
        return { data: pendingChange, isPending: true };
      } else {
        throw new Error("Unauthorized");
      }
    },
    onSuccess: (result) => {
      if (result.isPending) {
        queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
        queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
        toast.success("Change submitted for approval");
      } else {
        queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
        toast.success("Hero slide updated successfully");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Role-aware delete hero slide hook
export const useDeleteHeroSlideWithApproval = () => {
  const queryClient = useQueryClient();
  const { isContentCreator, isAdmin } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (isAdmin) {
        // Admins can delete directly
        await apiClient.delete(`/api/hero-slides/${id}`);
        return { isPending: false };
      } else if (isContentCreator) {
        // Fetch current data for the record
        const heroSlides = await apiClient.get<HeroSlideData[]>(`/api/hero-slides?active_only=false`);
        const currentData = heroSlides.find((s: { id: string }) => s.id === id);

        if (!currentData) throw new Error("Hero slide not found");

        // Create pending change for deletion
        await createPendingChange({
          tableName: "hero_slides",
          recordId: id,
          changeType: "delete",
          originalData: currentData,
        });
        return { isPending: true };
      } else {
        throw new Error("Unauthorized");
      }
    },
    onSuccess: (result) => {
      if (result.isPending) {
        queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
        queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
        toast.success("Delete request submitted for approval");
      } else {
        queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
        toast.success("Hero slide deleted successfully");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
