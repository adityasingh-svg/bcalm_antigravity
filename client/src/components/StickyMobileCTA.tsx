import { Button } from "@/components/ui/button";

export default function StickyMobileCTA() {
  const scrollToForm = () => {
    const formCard = document.getElementById('cv-form-card');
    if (formCard) {
      const navbarHeight = 60;
      const offset = 20;
      const elementPosition = formCard.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
          Get <span className="text-primary">FREE</span> CV Score
        </p>
        <Button
          onClick={scrollToForm}
          className="bg-primary hover:bg-primary/90 text-white font-semibold px-6"
          data-testid="button-sticky-start"
        >
          Start Now
        </Button>
      </div>
    </div>
  );
}
