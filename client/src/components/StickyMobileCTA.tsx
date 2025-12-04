import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function StickyMobileCTA() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const handleCheckMyCv = () => {
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      navigate("/start");
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(17, 0, 34, 0.95) 0%, rgba(10, 0, 20, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
      data-testid="sticky-mobile-cta"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="text-white/90 text-sm font-medium">
            Get your free CV score
          </p>
          <p className="text-white/60 text-xs">
            AI-powered analysis in 2 mins
          </p>
        </div>
        <Button
          onClick={handleCheckMyCv}
          className="font-semibold shrink-0"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
          }}
          data-testid="button-check-cv-mobile"
        >
          Check my CV
          <ChevronRight className="ml-1 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
