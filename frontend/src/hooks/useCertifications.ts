import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

export interface Certification {
  id: string;
  name: string;
  title: string;
  description: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

export const useCertifications = (lang = 'en') => {
  return useQuery({
    queryKey: ["certifications", lang],
    queryFn: async () => {
      return apiClient.get<Certification[]>(`/api/certifications?active_only=true&lang=${lang}`);
    },
  });
};
