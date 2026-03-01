import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/data/products";
import {
  useProductSpecifications,
  useUploadSpecification,
  useDeleteSpecification,
  getSpecificationUrl,
} from "@/hooks/useProductSpecifications";
import { ArrowLeft, Upload, Trash2, FileText, Download, Loader2, Calendar, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const AdminSpecifications = () => {
  const { signOut } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [specName, setSpecName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: specifications, isLoading } = useProductSpecifications();
  const uploadMutation = useUploadSpecification();
  const deleteMutation = useDeleteSpecification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedProduct || !specName || !selectedFile) return;

    await uploadMutation.mutateAsync({
      productId: selectedProduct,
      name: specName,
      file: selectedFile,
    });

    // Reset form
    setSelectedProduct("");
    setSpecName("");
    setSelectedFile(null);
    setIsDialogOpen(false);
  };

  const handleDelete = async (spec: typeof specifications extends (infer T)[] ? T : never) => {
    if (confirm("Are you sure you want to delete this specification?")) {
      await deleteMutation.mutateAsync(spec);
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || productId;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <Layout>
      <div className="container-wide py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold">Product Specifications</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Upload and manage specification documents
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Specification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Specification Document</DialogTitle>
                <DialogDescription>
                  Upload a PDF specification or Certificate of Analysis for a product
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Document Name</Label>
                  <Input
                    value={specName}
                    onChange={(e) => setSpecName(e.target.value)}
                    placeholder="e.g., Technical Data Sheet, Certificate of Analysis"
                  />
                </div>

                <div className="space-y-2">
                  <Label>PDF File</Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedProduct || !specName || !selectedFile || uploadMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Uploaded Specifications</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : specifications && specifications.length > 0 ? (
              <div className="space-y-3">
                {specifications.map((spec) => (
                  <div
                    key={spec.id}
                    className="border rounded-lg p-3 sm:p-4 bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {spec.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {getProductName(spec.product_id)}
                          </span>
                          <span>{formatFileSize(spec.file_size)}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(spec.created_at), "MMM d, yyyy")}
                          </span>
                        </div>

                        {/* Mobile actions */}
                        <div className="flex sm:hidden items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <a
                              href={getSpecificationUrl(spec.file_path)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(spec)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Desktop actions */}
                      <div className="hidden sm:flex items-start gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <a
                            href={getSpecificationUrl(spec.file_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(spec)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No specifications uploaded yet</p>
                <p className="text-xs">Click "Upload Specification" to add your first document</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminSpecifications;