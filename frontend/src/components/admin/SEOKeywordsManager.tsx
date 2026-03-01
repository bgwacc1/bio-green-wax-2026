import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Link, Target, Tag, FileText, ChevronLeft, ChevronRight } from "lucide-react";

interface SEOKeyword {
  id: string;
  keyword: string;
  description: string | null;
  target_page: string | null;
  priority: number;
  search_volume: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  products?: ProductMapping[];
}

interface ProductMapping {
  id: string;
  keyword_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  relevance_score: number;
}

interface SEOPageMeta {
  id: string;
  page_path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  no_index: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
}

interface KeywordFormData {
  keyword: string;
  description: string;
  target_page: string;
  priority: number;
  search_volume: string;
  is_active: boolean;
}

interface PageMetaFormData {
  page_path: string;
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  no_index: boolean;
  is_active: boolean;
}

const targetPages = [
  { value: "/", label: "Homepage" },
  { value: "/products", label: "Products" },
  { value: "/about", label: "About Us" },
  { value: "/contact", label: "Contact" },
  { value: "/news", label: "News" },
  { value: "/careers", label: "Careers" },
  { value: "/certifications", label: "Certifications" },
  { value: "/sectors", label: "Sectors" },
];

const SEOKeywordsManager = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("keywords");
  const [isKeywordDialogOpen, setIsKeywordDialogOpen] = useState(false);
  const [isPageMetaDialogOpen, setIsPageMetaDialogOpen] = useState(false);
  const [isProductMappingDialogOpen, setIsProductMappingDialogOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<SEOKeyword | null>(null);
  const [editingPageMeta, setEditingPageMeta] = useState<SEOPageMeta | null>(null);
  const [selectedKeywordForMapping, setSelectedKeywordForMapping] = useState<SEOKeyword | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [relevanceScore, setRelevanceScore] = useState<number>(100);
  const [keywordsPage, setKeywordsPage] = useState(1);
  const KEYWORDS_PER_PAGE = 20;

  const [keywordFormData, setKeywordFormData] = useState<KeywordFormData>({
    keyword: "",
    description: "",
    target_page: "",
    priority: 1,
    search_volume: "",
    is_active: true,
  });

  const [pageMetaFormData, setPageMetaFormData] = useState<PageMetaFormData>({
    page_path: "",
    title: "",
    description: "",
    keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    canonical_url: "",
    no_index: false,
    is_active: true,
  });

  const { data: keywords, isLoading: keywordsLoading } = useQuery({
    queryKey: ["seo-keywords"],
    queryFn: () => apiClient.get<SEOKeyword[]>("/api/seo-keywords"),
  });

  const { data: pageMetas, isLoading: pageMetasLoading } = useQuery({
    queryKey: ["seo-page-meta"],
    queryFn: () => apiClient.get<SEOPageMeta[]>("/api/seo-page-meta"),
  });

  const { data: products } = useQuery({
    queryKey: ["products-for-seo"],
    queryFn: () => apiClient.get<Product[]>("/api/products"),
  });

  const createKeywordMutation = useMutation({
    mutationFn: (data: KeywordFormData) => apiClient.post("/api/seo-keywords", data),
    onSuccess: () => {
      toast.success("Keyword created successfully");
      queryClient.invalidateQueries({ queryKey: ["seo-keywords"] });
      resetKeywordForm();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateKeywordMutation = useMutation({
    mutationFn: ({ id, ...data }: KeywordFormData & { id: string }) =>
      apiClient.put(`/api/seo-keywords/${id}`, data),
    onSuccess: () => {
      toast.success("Keyword updated successfully");
      queryClient.invalidateQueries({ queryKey: ["seo-keywords"] });
      resetKeywordForm();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteKeywordMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/seo-keywords/${id}`),
    onSuccess: () => {
      toast.success("Keyword deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["seo-keywords"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createPageMetaMutation = useMutation({
    mutationFn: (data: PageMetaFormData) => apiClient.post("/api/seo-page-meta", data),
    onSuccess: () => {
      toast.success("Page meta created successfully");
      queryClient.invalidateQueries({ queryKey: ["seo-page-meta"] });
      resetPageMetaForm();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updatePageMetaMutation = useMutation({
    mutationFn: ({ id, ...data }: PageMetaFormData & { id: string }) =>
      apiClient.put(`/api/seo-page-meta/${id}`, data),
    onSuccess: () => {
      toast.success("Page meta updated successfully");
      queryClient.invalidateQueries({ queryKey: ["seo-page-meta"] });
      resetPageMetaForm();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deletePageMetaMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/seo-page-meta/${id}`),
    onSuccess: () => {
      toast.success("Page meta deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["seo-page-meta"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const addProductMappingMutation = useMutation({
    mutationFn: ({ keywordId, productId, relevanceScore }: { keywordId: string; productId: string; relevanceScore: number }) =>
      apiClient.post(`/api/seo-keywords/${keywordId}/products`, { product_id: productId, relevance_score: relevanceScore }),
    onSuccess: () => {
      toast.success("Product mapped to keyword");
      queryClient.invalidateQueries({ queryKey: ["seo-keywords"] });
      setIsProductMappingDialogOpen(false);
      setSelectedProductId("");
      setRelevanceScore(100);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeProductMappingMutation = useMutation({
    mutationFn: (mappingId: string) => apiClient.delete(`/api/seo-keyword-products/${mappingId}`),
    onSuccess: () => {
      toast.success("Product mapping removed");
      queryClient.invalidateQueries({ queryKey: ["seo-keywords"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const resetKeywordForm = () => {
    setKeywordFormData({
      keyword: "",
      description: "",
      target_page: "",
      priority: 1,
      search_volume: "",
      is_active: true,
    });
    setEditingKeyword(null);
    setIsKeywordDialogOpen(false);
  };

  const resetPageMetaForm = () => {
    setPageMetaFormData({
      page_path: "",
      title: "",
      description: "",
      keywords: "",
      og_title: "",
      og_description: "",
      og_image: "",
      canonical_url: "",
      no_index: false,
      is_active: true,
    });
    setEditingPageMeta(null);
    setIsPageMetaDialogOpen(false);
  };

  const handleEditKeyword = (keyword: SEOKeyword) => {
    setEditingKeyword(keyword);
    setKeywordFormData({
      keyword: keyword.keyword,
      description: keyword.description || "",
      target_page: keyword.target_page || "",
      priority: keyword.priority,
      search_volume: keyword.search_volume || "",
      is_active: keyword.is_active,
    });
    setIsKeywordDialogOpen(true);
  };

  const handleEditPageMeta = (pageMeta: SEOPageMeta) => {
    setEditingPageMeta(pageMeta);
    setPageMetaFormData({
      page_path: pageMeta.page_path,
      title: pageMeta.title || "",
      description: pageMeta.description || "",
      keywords: pageMeta.keywords || "",
      og_title: pageMeta.og_title || "",
      og_description: pageMeta.og_description || "",
      og_image: pageMeta.og_image || "",
      canonical_url: pageMeta.canonical_url || "",
      no_index: pageMeta.no_index,
      is_active: pageMeta.is_active,
    });
    setIsPageMetaDialogOpen(true);
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKeyword) {
      updateKeywordMutation.mutate({ id: editingKeyword.id, ...keywordFormData });
    } else {
      createKeywordMutation.mutate(keywordFormData);
    }
  };

  const handlePageMetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPageMeta) {
      updatePageMetaMutation.mutate({ id: editingPageMeta.id, ...pageMetaFormData });
    } else {
      createPageMetaMutation.mutate(pageMetaFormData);
    }
  };

  const openProductMappingDialog = (keyword: SEOKeyword) => {
    setSelectedKeywordForMapping(keyword);
    setIsProductMappingDialogOpen(true);
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 5) return <Badge className="bg-red-500">High</Badge>;
    if (priority >= 3) return <Badge className="bg-yellow-500">Medium</Badge>;
    return <Badge variant="secondary">Low</Badge>;
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Only admins can manage SEO settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Search className="h-5 w-5" />
          SEO Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage SEO keywords, page meta tags, and product-keyword mappings to improve search rankings.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Keywords
          </TabsTrigger>
          <TabsTrigger value="page-meta" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Page Meta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Define target keywords and map them to products for better SEO targeting.
            </p>
            <Dialog open={isKeywordDialogOpen} onOpenChange={setIsKeywordDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetKeywordForm(); setIsKeywordDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Keyword
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingKeyword ? "Edit Keyword" : "Add Keyword"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleKeywordSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="keyword">Keyword *</Label>
                    <Input
                      id="keyword"
                      value={keywordFormData.keyword}
                      onChange={(e) => setKeywordFormData({ ...keywordFormData, keyword: e.target.value })}
                      placeholder="e.g., palm wax candles"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={keywordFormData.description}
                      onChange={(e) => setKeywordFormData({ ...keywordFormData, description: e.target.value })}
                      placeholder="Brief description of keyword usage"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target_page">Target Page</Label>
                      <Select
                        value={keywordFormData.target_page}
                        onValueChange={(value) => setKeywordFormData({ ...keywordFormData, target_page: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select page" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetPages.map((page) => (
                            <SelectItem key={page.value} value={page.value}>
                              {page.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={keywordFormData.priority}
                        onChange={(e) => setKeywordFormData({ ...keywordFormData, priority: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="search_volume">Est. Search Volume</Label>
                    <Input
                      id="search_volume"
                      value={keywordFormData.search_volume}
                      onChange={(e) => setKeywordFormData({ ...keywordFormData, search_volume: e.target.value })}
                      placeholder="e.g., 1,000-5,000 monthly"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={keywordFormData.is_active}
                      onCheckedChange={(checked) => setKeywordFormData({ ...keywordFormData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetKeywordForm}>Cancel</Button>
                    <Button type="submit">{editingKeyword ? "Update" : "Create"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {keywordsLoading ? (
            <p>Loading keywords...</p>
          ) : (() => {
            const totalKeywords = keywords?.length || 0;
            const totalPages = Math.max(1, Math.ceil(totalKeywords / KEYWORDS_PER_PAGE));
            const safePage = Math.min(keywordsPage, totalPages);
            const startIdx = (safePage - 1) * KEYWORDS_PER_PAGE;
            const paginatedKeywords = keywords?.slice(startIdx, startIdx + KEYWORDS_PER_PAGE) || [];

            return (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Target Page</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedKeywords.map((kw) => (
                      <TableRow key={kw.id}>
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell>{kw.target_page || "-"}</TableCell>
                        <TableCell>{getPriorityBadge(kw.priority)}</TableCell>
                        <TableCell>{kw.search_volume || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openProductMappingDialog(kw)}
                          >
                            <Link className="h-4 w-4 mr-1" />
                            Map Products
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge variant={kw.is_active ? "default" : "secondary"}>
                            {kw.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditKeyword(kw)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Delete this keyword?")) {
                                deleteKeywordMutation.mutate(kw.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {totalKeywords === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No keywords defined yet. Add your first SEO keyword.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIdx + 1}–{Math.min(startIdx + KEYWORDS_PER_PAGE, totalKeywords)} of {totalKeywords} keywords
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setKeywordsPage(safePage - 1)}
                        disabled={safePage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === safePage ? "default" : "outline"}
                          size="sm"
                          className="min-w-[36px]"
                          onClick={() => setKeywordsPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setKeywordsPage(safePage + 1)}
                        disabled={safePage >= totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </TabsContent>

        <TabsContent value="page-meta" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Override page meta tags for specific URLs to improve SEO.
            </p>
            <Dialog open={isPageMetaDialogOpen} onOpenChange={setIsPageMetaDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetPageMetaForm(); setIsPageMetaDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Page Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPageMeta ? "Edit Page Meta" : "Add Page Meta"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePageMetaSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="page_path">Page Path *</Label>
                    <Input
                      id="page_path"
                      value={pageMetaFormData.page_path}
                      onChange={(e) => setPageMetaFormData({ ...pageMetaFormData, page_path: e.target.value })}
                      placeholder="e.g., /products or /products/palm-wax"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Meta Title</Label>
                      <Input
                        id="title"
                        value={pageMetaFormData.title}
                        onChange={(e) => setPageMetaFormData({ ...pageMetaFormData, title: e.target.value })}
                        placeholder="Page title for search results"
                      />
                    </div>
                    <div>
                      <Label htmlFor="og_title">OG Title</Label>
                      <Input
                        id="og_title"
                        value={pageMetaFormData.og_title}
                        onChange={(e) => setPageMetaFormData({ ...pageMetaFormData, og_title: e.target.value })}
                        placeholder="Title for social sharing"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={pageMetaFormData.description}
                      onChange={(e) => setPageMetaFormData({ ...pageMetaFormData, description: e.target.value })}
                      placeholder="Description for search results (150-160 chars)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      value={pageMetaFormData.keywords}
                      onChange={(e) => setPageMetaFormData({ ...pageMetaFormData, keywords: e.target.value })}
                      placeholder="palm wax, candle wax, natural wax"
                    />
                  </div>
                  <div>
                    <Label htmlFor="og_description">OG Description</Label>
                    <Textarea
                      id="og_description"
                      value={pageMetaFormData.og_description}
                      onChange={(e) => setPageMetaFormData({ ...pageMetaFormData, og_description: e.target.value })}
                      placeholder="Description for social sharing"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="og_image">OG Image URL</Label>
                      <Input
                        id="og_image"
                        value={pageMetaFormData.og_image}
                        onChange={(e) => setPageMetaFormData({ ...pageMetaFormData, og_image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="canonical_url">Canonical URL</Label>
                      <Input
                        id="canonical_url"
                        value={pageMetaFormData.canonical_url}
                        onChange={(e) => setPageMetaFormData({ ...pageMetaFormData, canonical_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="no_index"
                        checked={pageMetaFormData.no_index}
                        onCheckedChange={(checked) => setPageMetaFormData({ ...pageMetaFormData, no_index: checked })}
                      />
                      <Label htmlFor="no_index">No Index</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="pm_is_active"
                        checked={pageMetaFormData.is_active}
                        onCheckedChange={(checked) => setPageMetaFormData({ ...pageMetaFormData, is_active: checked })}
                      />
                      <Label htmlFor="pm_is_active">Active</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetPageMetaForm}>Cancel</Button>
                    <Button type="submit">{editingPageMeta ? "Update" : "Create"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {pageMetasLoading ? (
            <p>Loading page meta...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Path</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>No Index</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageMetas?.map((pm) => (
                  <TableRow key={pm.id}>
                    <TableCell className="font-medium">{pm.page_path}</TableCell>
                    <TableCell className="max-w-xs truncate">{pm.title || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{pm.keywords || "-"}</TableCell>
                    <TableCell>
                      {pm.no_index ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pm.is_active ? "default" : "secondary"}>
                        {pm.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPageMeta(pm)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this page meta?")) {
                            deletePageMetaMutation.mutate(pm.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!pageMetas || pageMetas.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No page meta overrides defined yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isProductMappingDialogOpen} onOpenChange={setIsProductMappingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Map Products to "{selectedKeywordForMapping?.keyword}"
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Relevance Score (1-100)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={relevanceScore}
                onChange={(e) => setRelevanceScore(parseInt(e.target.value) || 100)}
              />
            </div>
            <Button
              onClick={() => {
                if (selectedKeywordForMapping && selectedProductId) {
                  addProductMappingMutation.mutate({
                    keywordId: selectedKeywordForMapping.id,
                    productId: selectedProductId,
                    relevanceScore,
                  });
                }
              }}
              disabled={!selectedProductId}
            >
              Add Mapping
            </Button>

            {selectedKeywordForMapping?.products && selectedKeywordForMapping.products.length > 0 && (
              <div className="mt-4">
                <Label>Current Mappings</Label>
                <div className="space-y-2 mt-2">
                  {selectedKeywordForMapping.products.map((mapping) => (
                    <div
                      key={mapping.id}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span>{mapping.product_name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Score: {mapping.relevance_score}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProductMappingMutation.mutate(mapping.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SEOKeywordsManager;
