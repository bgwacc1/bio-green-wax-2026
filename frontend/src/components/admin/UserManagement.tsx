import { useState } from "react";
import {
  Search,
  Shield,
  ShieldOff,
  User,
  Mail,
  Calendar,
  Clock,
  Loader2,
  Plus,
  Trash2,
  Edit,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminUsers,
  useManageUserRole,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  AdminUser,
} from "@/hooks/useUserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    action: "add" | "remove";
    userId: string;
    role: "admin" | "content_creator";
    userEmail: string;
  } | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string;
    userEmail: string;
  } | null>(null);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    user: AdminUser;
  } | null>(null);

  // Form states
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "content_creator">("content_creator");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useAdminUsers(1, 100, debouncedSearch);
  const manageRole = useManageUserRole();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();

  const handleSearch = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  };

  const handleRoleAction = (
    action: "add" | "remove",
    user: AdminUser,
    role: "admin" | "content_creator"
  ) => {
    setRoleDialog({
      open: true,
      action,
      userId: user.id,
      role,
      userEmail: user.email || "this user",
    });
  };

  const confirmRoleAction = async () => {
    if (!roleDialog) return;
    await manageRole.mutateAsync({
      action: roleDialog.action,
      userId: roleDialog.userId,
      role: roleDialog.role,
    });
    setRoleDialog(null);
  };

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) return;
    await createUser.mutateAsync({
      email: newEmail,
      password: newPassword,
      role: newRole,
    });
    setCreateDialog(false);
    setNewEmail("");
    setNewPassword("");
    setNewRole("content_creator");
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog) return;
    await deleteUser.mutateAsync(deleteDialog.userId);
    setDeleteDialog(null);
  };

  const handleEditUser = async () => {
    if (!editDialog) return;
    const updateData: { userId: string; email?: string; password?: string } = {
      userId: editDialog.user.id,
    };
    if (editEmail && editEmail !== editDialog.user.email) {
      updateData.email = editEmail;
    }
    if (editPassword) {
      updateData.password = editPassword;
    }
    if (updateData.email || updateData.password) {
      await updateUser.mutateAsync(updateData);
    }
    setEditDialog(null);
    setEditEmail("");
    setEditPassword("");
  };

  const openEditDialog = (user: AdminUser) => {
    setEditDialog({ open: true, user });
    setEditEmail(user.email || "");
    setEditPassword("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load users: {error.message}</p>
      </div>
    );
  }

  const users = data?.users || [];
  const adminCount = users.filter((u) => u.roles.includes("admin")).length;
  const creatorCount = users.filter((u) => u.roles.includes("content_creator")).length;

  return (
    <div className="space-y-4 sm:space-y-6 bg-white rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">User Management</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create, edit, and manage users and their roles
          </p>
        </div>
        <Button onClick={() => setCreateDialog(true)} className="w-full sm:w-auto" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-muted/50 rounded-lg p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg sm:text-2xl font-bold">{users.length}</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-accent/10 rounded-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg sm:text-2xl font-bold">{adminCount}</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-secondary/50 rounded-lg">
              <Pencil className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg sm:text-2xl font-bold">{creatorCount}</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground">Creators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List - Mobile-friendly cards */}
      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="border rounded-lg p-6 sm:p-8 text-center text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-3 sm:p-4 bg-card hover:shadow-sm transition-shadow"
            >
              <div className="space-y-3">
                {/* User header - email and badges */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm sm:text-base truncate">
                          {user.email}
                        </span>
                        {user.id === currentUser?.id && (
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      {/* Roles */}
                      <div className="flex gap-1 flex-wrap mt-1">
                        {user.roles.length === 0 ? (
                          <Badge variant="secondary" className="text-[10px] sm:text-xs">No Role</Badge>
                        ) : (
                          user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant={role === "admin" ? "default" : "secondary"}
                              className="text-[10px] sm:text-xs"
                            >
                              {role === "content_creator" ? "Creator" : role}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status badge - desktop */}
                  <div className="hidden sm:block flex-shrink-0">
                    {user.email_confirmed_at ? (
                      <Badge
                        variant="outline"
                        className="bg-secondary text-primary border-primary/20"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-muted text-muted-foreground border-muted-foreground/20"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Joined {format(new Date(user.created_at), "MMM d, yyyy")}</span>
                  </div>
                  {user.last_sign_in_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Last seen {format(new Date(user.last_sign_in_at), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  {/* Status badge - mobile */}
                  <div className="sm:hidden">
                    {user.email_confirmed_at ? (
                      <Badge
                        variant="outline"
                        className="bg-secondary text-primary border-primary/20 text-[10px]"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-muted text-muted-foreground border-muted-foreground/20 text-[10px]"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {/* Role management buttons */}
                  {user.roles.includes("admin") ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleRoleAction("remove", user, "admin")}
                      disabled={user.id === currentUser?.id || manageRole.isPending}
                    >
                      <ShieldOff className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Remove Admin</span>
                      <span className="sm:hidden">-Admin</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleRoleAction("add", user, "admin")}
                      disabled={manageRole.isPending}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Make Admin</span>
                      <span className="sm:hidden">+Admin</span>
                    </Button>
                  )}

                  {user.roles.includes("content_creator") ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleRoleAction("remove", user, "content_creator")}
                      disabled={manageRole.isPending}
                    >
                      <ShieldOff className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Remove Creator</span>
                      <span className="sm:hidden">-Creator</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleRoleAction("add", user, "content_creator")}
                      disabled={manageRole.isPending}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Make Creator</span>
                      <span className="sm:hidden">+Creator</span>
                    </Button>
                  )}

                  <div className="flex-1" />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => openEditDialog(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() =>
                      setDeleteDialog({
                        open: true,
                        userId: user.id,
                        userEmail: user.email || "this user",
                      })
                    }
                    disabled={user.id === currentUser?.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new admin or content creator account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as "admin" | "content_creator")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content_creator">Content Creator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCreateDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={!newEmail || !newPassword || createUser.isPending}
              className="w-full sm:w-auto"
            >
              {createUser.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialog?.open} onOpenChange={(open) => !open && setEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user email or password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Enter new password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditDialog(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={updateUser.isPending} className="w-full sm:w-auto">
              {updateUser.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog?.open}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteDialog?.userEmail}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUser.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Confirmation Dialog */}
      <AlertDialog
        open={roleDialog?.open}
        onOpenChange={(open) => !open && setRoleDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {roleDialog?.action === "add" ? "Add" : "Remove"}{" "}
              {roleDialog?.role === "content_creator" ? "Content Creator" : roleDialog?.role} role?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {roleDialog?.action === "add"
                ? `This will grant ${roleDialog?.role === "content_creator" ? "content creator" : roleDialog?.role} privileges to ${roleDialog?.userEmail}.`
                : `This will revoke ${roleDialog?.role === "content_creator" ? "content creator" : roleDialog?.role} privileges from ${roleDialog?.userEmail}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleAction}>
              {manageRole.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
