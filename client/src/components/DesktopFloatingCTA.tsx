import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const DISMISS_KEY = "bcalm_cta_dismissed_until";
const DISMISS_DURATION_DAYS = 7;
const SCROLL_THRESHOLD = 0.18;

export default function DesktopFloatingCTA() {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      return true;
    }
    localStorage.removeItem(DISMISS_KEY);
    return false;
  });

  useEffect(() => {
    if (isDismissed) return;

    const handleScroll = () => {
      const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercentage >= SCROLL_THRESHOLD) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const shouldHide = location.startsWith("/onboarding") || 
                     location.startsWith("/upload") || 
                     location.startsWith("/app") ||
                     location.startsWith("/start");

  if (shouldHide || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    const dismissUntil = Date.now() + DISMISS_DURATION_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, dismissUntil.toString());
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleCTAClick = () => {
    setIsVisible(false);
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      navigate("/start");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed z-40 hidden lg:block"
          style={{
            right: '24px',
            top: '58%',
            transform: 'translateY(-58%)',
          }}
          data-testid="desktop-floating-cta"
        >
          <div
            className="relative"
            style={{
              width: '260px',
              borderRadius: '16px',
              background: 'rgba(40, 25, 60, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(138, 43, 226, 0.1)',
              padding: '20px',
            }}
          >
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
              data-testid="button-dismiss-floating-cta"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="text-white/90 text-sm font-medium mb-4 pr-4">
              Get a clear CV review
            </p>

            <Button
              onClick={handleCTAClick}
              className="w-full font-semibold hover:brightness-110 transition-all"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
              }}
              data-testid="button-check-cv-floating"
            >
              Check my CV
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
