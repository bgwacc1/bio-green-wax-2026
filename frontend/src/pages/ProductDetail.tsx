import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  FileText, 
  Package, 
  Beaker,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Download,
  Loader2
} from "lucide-react";
import { useProductBySlug, useProducts } from "@/hooks/useCMS";
import { useProductSpecifications, downloadSpecification } from "@/hooks/useProductSpecifications";
import { toast } from "sonner";
import { useMemo } from "react";
import { SEO, ProductSchema, BreadcrumbSchema } from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  // Pass language to hooks - translations are automatically merged by API
  const { data: product, isLoading, error } = useProductBySlug(id, currentLanguage);
  const { data: specifications } = useProductSpecifications(id);
  const { data: allProducts } = useProducts(true, currentLanguage);

  // Get related products from same category (or any shared category)
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    
    const productCategories = product.categories?.length > 0 ? product.categories : [product.category];
    
    return allProducts
      .filter((p) => {
        if (p.slug === product.slug) return false;
        const pCategories = p.categories?.length > 0 ? p.categories : [p.category];
        return pCategories.some((cat) => productCategories.includes(cat));
      })
      .slice(0, 3);
  }, [product, allProducts]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen">
      <SEO
        title={product.name}
        description={product.description || `${product.name} - Premium quality ${product.category_label} from Bio Green Wax Ltd. Available for wholesale and bulk orders.`}
        keywords={`${product.name}, ${product.category_label}, ${(product.applications as string[])?.join(', ') || ''}, UK supplier, wholesale`}
        url={`/products/${product.slug}`}
        type="product"
      />
      <ProductSchema
        name={product.name}
        description={product.description || ''}
        image={product.image_url || undefined}
        category={product.category_label}
        url={`/products/${product.slug}`}
      />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
        { name: product.category_label, url: `/products?category=${product.category}` },
        { name: product.name, url: `/products/${product.slug}` }
      ]} />
      {/* Breadcrumb */}
      <section className="bg-muted py-4 border-b">
        <div className="container-wide">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/products" className="text-muted-foreground hover:text-primary">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link 
              to={`/products?category=${product.category}`} 
              className="text-muted-foreground hover:text-primary"
            >
              {product.category_label}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="section-padding">
        <div className="container-wide">
          <Link
            to="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <OptimizedImage
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
                priority={true}
              />
            </div>

            {/* Product Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(product.categories?.length > 0 ? product.categories : [product.category]).map((catSlug) => (
                  <Badge key={catSlug} variant="secondary">
                    {catSlug === product.category ? product.category_label : catSlug}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {product.name}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {product.full_description || product.description}
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to={`/contact?type=quote&product=${product.slug}`}>
                    <FileText className="mr-2 h-5 w-5" />
                    Request Quote
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to={`/contact?type=sample&product=${product.slug}`}>
                    <Package className="mr-2 h-5 w-5" />
                    Request Sample
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to={`/contact?type=general&product=${product.slug}`}>
                    <MessageSquare className="mr-2 h-5 w-5" />
                    General Inquiry
                  </Link>
                </Button>
              </div>

              {/* Specification Downloads */}
              {specifications && specifications.length > 0 && (
                <Card className="bg-muted/50 border mb-6">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-3">Product Documents</p>
                    <div className="space-y-2">
                      {specifications.map((spec) => {
                        const handleDownload = async (e: React.MouseEvent) => {
                          e.preventDefault();
                          try {
                            await downloadSpecification(spec);
                          } catch {
                            toast.error("Failed to download file. Please try again.");
                          }
                        };

                        return (
                          <button
                            key={spec.id}
                            onClick={handleDownload}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors group w-full text-left"
                          >
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <span className="flex-1 text-sm group-hover:text-primary transition-colors">
                              {spec.name}
                            </span>
                            <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Info */}
              <Card className="bg-muted border-0">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-3">Need more information?</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:+442071013847"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      +44 20 7101 3847
                    </a>
                    <a
                      href="mailto:sales@biogreenwax.com"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                      sales@biogreenwax.com
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Specifications, Applications, Packaging */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Specifications */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Beaker className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-heading font-semibold">
                    Technical Specifications
                  </h2>
                </div>
                <Separator className="mb-4" />
                <dl className="space-y-3">
                  {product.specifications && Array.isArray(product.specifications) ? (
                    product.specifications.map((spec: { label: string; value: string }) => (
                      <div key={spec.label} className="flex justify-between">
                        <dt className="text-muted-foreground">{spec.label}</dt>
                        <dd className="font-medium text-right">{spec.value}</dd>
                      </div>
                    ))
                  ) : product.specifications && typeof product.specifications === 'object' ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-muted-foreground">{key}</dt>
                        <dd className="font-medium text-right">{String(value)}</dd>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No specifications available</p>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="text-lg font-heading font-semibold">
                    Applications
                  </h2>
                </div>
                <Separator className="mb-4" />
                <ul className="space-y-2">
                  {product.applications?.map((app) => (
                    <li key={app} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{app}</span>
                    </li>
                  ))}
                  {(!product.applications || product.applications.length === 0) && (
                    <p className="text-muted-foreground text-sm">No applications listed</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Packaging */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-light/20 flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-light" />
                  </div>
                  <h2 className="text-lg font-heading font-semibold">
                    Packaging Options
                  </h2>
                </div>
                <Separator className="mb-4" />
                <ul className="space-y-2">
                  {product.packaging?.map((pkg) => (
                    <li key={pkg} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-light" />
                      <span className="text-muted-foreground">{pkg}</span>
                    </li>
                  ))}
                  {(!product.packaging || product.packaging.length === 0) && (
                    <p className="text-muted-foreground text-sm">Contact us for packaging options</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container-wide">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-8">
              Related Products
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group card-hover overflow-hidden border-0 shadow-md">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <OptimizedImage
                      src={relatedProduct.image_url || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {relatedProduct.description}
                    </p>
                    <Link
                      to={`/products/${relatedProduct.slug}`}
                      className="text-sm text-primary font-medium hover:text-primary/80"
                    >
                      View Details →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Ready to Order {product.name}?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Contact our team for pricing, availability, and custom specifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to={`/contact?type=quote&product=${product.slug}`}>
                Get a Quote
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold border-0"
            >
              <Link to="/contact?type=callback">
                Request Callback
              </Link>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default ProductDetail;
