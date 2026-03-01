import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, FileText } from "lucide-react";
import JobOpeningsManager from "./JobOpeningsManager";
import JobApplicationsManager from "./JobApplicationsManager";

const CareersManager = () => {
  return (
    <div className="space-y-4 sm:space-y-6 bg-white rounded-lg p-4 sm:p-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold">Careers Management</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage job openings and view applications
        </p>
      </div>

      <Tabs defaultValue="openings" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
          <TabsTrigger value="openings" className="flex items-center gap-2 text-xs sm:text-sm">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Job </span>Openings
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2 text-xs sm:text-sm">
            <FileText className="h-4 w-4" />
            Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="openings">
          <JobOpeningsManager />
        </TabsContent>

        <TabsContent value="applications">
          <JobApplicationsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareersManager;