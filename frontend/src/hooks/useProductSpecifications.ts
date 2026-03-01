import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface ProductSpecification {
  id: string;
  product_id: string;
  name: string | null;
  file_name: string;
  file_url: string;
  file_path: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export const useProductSpecifications = (productId?: string) => {
  return useQuery({
    queryKey: ["product-specifications", productId],
    queryFn: async () => {
      try {
        const endpoint = productId 
          ? `/api/product-specifications?product_id=${productId}`
          : "/api/product-specifications";
        return await apiClient.get<ProductSpecification[]>(endpoint);
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useUploadSpecification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      productId,
      name,
      file,
    }: {
      productId: string;
      name: string;
      file: File;
    }) => {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // Create the specification record
      return apiClient.post<ProductSpecification>("/api/product-specifications", {
        product_id: productId,
        file_name: file.name,
        name,
        file_url: base64,
        file_path: null,
        file_size: file.size,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-specifications"] });
      toast({
        title: "Success",
        description: "Specification uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSpecification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (spec: ProductSpecification) => {
      return apiClient.delete(`/api/product-specifications/${spec.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-specifications"] });
      toast({
        title: "Success",
        description: "Specification deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const getSpecificationUrl = (fileUrl: string) => {
  return fileUrl;
};

export const downloadSpecification = async (spec: ProductSpecification) => {
  try {
    // If it's a base64 URL, create a blob and download
    if (spec.file_url.startsWith('data:')) {
      const response = await fetch(spec.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = spec.name || spec.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // Regular URL download
      const link = document.createElement("a");
      link.href = spec.file_url;
      link.download = spec.name || spec.file_name;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};
