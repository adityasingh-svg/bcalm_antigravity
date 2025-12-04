import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import AuthCard from "@/components/AuthCard";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 border-0 bg-transparent max-w-[420px] shadow-none"
        style={{ background: "transparent" }}
      >
        <VisuallyHidden>
          <DialogTitle>Sign in to BCALM</DialogTitle>
          <DialogDescription>Sign in or create an account to continue</DialogDescription>
        </VisuallyHidden>
        <AuthCard onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
