import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Save, Loader2, Phone, Mail, MapPin, MessageCircle, Smartphone } from "lucide-react";
import {
  useContactInfo,
  useUpdateContactInfo,
  useCreateContactInfo,
} from "@/hooks/useCMS";

const getIconForKey = (key: string) => {
  switch (key.toLowerCase()) {
    case "phone":
      return <Phone className="h-5 w-5" />;
    case "mobile":
      return <Smartphone className="h-5 w-5" />;
    case "email":
      return <Mail className="h-5 w-5" />;
    case "address":
      return <MapPin className="h-5 w-5" />;
    case "whatsapp":
      return <MessageCircle className="h-5 w-5" />;
    default:
      return null;
  }
};

const ContactInfoManager = () => {
  const { data: contacts, isLoading } = useContactInfo();
  const updateContact = useUpdateContactInfo();
  const createContact = useCreateContactInfo();

  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ key: "", value: "", label: "" });

  const handleValueChange = (id: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string, currentValue: string) => {
    const newValue = editValues[id];
    if (newValue !== undefined && newValue !== currentValue) {
      await updateContact.mutateAsync({ id, value: newValue });
      setEditValues((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContact.mutateAsync(newContact);
    setNewContact({ key: "", value: "", label: "" });
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg p-4 sm:p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Contact Information</h2>
          <p className="text-sm text-muted-foreground">
            Manage contact details displayed on the website
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Contact Information</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key">Key (e.g., phone, email)</Label>
                <Input
                  id="key"
                  value={newContact.key}
                  onChange={(e) =>
                    setNewContact({ ...newContact, key: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label (Display Name)</Label>
                <Input
                  id="label"
                  value={newContact.label}
                  onChange={(e) =>
                    setNewContact({ ...newContact, label: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={newContact.value}
                  onChange={(e) =>
                    setNewContact({ ...newContact, value: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createContact.isPending}>
                  {createContact.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {contacts?.map((contact) => {
          const currentValue = editValues[contact.id] ?? contact.value;
          const hasChanges = editValues[contact.id] !== undefined && editValues[contact.id] !== contact.value;

          return (
            <Card key={contact.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {getIconForKey(contact.key)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Label className="text-sm font-medium">
                      {contact.label || contact.key}
                    </Label>
                    <Input
                      value={currentValue}
                      onChange={(e) => handleValueChange(contact.id, e.target.value)}
                      className="w-full bg-white"
                    />
                    
                    {/* Save Button */}
                    <Button
                      size="sm"
                      onClick={() => handleSave(contact.id, contact.value)}
                      disabled={!hasChanges || updateContact.isPending}
                      className="w-full sm:w-auto"
                    >
                      {updateContact.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContactInfoManager;
