import { useAuth } from "@/contexts/AuthContext";
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

export const InactivityWarning = () => {
  const { showInactivityWarning, inactivityCountdown, continueSession, signOut } = useAuth();

  return (
    <AlertDialog open={showInactivityWarning}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Session Inactive</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            There has been no activity for the past 3 minutes. Do you want to continue your session?
          </AlertDialogDescription>
          <div className="mt-4 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{inactivityCountdown}</span>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-2">
            You will be logged out automatically in {inactivityCountdown} seconds.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:gap-0">
          <AlertDialogCancel onClick={signOut}>
            No, Log Out
          </AlertDialogCancel>
          <AlertDialogAction onClick={continueSession}>
            Yes, Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
