import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, GripVertical, Award } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  title: string;
  description: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface CertificationFormData {
  name: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const CertificationsManager = () => {
  const queryClient = useQueryClient();
  const { isAdmin, isContentCreator } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [formData, setFormData] = useState<CertificationFormData>({
    name: "",
    title: "",
    description: "",
    image_url: "",
    display_order: 0,
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);

  const { data: certifications, isLoading } = useQuery({
    queryKey: ["certifications-admin"],
    queryFn: async () => {
      return apiClient.get<Certification[]>("/api/certifications?active_only=false");
    },
  });

  const createPendingChange = async (
    tableName: string,
    changeType: "create" | "update" | "delete",
    recordId?: string,
    originalData?: unknown,
    newData?: unknown
  ) => {
    return apiClient.post("/api/pending-changes", {
      table_name: tableName,
      record_id: recordId || null,
      change_type: changeType,
      original_data: originalData || null,
      new_data: newData || null,
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: CertificationFormData) => {
      if (isAdmin) {
        await apiClient.post("/api/certifications", data);
        return { isPending: false };
      } else if (isContentCreator) {
        await createPendingChange("certifications", "create", undefined, undefined, data);
        return { isPending: true };
      }
      throw new Error("Unauthorized");
    },
    onSuccess: (result) => {
      if (result.isPending) {
        toast.success("Certification submitted for approval");
        queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
        queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
      } else {
        toast.success("Certification created successfully");
        queryClient.invalidateQueries({ queryKey: ["certifications-admin"] });
      }
      resetForm();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: CertificationFormData & { id: string }) => {
      if (isAdmin) {
        await apiClient.put(`/api/certifications/${id}`, data);
        return { isPending: false };
      } else if (isContentCreator) {
        const certs = await apiClient.get<Certification[]>("/api/certifications?active_only=false");
        const currentData = certs.find(c => c.id === id);
        if (!currentData) throw new Error("Certification not found");

        await createPendingChange(
          "certifications",
          "update",
          id,
          currentData,
          { ...currentData, ...data }
        );
        return { isPending: true };
      }
      throw new Error("Unauthorized");
    },
    onSuccess: (result) => {
      if (result.isPending) {
        toast.success("Update submitted for approval");
        queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
        queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
      } else {
        toast.success("Certification updated successfully");
        queryClient.invalidateQueries({ queryKey: ["certifications-admin"] });
      }
      resetForm();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isAdmin) {
        await apiClient.delete(`/api/certifications/${id}`);
        return { isPending: false };
      } else if (isContentCreator) {
        const certs = await apiClient.get<Certification[]>("/api/certifications?active_only=false");
        const currentData = certs.find(c => c.id === id);
        if (!currentData) throw new Error("Certification not found");

        await createPendingChange(
          "certifications",
          "delete",
          id,
          currentData
        );
        return { isPending: true };
      }
      throw new Error("Unauthorized");
    },
    onSuccess: (result) => {
      if (result.isPending) {
        toast.success("Delete request submitted for approval");
        queryClient.invalidateQueries({ queryKey: ["my-pending-changes"] });
        queryClient.invalidateQueries({ queryKey: ["pending-changes"] });
      } else {
        toast.success("Certification deleted");
        queryClient.invalidateQueries({ queryKey: ["certifications-admin"] });
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
        toast.success("Image uploaded successfully");
        setUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to upload image");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error: unknown) {
      toast.error("Failed to upload image");
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      description: "",
      image_url: "",
      display_order: 0,
      is_active: true,
    });
    setEditingCertification(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cert: Certification) => {
    setEditingCertification(cert);
    setFormData({
      name: cert.name,
      title: cert.title,
      description: cert.description || "",
      image_url: cert.image_url || "",
      display_order: cert.display_order || 0,
      is_active: cert.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCertification) {
      updateMutation.mutate({ id: editingCertification.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading certifications...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-white rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Certifications Management</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage certification badges displayed on the website
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCertification ? "Edit Certification" : "Add Certification"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Internal)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., iso-9001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title (Display)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., ISO 9001:2015"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the certification"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-16 h-16 object-contain border rounded"
                    />
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: Square image, min 200x200px
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || uploading}
                >
                  {editingCertification ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Certifications List */}
      <div className="space-y-3">
        {certifications?.map((cert) => (
          <div
            key={cert.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 bg-card ${
              !cert.is_active ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {cert.image_url ? (
                <img
                  src={cert.image_url}
                  alt={cert.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded flex items-center justify-center">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-sm sm:text-base">{cert.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{cert.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(cert)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this certification?")) {
                    deleteMutation.mutate(cert.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsManager;
