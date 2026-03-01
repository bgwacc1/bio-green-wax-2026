import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Clock, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminHeaderProps {
  title: string;
  userEmail?: string;
  onSignOut: () => void;
  pendingChangesCount?: number;
  showPendingChangesLink?: boolean;
}

const AdminHeader = ({
  title,
  userEmail,
  onSignOut,
  pendingChangesCount = 0,
  showPendingChangesLink = false,
}: AdminHeaderProps) => {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container-wide py-3 sm:py-4 flex items-center justify-between gap-2">
        {/* Left side - Logo and title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link to="/" className="text-base sm:text-xl font-heading font-bold text-primary shrink-0">
            Bio Green Wax
          </Link>
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <span className="font-medium text-xs sm:text-base truncate hidden sm:block">{title}</span>
        </div>

        {/* Right side - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {showPendingChangesLink && (
            <Link to="/admin/pending-changes">
              <Button
                variant={pendingChangesCount > 0 ? "default" : "outline"}
                size="sm"
                className="relative"
              >
                <Clock className="mr-2 h-4 w-4" />
                Pending Changes
                {pendingChangesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {pendingChangesCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {userEmail}
          </span>
          <Button variant="outline" size="sm" onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Right side - Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {showPendingChangesLink && pendingChangesCount > 0 && (
            <Link to="/admin/pending-changes">
              <Button variant="default" size="sm" className="relative px-2">
                <Clock className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {pendingChangesCount}
                </Badge>
              </Button>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="px-2">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="text-left">{title}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                <div className="text-sm text-muted-foreground break-all">
                  {userEmail}
                </div>
                {showPendingChangesLink && (
                  <Link to="/admin/pending-changes" className="w-full">
                    <Button
                      variant={pendingChangesCount > 0 ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Pending Changes
                      {pendingChangesCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {pendingChangesCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
