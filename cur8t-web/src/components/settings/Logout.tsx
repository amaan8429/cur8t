import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {PiSignOut} from "react-icons/pi";
import { useToast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/nextjs";

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { signOut } = useClerk();
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const loadingToast = toast({
      title: "Logging out",
      description: "Please wait...",
    });

    try {
      await signOut();
      loadingToast.dismiss();
    } catch (error) {
      console.log("Error signing out:", error);
      loadingToast.dismiss();
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoggingOut}>
          <PiSignOut className="h-4 w-4 mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of your account and will need to sign in
            again to access your settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;
