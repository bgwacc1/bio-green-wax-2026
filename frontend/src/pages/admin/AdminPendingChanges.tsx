import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Check,
  X,
  RotateCcw,
  Loader2,
  Eye,
  Clock,
  FileEdit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import {
  usePendingChanges,
  useReviewPendingChange,
  useApplyPendingChange,
  useDeletePendingChange,
  PendingChange,
} from "@/hooks/usePendingChanges";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case "create":
      return <Plus className="h-4 w-4 text-green-500" />;
    case "update":
      return <FileEdit className="h-4 w-4 text-blue-500" />;
    case "delete":
      return <Trash2 className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    pending: { variant: "secondary", label: "Pending" },
    approved: { variant: "default", label: "Approved" },
    rejected: { variant: "destructive", label: "Rejected" },
    revision_requested: { variant: "outline", label: "Revision Requested" },
  };
  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const formatTableName = (name: string) => {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

interface DiffViewProps {
  original: Json | null;
  newData: Json | null;
  viewMode: "side-by-side" | "inline";
}

const DiffView = ({ original, newData, viewMode }: DiffViewProps) => {
  const originalObj = (original as Record<string, unknown>) || {};
  const newObj = (newData as Record<string, unknown>) || {};

  const allKeys = [...new Set([...Object.keys(originalObj), ...Object.keys(newObj)])];

  // Filter out internal fields
  const displayKeys = allKeys.filter(
    (key) => !["id", "created_at", "updated_at", "created_by"].includes(key)
  );

  if (viewMode === "side-by-side") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2 text-sm text-muted-foreground">Current</h4>
          <div className="space-y-2 bg-muted/30 rounded-lg p-3">
            {displayKeys.map((key) => {
              const oldVal = originalObj[key];
              const newVal = newObj[key];
              const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal);
              return (
                <div key={key} className={changed ? "bg-red-50 dark:bg-red-950/20 p-2 rounded" : "p-2"}>
                  <span className="text-xs text-muted-foreground">{key}:</span>
                  <div className="text-sm break-all">
                    {typeof oldVal === "object"
                      ? JSON.stringify(oldVal, null, 2)
                      : String(oldVal ?? "-")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2 text-sm text-muted-foreground">After Approval</h4>
          <div className="space-y-2 bg-muted/30 rounded-lg p-3">
            {displayKeys.map((key) => {
              const oldVal = originalObj[key];
              const newVal = newObj[key];
              const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal);
              return (
                <div key={key} className={changed ? "bg-green-50 dark:bg-green-950/20 p-2 rounded" : "p-2"}>
                  <span className="text-xs text-muted-foreground">{key}:</span>
                  <div className="text-sm break-all">
                    {typeof newVal === "object"
                      ? JSON.stringify(newVal, null, 2)
                      : String(newVal ?? "-")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Inline diff view
  return (
    <div className="space-y-2">
      {displayKeys.map((key) => {
        const oldVal = originalObj[key];
        const newVal = newObj[key];
        const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal);

        if (!changed) {
          return (
            <div key={key} className="p-2">
              <span className="text-xs text-muted-foreground">{key}:</span>
              <div className="text-sm">
                {typeof newVal === "object"
                  ? JSON.stringify(newVal, null, 2)
                  : String(newVal ?? "-")}
              </div>
            </div>
          );
        }

        return (
          <div key={key} className="p-2 space-y-1">
            <span className="text-xs text-muted-foreground">{key}:</span>
            <div className="text-sm bg-red-50 dark:bg-red-950/20 p-1 rounded line-through text-red-600 dark:text-red-400">
              {typeof oldVal === "object"
                ? JSON.stringify(oldVal, null, 2)
                : String(oldVal ?? "-")}
            </div>
            <div className="text-sm bg-green-50 dark:bg-green-950/20 p-1 rounded text-green-600 dark:text-green-400">
              {typeof newVal === "object"
                ? JSON.stringify(newVal, null, 2)
                : String(newVal ?? "-")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface ChangeCardProps {
  change: PendingChange;
  onApprove: () => void;
  onReject: () => void;
  onRequestRevision: () => void;
  isProcessing: boolean;
}

const ChangeCard = ({
  change,
  onApprove,
  onReject,
  onRequestRevision,
  isProcessing,
}: ChangeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"side-by-side" | "inline">("side-by-side");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getChangeTypeIcon(change.change_type)}
            <div>
              <CardTitle className="text-base">
                {change.change_type === "create" ? "New" : change.change_type === "delete" ? "Delete" : "Update"}{" "}
                {formatTableName(change.table_name)}
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(change.created_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(change.status)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="mb-4 flex gap-2">
            <Button
              variant={viewMode === "side-by-side" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("side-by-side")}
            >
              Side by Side
            </Button>
            <Button
              variant={viewMode === "inline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("inline")}
            >
              Inline
            </Button>
          </div>

          <DiffView
            original={change.original_data}
            newData={change.new_data}
            viewMode={viewMode}
          />

          {change.revision_notes && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Revision Notes:
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {change.revision_notes}
              </p>
            </div>
          )}

          {change.status === "pending" && (
            <div className="mt-4 flex gap-2">
              <Button
                onClick={onApprove}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onRequestRevision}
                disabled={isProcessing}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Request Revision
              </Button>
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={isProcessing}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

const AdminPendingChanges = () => {
  const [revisionDialog, setRevisionDialog] = useState<{
    open: boolean;
    changeId: string;
  } | null>(null);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: pendingChanges, isLoading } = usePendingChanges("pending");
  const { data: allChanges } = usePendingChanges();
  const reviewChange = useReviewPendingChange();
  const applyChange = useApplyPendingChange();
  const deleteChange = useDeletePendingChange();

  const handleApprove = async (change: PendingChange) => {
    setProcessingId(change.id);
    try {
      await reviewChange.mutateAsync({ id: change.id, action: "approve" });
      await applyChange.mutateAsync(change);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (changeId: string) => {
    setProcessingId(changeId);
    try {
      await reviewChange.mutateAsync({ id: changeId, action: "reject" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRequestRevision = (changeId: string) => {
    setRevisionDialog({ open: true, changeId });
  };

  const submitRevisionRequest = async () => {
    if (!revisionDialog) return;
    setProcessingId(revisionDialog.changeId);
    try {
      await reviewChange.mutateAsync({
        id: revisionDialog.changeId,
        action: "request_revision",
        revisionNotes,
      });
      setRevisionDialog(null);
      setRevisionNotes("");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = pendingChanges?.length || 0;
  const historyChanges = allChanges?.filter((c) => c.status !== "pending") || [];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container-wide py-4 flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-heading font-bold">Pending Changes</h1>
            <p className="text-sm text-muted-foreground">
              Review and approve content changes from content creators
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {pendingCount} pending
            </Badge>
          )}
        </div>
      </header>

      <main className="container-wide py-8">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingCount > 0 && (
                <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingChanges?.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No pending changes</p>
                  <p className="text-muted-foreground">
                    All content changes have been reviewed
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingChanges?.map((change) => (
                <ChangeCard
                  key={change.id}
                  change={change}
                  onApprove={() => handleApprove(change)}
                  onReject={() => handleReject(change.id)}
                  onRequestRevision={() => handleRequestRevision(change.id)}
                  isProcessing={processingId === change.id}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {historyChanges.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No history yet</p>
                  <p className="text-muted-foreground">
                    Reviewed changes will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              historyChanges.map((change) => (
                <Card key={change.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getChangeTypeIcon(change.change_type)}
                        <div>
                          <CardTitle className="text-base">
                            {formatTableName(change.table_name)}
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(change.created_at), "MMM d, yyyy")}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(change.status)}
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Revision Notes Dialog */}
      <Dialog
        open={revisionDialog?.open}
        onOpenChange={(open) => !open && setRevisionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Revision</DialogTitle>
            <DialogDescription>
              Provide feedback for the content creator to revise their changes.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter revision notes..."
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={submitRevisionRequest}
              disabled={!revisionNotes || reviewChange.isPending}
            >
              {reviewChange.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Feedback"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPendingChanges;
