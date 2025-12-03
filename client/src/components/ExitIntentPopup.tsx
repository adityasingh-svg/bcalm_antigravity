import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        trackEvent("exit_intent_shown", { trigger: "mouse_leave" });
      }
    };

    const timeoutId = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
        trackEvent("exit_intent_shown", { trigger: "timeout" });
      }
    }, 20000);

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      trackEvent("exit_intent_submitted", { email });
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    trackEvent("exit_intent_closed", {});
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md bg-gradient-to-br from-[#1a0a2e] to-[#0f0c29] rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          data-testid="button-close-popup"
        >
          <X className="w-5 h-5" />
        </button>
        
        {!submitted ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              Wait! Don't leave without your FREE CV Score
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-6">
              Get a free AI-powered CV Score and personalised interview roadmap in under 2 minutes.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                required
                data-testid="input-exit-email"
              />
              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-5"
                data-testid="button-exit-submit"
              >
                Get Free CV Score
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Thank you!</h3>
            <p className="text-white/70 text-sm">
              We'll send your CV Score instructions to your email shortly.
            </p>
            <Button
              onClick={handleClose}
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
              data-testid="button-exit-close"
            >
              Continue browsing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
