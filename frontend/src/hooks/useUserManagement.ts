import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  roles: string[];
}

interface ListUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  perPage: number;
}

export const useAdminUsers = (page = 1, perPage = 20, search = "") => {
  return useQuery({
    queryKey: ["admin-users", page, perPage, search],
    queryFn: async (): Promise<ListUsersResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (search) {
        params.set("search", search);
      }
      return apiClient.get<ListUsersResponse>(`/api/admin/users?${params.toString()}`);
    },
    staleTime: 30000,
  });
};

export const useManageUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      userId,
      role,
    }: {
      action: "add" | "remove";
      userId: string;
      role: "admin" | "content_creator";
    }) => {
      return apiClient.put(`/api/admin/users/${userId}/role?action=${action}&role=${role}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(
        variables.action === "add"
          ? `${variables.role} role added successfully`
          : `${variables.role} role removed successfully`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      role,
    }: {
      email: string;
      password: string;
      role?: "admin" | "content_creator";
    }) => {
      return apiClient.post("/api/admin/users", { email, password, role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return apiClient.delete(`/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      email,
      password,
    }: {
      userId: string;
      email?: string;
      password?: string;
    }) => {
      return apiClient.put(`/api/admin/users/${userId}`, { email, password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
