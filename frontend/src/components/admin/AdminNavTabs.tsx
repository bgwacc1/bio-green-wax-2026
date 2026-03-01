import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";

export interface AdminTab {
  value: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  badge?: number;
}

interface AdminNavTabsProps {
  tabs: AdminTab[];
}

const AdminNavTabs = ({ tabs }: AdminNavTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 h-auto gap-1.5 sm:gap-2 bg-transparent p-0">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-sm px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 text-[10px] sm:text-xs md:text-sm relative min-h-[52px] sm:min-h-0"
        >
          <tab.icon className="h-4 w-4 shrink-0" />
          <span className="hidden md:inline truncate">{tab.label}</span>
          <span className="md:hidden text-center leading-tight">{tab.shortLabel}</span>
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
              {tab.badge > 99 ? "99+" : tab.badge}
            </span>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default AdminNavTabs;
