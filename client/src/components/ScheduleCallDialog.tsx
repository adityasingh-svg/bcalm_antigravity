import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ScheduleCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleCallDialog({ open, onOpenChange }: ScheduleCallDialogProps) {
  const openCalendly = () => {
    // @ts-ignore - Calendly is loaded via script
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/aditya-singh-bcalm/30min'
      });
    }
  };

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Call</DialogTitle>
          <DialogDescription>
            Book a 30-minute consultation with our team to learn more about the AI PM Launchpad program.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">What to expect:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Program overview and curriculum details</li>
              <li>Career support and outcomes discussion</li>
              <li>Q&A about your specific background</li>
              <li>Next steps and enrollment process</li>
            </ul>
          </div>
          
          <Button
            onClick={openCalendly}
            className="w-full"
            data-testid="button-open-calendly"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Select a Time Slot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
