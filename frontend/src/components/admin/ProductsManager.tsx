import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Pencil, Trash2, Package, Loader2, X, Filter } from "lucide-react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useProductCategories,
  uploadCMSImage,
  Product,
} from "@/hooks/useCMS";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  full_description: string;
  category: string;
  category_label: string;
  categories: string[]; // Array of category slugs for multi-category
  specifications: { label: string; value: string }[];
  applications: string[];
  packaging: string[];
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  priority_order: number;
}

const PRODUCTS_PER_PAGE = 10;

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
};

const ProductsManager = () => {
  const { data: products, isLoading } = useProducts(false);
  const { data: categories, isLoading: categoriesLoading } = useProductCategories(false);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const [newSpec, setNewSpec] = useState({ label: "", value: "" });
  const [newApplication, setNewApplication] = useState("");
  const [newPackaging, setNewPackaging] = useState("");

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    full_description: "",
    category: "edible-oils",
    category_label: "Edible Oils",
    categories: ["edible-oils"],
    specifications: [],
    applications: [],
    packaging: [],
    is_active: true,
    is_featured: false,
    display_order: 0,
    priority_order: 10,
  });

  // Filter products - check if product belongs to any of the selected categories
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (filterCategory === "all") return products;
    return products.filter((p) => 
      p.categories?.includes(filterCategory) || p.category === filterCategory
    );
  }, [products, filterCategory]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (category: string) => {
    setFilterCategory(category);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      full_description: "",
      category: "edible-oils",
      category_label: "Edible Oils",
      categories: ["edible-oils"],
      specifications: [],
      applications: [],
      packaging: [],
      is_active: true,
      is_featured: false,
      display_order: products?.length || 0,
      priority_order: 10,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingProduct(null);
    setNewSpec({ label: "", value: "" });
    setNewApplication("");
    setNewPackaging("");
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      // Ensure categories array is populated, fallback to single category
      const productCategories = product.categories?.length > 0 
        ? product.categories 
        : [product.category];
      const parseArray = (val: unknown) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
        return [];
      };
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        full_description: product.full_description || "",
        category: product.category,
        category_label: product.category_label,
        categories: productCategories,
        specifications: parseArray(product.specifications),
        applications: parseArray(product.applications),
        packaging: parseArray(product.packaging),
        is_active: product.is_active,
        is_featured: product.is_featured || false,
        display_order: product.display_order,
        priority_order: product.priority_order ?? 10,
      });
      setImagePreview(product.image_url);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : slugify(name),
    }));
  };

  const handleCategoryToggle = (categorySlug: string, checked: boolean) => {
    setFormData((prev) => {
      const newCategories = checked
        ? [...prev.categories, categorySlug]
        : prev.categories.filter((c) => c !== categorySlug);
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addSpecification = () => {
    if (newSpec.label && newSpec.value) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, { ...newSpec }],
      }));
      setNewSpec({ label: "", value: "" });
    }
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const addApplication = () => {
    if (newApplication) {
      setFormData((prev) => ({
        ...prev,
        applications: [...prev.applications, newApplication],
      }));
      setNewApplication("");
    }
  };

  const removeApplication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      applications: prev.applications.filter((_, i) => i !== index),
    }));
  };

  const addPackaging = () => {
    if (newPackaging) {
      setFormData((prev) => ({
        ...prev,
        packaging: [...prev.packaging, newPackaging],
      }));
      setNewPackaging("");
    }
  };

  const removePackaging = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      packaging: prev.packaging.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }
    
    setIsUploading(true);

    try {
      let imageUrl = editingProduct?.image_url || null;

      if (imageFile) {
        imageUrl = await uploadCMSImage(imageFile, "products");
      }

      // Set primary category from the first selected category
      const primaryCategory = formData.categories[0];
      const primaryCategoryObj = categories?.find((c) => c.slug === primaryCategory);

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        full_description: formData.full_description || null,
        category: primaryCategory,
        category_label: primaryCategoryObj?.name || primaryCategory,
        categories: formData.categories,
        specifications: formData.specifications,
        applications: formData.applications,
        packaging: formData.packaging,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        display_order: formData.display_order,
        priority_order: formData.priority_order,
        image_url: imageUrl,
      };

      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
      } else {
        await createProduct.mutateAsync(productData);
      }

      handleCloseDialog();
    } catch (error: any) {
      console.error("Error saving product:", error);
      const msg = error?.message || "Failed to save product";
      if (msg.includes("authenticated") || msg.includes("401") || msg.includes("Request failed")) {
        toast.error("Session expired. Please log out and log back in.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProduct.mutateAsync(id);
  };

  if (isLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg p-4 sm:p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog ({filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""})
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={filterCategory} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: slugify(e.target.value) })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categories *</Label>
                    <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                      {categories?.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${cat.id}`}
                            checked={formData.categories.includes(cat.slug)}
                            onCheckedChange={(checked) => 
                              handleCategoryToggle(cat.slug, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`cat-${cat.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {cat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formData.categories.length === 0 && (
                      <p className="text-xs text-destructive">Select at least one category</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-16 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_description">Full Description</Label>
                  <Textarea
                    id="full_description"
                    value={formData.full_description}
                    onChange={(e) =>
                      setFormData({ ...formData, full_description: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                {/* Specifications */}
                <div className="space-y-2">
                  <Label>Technical Specifications</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Label (e.g., Melting Point)"
                      value={newSpec.label}
                      onChange={(e) =>
                        setNewSpec({ ...newSpec, label: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g., 58-60°C)"
                      value={newSpec.value}
                      onChange={(e) =>
                        setNewSpec({ ...newSpec, value: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Button type="button" onClick={addSpecification} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Array.isArray(formData.specifications) ? formData.specifications : []).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {spec.label}: {spec.value}
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Applications */}
                <div className="space-y-2">
                  <Label>Applications</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add application..."
                      value={newApplication}
                      onChange={(e) => setNewApplication(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addApplication())}
                    />
                    <Button type="button" onClick={addApplication} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Array.isArray(formData.applications) ? formData.applications : []).map((app, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {app}
                        <button type="button" onClick={() => removeApplication(index)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Packaging */}
                <div className="space-y-2">
                  <Label>Packaging Options</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add packaging option..."
                      value={newPackaging}
                      onChange={(e) => setNewPackaging(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPackaging())}
                    />
                    <Button type="button" onClick={addPackaging} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Array.isArray(formData.packaging) ? formData.packaging : []).map((pkg, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {pkg}
                        <button type="button" onClick={() => removePackaging(index)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: checked })
                      }
                    />
                    <Label htmlFor="is_active">Active (visible on website)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_featured: checked })
                      }
                    />
                    <Label htmlFor="is_featured">Featured (show on homepage)</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority_order">Priority Order (lower number = higher priority)</Label>
                  <Input
                    id="priority_order"
                    type="number"
                    min={0}
                    value={formData.priority_order}
                    onChange={(e) =>
                      setFormData({ ...formData, priority_order: parseInt(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">Default is 10. Products with lower numbers appear first.</p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {paginatedProducts && paginatedProducts.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-4">
            {paginatedProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Image */}
                    <div className="w-full sm:w-24 h-32 sm:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
                            <Badge variant={product.is_active ? "default" : "secondary"} className="text-xs">
                              {product.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {product.is_featured && (
                              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              Priority: {product.priority_order ?? 10}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Actions - Desktop */}
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(product)}
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
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This
                                  action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      
                      {/* Categories */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {(product.categories?.length > 0 ? product.categories : [product.category]).map((catSlug) => {
                          const cat = categories?.find((c) => c.slug === catSlug);
                          return (
                            <Badge key={catSlug} variant="outline" className="text-xs">
                              {cat?.name || catSlug}
                            </Badge>
                          );
                        })}
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Actions - Mobile */}
                      <div className="flex sm:hidden items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleOpenDialog(product)}
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
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">
              {filterCategory === "all" ? "No products yet" : "No products in this category"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filterCategory === "all" 
                ? "Add your first product to get started"
                : "Try selecting a different category or add a new product"}
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsManager;
