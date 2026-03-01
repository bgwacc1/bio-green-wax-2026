import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { 
  ImageIcon, 
  Phone, 
  Newspaper, 
  Package, 
  Info, 
  FolderOpen,
  Clock,
  FileEdit,
  Award,
} from "lucide-react";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";
import ContactInfoManager from "@/components/admin/ContactInfoManager";
import NewsManager from "@/components/admin/NewsManager";
import ProductsManager from "@/components/admin/ProductsManager";
import AboutUsManager from "@/components/admin/AboutUsManager";
import CategoryManager from "@/components/admin/CategoryManager";
import CertificationsManager from "@/components/admin/CertificationsManager";
import { useMyPendingChanges } from "@/hooks/usePendingChanges";
import MyPendingChanges from "@/components/admin/MyPendingChanges";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs, { AdminTab } from "@/components/admin/AdminNavTabs";

const ContentCreatorDashboard = () => {
  const { user, signOut, isAdmin, isContentCreator } = useAuth();
  const { data: myChanges } = useMyPendingChanges();

  const pendingCount = myChanges?.filter(c => c.status === "pending").length || 0;
  const revisionCount = myChanges?.filter(c => c.status === "revision_requested").length || 0;

  const contentCreatorTabs: AdminTab[] = [
    { value: "my-changes", label: "My Changes", shortLabel: "Changes", icon: Clock, badge: pendingCount + revisionCount },
    { value: "hero", label: "Hero Slides", shortLabel: "Hero", icon: ImageIcon },
    { value: "products", label: "Products", shortLabel: "Products", icon: Package },
    { value: "categories", label: "Categories", shortLabel: "Cats", icon: FolderOpen },
    { value: "about", label: "About Us", shortLabel: "About", icon: Info },
    { value: "contact", label: "Contact Info", shortLabel: "Contact", icon: Phone },
    { value: "news", label: "News", shortLabel: "News", icon: Newspaper },
    { value: "certifications", label: "Certifications", shortLabel: "Certs", icon: Award },
  ];

  // If user is admin, redirect them to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // If user is not a content creator, show access denied
  if (!isContentCreator) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            You don't have permission to access this page.
          </p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader
        title="Content Creator"
        userEmail={user?.email}
        onSignOut={signOut}
      />

      {/* Main Content */}
      <main className="container-wide py-4 sm:py-8 px-3 sm:px-6">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-1 sm:mb-2">Content Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create and edit content. Changes require admin approval.
          </p>
          
          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
            {pendingCount > 0 && (
              <Badge variant="secondary" className="text-xs sm:text-sm py-1">
                <Clock className="h-3 w-3 mr-1" />
                {pendingCount} pending
              </Badge>
            )}
            {revisionCount > 0 && (
              <Badge variant="outline" className="text-xs sm:text-sm py-1 border-yellow-500 text-yellow-600">
                <FileEdit className="h-3 w-3 mr-1" />
                {revisionCount} revision
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="my-changes" className="space-y-4 sm:space-y-6">
          <AdminNavTabs tabs={contentCreatorTabs} />

          <div className="bg-background rounded-lg border p-3 sm:p-6">
            <TabsContent value="my-changes" className="mt-0">
              <MyPendingChanges />
            </TabsContent>

            <TabsContent value="hero" className="mt-0">
              <ContentCreatorNote />
              <HeroSlidesManager />
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <ContentCreatorNote />
              <ProductsManager />
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <ContentCreatorNote />
              <CategoryManager />
            </TabsContent>

            <TabsContent value="about" className="mt-0">
              <ContentCreatorNote />
              <AboutUsManager />
            </TabsContent>

            <TabsContent value="contact" className="mt-0">
              <ContentCreatorNote />
              <ContactInfoManager />
            </TabsContent>

            <TabsContent value="news" className="mt-0">
              <ContentCreatorNote />
              <NewsManager />
            </TabsContent>

            <TabsContent value="certifications" className="mt-0">
              <ContentCreatorNote />
              <CertificationsManager />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

const ContentCreatorNote = () => (
  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
      <strong>Note:</strong> Your changes will be submitted for admin approval before going live.
    </p>
  </div>
);

export default ContentCreatorDashboard;
