import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, X, Layers } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Sector {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

const availableIcons = [
  "Flame", "Sparkles", "UtensilsCrossed", "Package", "Shirt", "Cog",
  "Factory", "Droplet", "Leaf", "Zap", "Building2", "Truck",
  "Beaker", "Pill", "Heart", "Sun", "Moon", "Star"
];

const colorOptions = [
  { value: "bg-orange-500/10 text-orange-600", label: "Orange" },
  { value: "bg-pink-500/10 text-pink-600", label: "Pink" },
  { value: "bg-green-500/10 text-green-600", label: "Green" },
  { value: "bg-blue-500/10 text-blue-600", label: "Blue" },
  { value: "bg-purple-500/10 text-purple-600", label: "Purple" },
  { value: "bg-gray-500/10 text-gray-600", label: "Gray" },
  { value: "bg-red-500/10 text-red-600", label: "Red" },
  { value: "bg-yellow-500/10 text-yellow-600", label: "Yellow" },
  { value: "bg-teal-500/10 text-teal-600", label: "Teal" },
  { value: "bg-indigo-500/10 text-indigo-600", label: "Indigo" },
];

const uploadSectorImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const SectorsManager = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Cog",
    color: "bg-gray-500/10 text-gray-600",
    image_url: "",
    is_active: true,
  });

  const { data: sectors, isLoading } = useQuery({
    queryKey: ["admin-sectors"],
    queryFn: async () => {
      return apiClient.get<Sector[]>("/api/sectors?active_only=false");
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const maxOrder = sectors?.reduce((max, s) => Math.max(max, s.display_order || 0), 0) || 0;
      return apiClient.post("/api/sectors", {
        ...data,
        display_order: maxOrder + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sectors"] });
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast.success("Sector created successfully");
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create sector: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      return apiClient.put(`/api/sectors/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sectors"] });
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast.success("Sector updated successfully");
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update sector: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/api/sectors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sectors"] });
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast.success("Sector deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete sector: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "Cog",
      color: "bg-gray-500/10 text-gray-600",
      image_url: "",
      is_active: true,
    });
    setEditingSector(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setFormData({
      name: sector.name,
      slug: sector.slug,
      description: sector.description || "",
      icon: sector.icon,
      color: sector.color,
      image_url: sector.image_url || "",
      is_active: sector.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadSectorImage(file);
      setFormData({ ...formData, image_url: url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSector) {
      updateMutation.mutate({ id: editingSector.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const getIconComponent = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading sectors...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-white rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Sectors Management</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage industry sectors displayed on the homepage
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Sector
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSector ? "Edit Sector" : "Add New Sector"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingSector ? formData.slug : generateSlug(e.target.value),
                    });
                  }}
                  placeholder="Sector name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL path)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="sector-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the sector"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {getIconComponent(formData.icon)}
                          <span>{formData.icon}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {getIconComponent(icon)}
                            <span>{icon}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {colorOptions.find((c) => c.value === formData.color)?.label}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.value.split(" ")[0]}`} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Sector Image</Label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {formData.image_url ? (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                      <img
                        src={formData.image_url}
                        alt="Sector preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors flex-shrink-0"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Click to upload an image for this sector. Recommended size: 800x600px
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingSector ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sectors List */}
      <div className="grid gap-3 sm:gap-4">
        {sectors?.map((sector) => (
          <div
            key={sector.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 bg-card ${
              !sector.is_active ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${sector.color}`}>
                {getIconComponent(sector.icon)}
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base">{sector.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">/{sector.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(sector)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Sector</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{sector.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMutation.mutate(sector.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorsManager;
