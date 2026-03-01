import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ImageIcon, Loader2 } from "lucide-react";
import {
  useHeroSlides,
  uploadCMSImage,
  HeroSlide,
} from "@/hooks/useCMS";
import {
  useCreateHeroSlideWithApproval,
  useUpdateHeroSlideWithApproval,
  useDeleteHeroSlideWithApproval,
} from "@/hooks/useContentCreatorCMS";

interface SlideFormData {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  display_order: number;
  is_active: boolean;
}

const HeroSlidesManager = () => {
  const { data: slides, isLoading } = useHeroSlides(true);
  const createSlide = useCreateHeroSlideWithApproval();
  const updateSlide = useUpdateHeroSlideWithApproval();
  const deleteSlide = useDeleteHeroSlideWithApproval();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<SlideFormData>({
    title: "",
    subtitle: "",
    cta_text: "",
    cta_link: "",
    display_order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      cta_text: "",
      cta_link: "",
      display_order: slides?.length || 0,
      is_active: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingSlide(null);
  };

  const handleOpenDialog = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || "",
        cta_text: slide.cta_text || "",
        cta_link: slide.cta_link || "",
        display_order: slide.display_order,
        is_active: slide.is_active,
      });
      setImagePreview(slide.image_url);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = editingSlide?.image_url || "";

      if (imageFile) {
        imageUrl = await uploadCMSImage(imageFile, "hero-slides");
      }

      if (!imageUrl && !editingSlide) {
        throw new Error("Please upload an image for the slide");
      }

      const slideData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        cta_text: formData.cta_text || null,
        cta_link: formData.cta_link || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
        image_url: imageUrl,
      };

      if (editingSlide) {
        await updateSlide.mutateAsync({ id: editingSlide.id, ...slideData });
      } else {
        await createSlide.mutateAsync(slideData);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving slide:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSlide.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Hero Slides</h2>
          <p className="text-sm text-muted-foreground">
            Manage the hero slider on the homepage
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? "Edit Slide" : "Add New Slide"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Slide Image</Label>
                <div className="flex flex-col gap-4">
                  {imagePreview && (
                    <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-muted">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-xs"
                    />
                    {!imagePreview && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                        <span className="text-sm">No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_text">Button Text</Label>
                  <Input
                    id="cta_text"
                    value={formData.cta_text}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_text: e.target.value })
                    }
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_link">Button Link</Label>
                  <Input
                    id="cta_link"
                    value={formData.cta_link}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_link: e.target.value })
                    }
                    placeholder="e.g., /products"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingSlide ? "Update Slide" : "Create Slide"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {slides && slides.length > 0 ? (
        <div className="grid gap-4">
          {slides.map((slide) => (
            <Card key={slide.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm sm:text-base">{slide.title}</h3>
                          {!slide.is_active && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        {slide.subtitle && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {slide.subtitle}
                          </p>
                        )}
                      </div>
                      
                      {/* Actions - Desktop */}
                      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(slide)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this slide? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(slide.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Order: {slide.display_order}</span>
                      {slide.cta_text && (
                        <span>Button: {slide.cta_text}</span>
                      )}
                      {slide.cta_link && (
                        <span>Link: {slide.cta_link}</span>
                      )}
                    </div>
                    
                    {/* Actions - Mobile */}
                    <div className="flex sm:hidden items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleOpenDialog(slide)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="flex-1">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this slide? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(slide.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No slides yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first hero slide to get started
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Slide
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeroSlidesManager;
