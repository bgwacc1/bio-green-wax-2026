import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  FileEdit,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import {
  useMyPendingChanges,
  useUpdatePendingChange,
  useDeletePendingChange,
  PendingChange,
} from "@/hooks/usePendingChanges";

const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case "create":
      return <Plus className="h-4 w-4 text-green-600" />;
    case "update":
      return <FileEdit className="h-4 w-4 text-blue-600" />;
    case "delete":
      return <Trash2 className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

const getStatusConfig = (status: string) => {
  const configs: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: React.ReactNode }> = {
    pending: { variant: "secondary", label: "Pending Review", icon: <Clock className="h-3 w-3" /> },
    approved: { variant: "default", label: "Approved", icon: <Check className="h-3 w-3" /> },
    rejected: { variant: "destructive", label: "Rejected", icon: <X className="h-3 w-3" /> },
    revision_requested: { variant: "outline", label: "Needs Revision", icon: <RotateCcw className="h-3 w-3" /> },
  };
  return configs[status] || configs.pending;
};

const formatTableName = (name: string) => {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

interface ChangeCardProps {
  change: PendingChange;
  onEdit: () => void;
  onDelete: () => void;
}

const ChangeCard = ({ change, onEdit, onDelete }: ChangeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = getStatusConfig(change.status);
  const newData = change.new_data as Record<string, unknown> | null;

  return (
    <Card className={change.status === "revision_requested" ? "border-yellow-500" : ""}>
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
            <Badge variant={statusConfig.variant} className="flex items-center gap-1">
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
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
          {/* Show revision notes if any */}
          {change.revision_notes && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Admin Feedback:
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                {change.revision_notes}
              </p>
            </div>
          )}

          {/* Preview of changes */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Changes Preview:</p>
            {newData && Object.entries(newData)
              .filter(([key]) => !["id", "created_at", "updated_at", "created_by"].includes(key))
              .slice(0, 5)
              .map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="text-muted-foreground">{key}: </span>
                  <span className="break-all">
                    {typeof value === "object" ? JSON.stringify(value) : String(value ?? "-")}
                  </span>
                </div>
              ))}
          </div>

          {/* Actions for pending or revision_requested */}
          {(change.status === "pending" || change.status === "revision_requested") && (
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

const MyPendingChanges = () => {
  const [editDialog, setEditDialog] = useState<{ open: boolean; change: PendingChange } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; changeId: string } | null>(null);
  const [editData, setEditData] = useState("");

  const { data: myChanges, isLoading } = useMyPendingChanges();
  const updateChange = useUpdatePendingChange();
  const deleteChange = useDeletePendingChange();

  const openEditDialog = (change: PendingChange) => {
    setEditDialog({ open: true, change });
    setEditData(JSON.stringify(change.new_data, null, 2));
  };

  const handleSaveEdit = async () => {
    if (!editDialog) return;
    try {
      const parsedData = JSON.parse(editData) as Json;
      await updateChange.mutateAsync({
        id: editDialog.change.id,
        newData: parsedData,
      });
      setEditDialog(null);
    } catch {
      // JSON parse error handled by form
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    await deleteChange.mutateAsync(deleteDialog.changeId);
    setDeleteDialog(null);
  };

  const pendingChanges = myChanges?.filter(c => c.status === "pending") || [];
  const revisionChanges = myChanges?.filter(c => c.status === "revision_requested") || [];
  const historyChanges = myChanges?.filter(c => ["approved", "rejected"].includes(c.status)) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">My Pending Changes</h2>
        <p className="text-sm text-muted-foreground">
          Track the status of your content changes
        </p>
      </div>

      {/* Revision Requested Section */}
      {revisionChanges.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Needs Your Attention ({revisionChanges.length})
          </h3>
          {revisionChanges.map((change) => (
            <ChangeCard
              key={change.id}
              change={change}
              onEdit={() => openEditDialog(change)}
              onDelete={() => setDeleteDialog({ open: true, changeId: change.id })}
            />
          ))}
        </div>
      )}

      {/* Pending Section */}
      {pendingChanges.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Awaiting Review ({pendingChanges.length})
          </h3>
          {pendingChanges.map((change) => (
            <ChangeCard
              key={change.id}
              change={change}
              onEdit={() => openEditDialog(change)}
              onDelete={() => setDeleteDialog({ open: true, changeId: change.id })}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {pendingChanges.length === 0 && revisionChanges.length === 0 && (
        <Card className="bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileEdit className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No pending changes</p>
            <p className="text-muted-foreground text-center">
              Start editing content using the tabs above. Your changes will appear here for review.
            </p>
          </CardContent>
        </Card>
      )}

      {/* History Section */}
      {historyChanges.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-muted-foreground">Recent History</h3>
          {historyChanges.slice(0, 5).map((change) => (
            <Card key={change.id} className="opacity-70">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getChangeTypeIcon(change.change_type)}
                    <div>
                      <CardTitle className="text-sm">
                        {formatTableName(change.table_name)}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {format(new Date(change.created_at), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusConfig(change.status).variant}>
                    {getStatusConfig(change.status).label}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog?.open} onOpenChange={(open) => !open && setEditDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pending Change</DialogTitle>
            <DialogDescription>
              Modify your change before it's reviewed. Edit the JSON data below.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editData}
            onChange={(e) => setEditData(e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateChange.isPending}>
              {updateChange.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteDialog?.open}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Change?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your pending change. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {deleteChange.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Withdraw"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyPendingChanges;
