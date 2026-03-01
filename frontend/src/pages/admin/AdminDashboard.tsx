import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, ImageIcon, Phone, Newspaper, Package, Info, FolderOpen, Users, Factory, Award, Briefcase, MessageSquare, Search, BarChart3, Languages, Database, Mail, Eye } from "lucide-react";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";
import ContactInfoManager from "@/components/admin/ContactInfoManager";
import NewsManager from "@/components/admin/NewsManager";
import ProductsManager from "@/components/admin/ProductsManager";
import AboutUsManager from "@/components/admin/AboutUsManager";
import CategoryManager from "@/components/admin/CategoryManager";
import UserManagement from "@/components/admin/UserManagement";
import SectorsManager from "@/components/admin/SectorsManager";
import CertificationsManager from "@/components/admin/CertificationsManager";
import CareersManager from "@/components/admin/CareersManager";
import ContactEnquiriesManager from "@/components/admin/ContactEnquiriesManager";
import SEOKeywordsManager from "@/components/admin/SEOKeywordsManager";
import AnalyticsManager from "@/components/admin/AnalyticsManager";
import VisitorsPanel from "@/components/admin/VisitorsPanel";
import TranslationSyncManager from "@/components/admin/TranslationSyncManager";
import TablesManager from "@/components/admin/TablesManager";
import NewsletterSubscribersManager from "@/components/admin/NewsletterSubscribersManager";
import { usePendingChanges } from "@/hooks/usePendingChanges";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs, { AdminTab } from "@/components/admin/AdminNavTabs";

const adminTabs: AdminTab[] = [
  { value: "visitors", label: "Visitors", shortLabel: "Visitors", icon: Eye },
  { value: "analytics", label: "Analytics", shortLabel: "Analytics", icon: BarChart3 },
  { value: "hero", label: "Hero Slides", shortLabel: "Hero", icon: ImageIcon },
  { value: "products", label: "Products", shortLabel: "Products", icon: Package },
  { value: "categories", label: "Categories", shortLabel: "Cats", icon: FolderOpen },
  { value: "about", label: "About Us", shortLabel: "About", icon: Info },
  { value: "contact", label: "Contact Info", shortLabel: "Contact", icon: Phone },
  { value: "news", label: "News", shortLabel: "News", icon: Newspaper },
  { value: "certifications", label: "Certifications", shortLabel: "Certs", icon: Award },
  { value: "users", label: "Users", shortLabel: "Users", icon: Users },
  { value: "sectors", label: "Sectors", shortLabel: "Sectors", icon: Factory },
  { value: "careers", label: "Careers", shortLabel: "Careers", icon: Briefcase },
  { value: "enquiries", label: "Enquiries", shortLabel: "Enquiry", icon: MessageSquare },
  { value: "subscribers", label: "Subscribers", shortLabel: "Subs", icon: Mail },
  { value: "seo", label: "SEO Keywords", shortLabel: "SEO", icon: Search },
  { value: "sync", label: "Sync Translations", shortLabel: "Sync", icon: Languages },
  { value: "tables", label: "Tables", shortLabel: "Tables", icon: Database },
  { value: "specs", label: "Specifications", shortLabel: "Specs", icon: FileText },
];

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { data: pendingChanges } = usePendingChanges("pending");
  const pendingCount = pendingChanges?.length || 0;

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader
        title="Admin Panel"
        userEmail={user?.email}
        onSignOut={signOut}
        pendingChangesCount={pendingCount}
        showPendingChangesLink
      />

      {/* Main Content */}
      <main className="container-wide py-4 sm:py-8 px-3 sm:px-6">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-1 sm:mb-2">Content Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your website content, products, and more.
          </p>
        </div>

        <Tabs defaultValue="visitors" className="space-y-4 sm:space-y-6">
          <AdminNavTabs tabs={adminTabs} />

          <div className="bg-background rounded-lg border p-3 sm:p-6">
            <TabsContent value="visitors" className="mt-0">
              <VisitorsPanel />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsManager />
            </TabsContent>

            <TabsContent value="hero" className="mt-0">
              <HeroSlidesManager />
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <ProductsManager />
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="about" className="mt-0">
              <AboutUsManager />
            </TabsContent>

            <TabsContent value="contact" className="mt-0">
              <ContactInfoManager />
            </TabsContent>

            <TabsContent value="news" className="mt-0">
              <NewsManager />
            </TabsContent>

            <TabsContent value="certifications" className="mt-0">
              <CertificationsManager />
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <UserManagement />
            </TabsContent>

            <TabsContent value="sectors" className="mt-0">
              <SectorsManager />
            </TabsContent>

            <TabsContent value="careers" className="mt-0">
              <CareersManager />
            </TabsContent>

            <TabsContent value="enquiries" className="mt-0">
              <ContactEnquiriesManager />
            </TabsContent>

            <TabsContent value="subscribers" className="mt-0">
              <NewsletterSubscribersManager />
            </TabsContent>

            <TabsContent value="seo" className="mt-0">
              <SEOKeywordsManager />
            </TabsContent>

            <TabsContent value="sync" forceMount className="mt-0 data-[state=inactive]:hidden">
              <TranslationSyncManager />
            </TabsContent>

            <TabsContent value="tables" className="mt-0">
              <TablesManager />
            </TabsContent>

            <TabsContent value="specs" className="mt-0">
              <div className="space-y-4 bg-white rounded-lg p-4 sm:p-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Product Specifications</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload and manage PDF specification documents
                  </p>
                </div>
                <Link to="/admin/specifications">
                  <Button size="sm" className="sm:size-default">
                    <FileText className="mr-2 h-4 w-4" />
                    Open Specifications Manager
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
