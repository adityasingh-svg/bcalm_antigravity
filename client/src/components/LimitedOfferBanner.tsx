import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Clock, BookOpen, X } from "lucide-react";

export default function LimitedOfferBanner() {
  const [, navigate] = useLocation();
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const storedEndTime = sessionStorage.getItem("offerEndTime");
    let endTime: number;

    if (storedEndTime) {
      endTime = parseInt(storedEndTime, 10);
    } else {
      endTime = Date.now() + 60 * 60 * 1000;
      sessionStorage.setItem("offerEndTime", endTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    navigate("/start");
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible || isExpired) return null;

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  return (
    <div
      onClick={handleClick}
      className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 cursor-pointer overflow-hidden"
      data-testid="banner-limited-offer"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="relative container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              <span className="hidden sm:inline">FREE: Download </span>
              <span className="sm:hidden">FREE: </span>
              "Tips & Tricks to Clear Interview"
            </span>
          </div>
          
          <div className="h-4 w-px bg-white/30 hidden sm:block" />
          
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-full">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-xs sm:text-sm font-mono font-bold">
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </span>
          </div>
          
          <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full hidden md:block">
            Click to claim
          </span>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
        aria-label="Close banner"
        data-testid="button-close-banner"
      >
        <X className="h-4 w-4 text-white/80" />
      </button>
    </div>
  );
}
