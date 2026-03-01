import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  FileText,
  User,
  Globe,
  Upload,
  Pencil,
  Trash2,
  Plus,
  MapPin,
  Building,
  MessageSquareQuote,
  Linkedin,
} from "lucide-react";

interface AboutUsContent {
  id: string;
  section: string;
  content_key: string;
  content_value: string | null;
  content_type: string;
  display_order: number;
  is_active: boolean;
}

interface Director {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
}

interface GlobalOperation {
  id: string;
  location_name: string;
  country: string;
  description: string | null;
  operations_type: string | null;
  display_order: number;
  is_active: boolean;
}

const AboutUsManager = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("content");
  const [contentData, setContentData] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const [isDirectorDialogOpen, setIsDirectorDialogOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);

  const { data: aboutContent, isLoading: loadingContent } = useQuery<
    AboutUsContent[]
  >({
    queryKey: ["about-us-content"],
    queryFn: () => apiClient.get<AboutUsContent[]>("/api/about-us-content"),
  });

  const { data: directors, isLoading: loadingDirectors } = useQuery<Director[]>(
    {
      queryKey: ["directors"],
      queryFn: () => apiClient.get<Director[]>("/api/directors"),
    },
  );

  const { data: operations, isLoading: loadingOperations } = useQuery<
    GlobalOperation[]
  >({
    queryKey: ["global-operations"],
    queryFn: () => apiClient.get<GlobalOperation[]>("/api/global-operations"),
  });

  useEffect(() => {
    if (aboutContent) {
      const data: Record<string, string> = {};
      aboutContent.forEach((item) => {
        data[item.id] = item.content_value || "";
      });
      setContentData(data);
      setHasChanges(false);
    }
  }, [aboutContent]);

  const handleContentChange = (id: string, value: string) => {
    setContentData((prev) => ({ ...prev, [id]: value }));
    setHasChanges(true);
  };

  const getContentValue = (section: string, key: string): string => {
    const item = aboutContent?.find(
      (c) => c.section === section && c.content_key === key,
    );
    if (item) {
      return contentData[item.id] ?? item.content_value ?? "";
    }
    return "";
  };

  const getContentId = (section: string, key: string): string | null => {
    const item = aboutContent?.find(
      (c) => c.section === section && c.content_key === key,
    );
    return item?.id ?? null;
  };

  const saveContentMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(contentData).map(
        ([id, content_value]) => ({
          id,
          content_value,
        }),
      );
      await apiClient.put("/api/about-us-content/bulk", { updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-us-content"] });
      toast.success("Content saved successfully");
      setHasChanges(false);
    },
    onError: () => {
      toast.error("Failed to save content");
    },
  });

  const updateDirectorMutation = useMutation({
    mutationFn: async (director: Partial<Director> & { id: string }) => {
      await apiClient.put(`/api/directors/${director.id}`, director);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directors"] });
      toast.success("Director updated successfully");
      setIsDirectorDialogOpen(false);
      setEditingDirector(null);
    },
    onError: () => {
      toast.error("Failed to update director");
    },
  });

  const createDirectorMutation = useMutation({
    mutationFn: async (director: Omit<Director, "id">) => {
      await apiClient.post("/api/directors", director);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directors"] });
      toast.success("Director created successfully");
      setIsDirectorDialogOpen(false);
      setEditingDirector(null);
    },
    onError: () => {
      toast.error("Failed to create director");
    },
  });

  const deleteDirectorMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/directors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directors"] });
      toast.success("Director deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete director");
    },
  });

  const updateOperationMutation = useMutation({
    mutationFn: async (
      operation: Partial<GlobalOperation> & { id: string },
    ) => {
      await apiClient.put(`/api/global-operations/${operation.id}`, operation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["global-operations"] });
      toast.success("Location updated successfully");
    },
    onError: () => {
      toast.error("Failed to update location");
    },
  });

  const handlePhotoUpload = async (directorId: string, file: File) => {
    setUploadingPhoto(directorId);
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("director_id", directorId);

    try {
      const token = apiClient.getToken();
      const response = await fetch("/api/upload/director-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (result.photo_url) {
        queryClient.invalidateQueries({ queryKey: ["directors"] });
        toast.success("Photo uploaded successfully");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(null);
    }
  };

  const handleSaveContent = () => {
    setIsSaving(true);
    saveContentMutation.mutate(undefined, {
      onSettled: () => setIsSaving(false),
    });
  };

  const handleSaveDirector = (director: Director) => {
    if (director.id && !director.id.startsWith("new-")) {
      updateDirectorMutation.mutate(director);
    } else {
      const { id, ...newDirector } = director;
      createDirectorMutation.mutate(newDirector as Omit<Director, "id">);
    }
  };

  if (loadingContent || loadingDirectors || loadingOperations) {
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
          <h2 className="text-xl font-semibold">About Us Page</h2>
          <p className="text-sm text-muted-foreground">
            Manage content, directors, and global operations
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Page Content
          </TabsTrigger>
          <TabsTrigger value="directors" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Directors
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Global Operations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button
              onClick={handleSaveContent}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Hero Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={getContentValue("hero", "title")}
                  onChange={(e) => {
                    const id = getContentId("hero", "title");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  placeholder="About Bio Green Wax"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={getContentValue("hero", "subtitle")}
                  onChange={(e) => {
                    const id = getContentId("hero", "subtitle");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  placeholder="Your trusted partner..."
                  className="bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={getContentValue("story", "title")}
                  onChange={(e) => {
                    const id = getContentId("story", "title");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={getContentValue("story", "content")}
                  onChange={(e) => {
                    const id = getContentId("story", "content");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  rows={8}
                  className="bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Experience & Leadership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={getContentValue("experience", "title")}
                  onChange={(e) => {
                    const id = getContentId("experience", "title");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={getContentValue("experience", "content")}
                  onChange={(e) => {
                    const id = getContentId("experience", "content");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  rows={4}
                  className="bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquareQuote className="h-5 w-5" />
                Director's Message
              </CardTitle>
              <CardDescription>
                A personal message from the Managing Director to clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Message Title</Label>
                <Input
                  value={getContentValue("director_message", "title")}
                  onChange={(e) => {
                    const id = getContentId("director_message", "title");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea
                  value={getContentValue("director_message", "content")}
                  onChange={(e) => {
                    const id = getContentId("director_message", "content");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  rows={10}
                  className="font-serif bg-white"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Signature Name</Label>
                  <Input
                    value={getContentValue("director_message", "signature")}
                    onChange={(e) => {
                      const id = getContentId("director_message", "signature");
                      if (id) handleContentChange(id, e.target.value);
                    }}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signature Title</Label>
                  <Input
                    value={getContentValue(
                      "director_message",
                      "signature_title",
                    )}
                    onChange={(e) => {
                      const id = getContentId(
                        "director_message",
                        "signature_title",
                      );
                      if (id) handleContentChange(id, e.target.value);
                    }}
                    className="bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mission Statement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={getContentValue("mission", "title")}
                  onChange={(e) => {
                    const id = getContentId("mission", "title");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Mission Content</Label>
                <Textarea
                  value={getContentValue("mission", "content")}
                  onChange={(e) => {
                    const id = getContentId("mission", "content");
                    if (id) handleContentChange(id, e.target.value);
                  }}
                  rows={4}
                  className="bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Company Number</Label>
                  <Input
                    value={getContentValue("company_info", "company_number")}
                    onChange={(e) => {
                      const id = getContentId("company_info", "company_number");
                      if (id) handleContentChange(id, e.target.value);
                    }}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Incorporated Date</Label>
                  <Input
                    value={getContentValue("company_info", "incorporated_date")}
                    onChange={(e) => {
                      const id = getContentId(
                        "company_info",
                        "incorporated_date",
                      );
                      if (id) handleContentChange(id, e.target.value);
                    }}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registered Address</Label>
                  <Input
                    value={getContentValue(
                      "company_info",
                      "registered_address",
                    )}
                    onChange={(e) => {
                      const id = getContentId(
                        "company_info",
                        "registered_address",
                      );
                      if (id) handleContentChange(id, e.target.value);
                    }}
                    className="bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="directors" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage director profiles and photos
            </p>
            <Dialog
              open={isDirectorDialogOpen}
              onOpenChange={setIsDirectorDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() =>
                    setEditingDirector({
                      id: "new-" + Date.now(),
                      name: "",
                      title: "",
                      bio: "",
                      linkedin_url: "",
                      photo_url: "",
                      display_order: (directors?.length || 0) + 1,
                      is_active: true,
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Director
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingDirector?.id.startsWith("new-")
                      ? "Add Director"
                      : "Edit Director"}
                  </DialogTitle>
                </DialogHeader>
                {editingDirector && (
                  <div className="space-y-4 py-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          value={editingDirector.name}
                          onChange={(e) =>
                            setEditingDirector({
                              ...editingDirector,
                              name: e.target.value,
                            })
                          }
                          placeholder="Full name"
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={editingDirector.title || ""}
                          onChange={(e) =>
                            setEditingDirector({
                              ...editingDirector,
                              title: e.target.value,
                            })
                          }
                          placeholder="e.g., Managing Director"
                          className="bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Biography</Label>
                      <Textarea
                        value={editingDirector.bio || ""}
                        onChange={(e) =>
                          setEditingDirector({
                            ...editingDirector,
                            bio: e.target.value,
                          })
                        }
                        rows={6}
                        placeholder="Professional background and experience..."
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn URL</Label>
                      <Input
                        value={editingDirector.linkedin_url || ""}
                        onChange={(e) =>
                          setEditingDirector({
                            ...editingDirector,
                            linkedin_url: e.target.value,
                          })
                        }
                        placeholder="https://linkedin.com/in/..."
                        className="bg-white"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={editingDirector.display_order}
                          onChange={(e) =>
                            setEditingDirector({
                              ...editingDirector,
                              display_order: parseInt(e.target.value) || 0,
                            })
                          }
                          className="bg-white"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          checked={editingDirector.is_active}
                          onCheckedChange={(checked) =>
                            setEditingDirector({
                              ...editingDirector,
                              is_active: checked,
                            })
                          }
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDirectorDialogOpen(false);
                          setEditingDirector(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSaveDirector(editingDirector)}
                        disabled={!editingDirector.name}
                      >
                        {updateDirectorMutation.isPending ||
                        createDirectorMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Director
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {directors?.map((director) => (
              <Card key={director.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden">
                        {director.photo_url ? (
                          <img
                            src={director.photo_url}
                            alt={director.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handlePhotoUpload(director.id, file);
                            }
                          }}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        disabled={uploadingPhoto === director.id}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/jpeg,image/png,image/webp";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (file) {
                              handlePhotoUpload(director.id, file);
                            }
                          };
                          input.click();
                        }}
                      >
                        {uploadingPhoto === director.id ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Upload className="mr-1 h-3 w-3" />
                        )}
                        Upload Photo
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {director.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {director.title}
                          </p>
                          {director.linkedin_url && (
                            <a
                              href={director.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
                            >
                              <Linkedin className="h-3 w-3" />
                              LinkedIn Profile
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingDirector(director);
                              setIsDirectorDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this director?",
                                )
                              ) {
                                deleteDirectorMutation.mutate(director.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                        {director.bio}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Order: {director.display_order}</span>
                        <span
                          className={
                            director.is_active
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {director.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage global office and operations locations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {operations?.map((op) => (
              <Card key={op.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Location Name</Label>
                        <Input
                          value={op.location_name}
                          onChange={(e) =>
                            updateOperationMutation.mutate({
                              ...op,
                              location_name: e.target.value,
                            })
                          }
                          className="h-8 bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Country</Label>
                          <Input
                            value={op.country}
                            onChange={(e) =>
                              updateOperationMutation.mutate({
                                ...op,
                                country: e.target.value,
                              })
                            }
                            className="h-8 bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Type</Label>
                          <Input
                            value={op.operations_type || ""}
                            onChange={(e) =>
                              updateOperationMutation.mutate({
                                ...op,
                                operations_type: e.target.value,
                              })
                            }
                            className="h-8 bg-white"
                            placeholder="e.g., Sales & Operations"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={op.description || ""}
                          onChange={(e) =>
                            updateOperationMutation.mutate({
                              ...op,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className="text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutUsManager;
