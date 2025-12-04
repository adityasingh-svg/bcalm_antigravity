import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";

export default function StickyMobileCTA() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(17, 0, 34, 0.98) 0%, rgba(17, 0, 34, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 16px',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-white text-sm font-medium">
            How to crack any interview
          </p>
          <Button
            onClick={() => setShowComingSoon(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6"
            data-testid="button-sticky-start"
          >
            Download for free
          </Button>
        </div>
      </div>

      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#1a0033] to-[#0d001a] border border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-white flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              Coming Soon!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-purple-200 text-lg">
              We're working on something amazing for you. Stay tuned!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
