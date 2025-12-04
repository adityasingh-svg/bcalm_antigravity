import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
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
          Get a <span className="text-primary">clear CV review</span>
        </p>
        <Button
          onClick={handleCheckMyCv}
          className="bg-primary hover:bg-primary/90 text-white font-semibold px-6"
          data-testid="button-sticky-check-cv"
        >
          Check my CV
        </Button>
      </div>
    </div>
  );
}
