import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, LogOut, Loader2, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/AuthModal";
import ChangeProfileModal from "@/components/ChangeProfileModal";

export default function Navbar() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [changeProfileOpen, setChangeProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCVReview = () => {
    const onboardingData = sessionStorage.getItem("cv_onboarding");
    if (onboardingData) {
      navigate("/upload");
    } else {
      navigate("/onboarding");
    }
  };

  const scrollToHeroCTA = () => {
    const heroSection = document.getElementById('hero-cta');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      navigate('/');
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last) || user.email?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: '60px',
          background: 'rgba(17, 0, 34, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container mx-auto max-w-6xl h-full">
          <div className="flex items-center justify-between px-4 md:px-6 gap-4 h-full">
            <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">BCALM</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white/60" />
              ) : isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  {/* CV Review - subtle text link */}
                  <button
                    onClick={handleCVReview}
                    className="text-white/70 text-sm font-medium hover:text-white transition-colors"
                    data-testid="link-cv-review"
                  >
                    CV Review
                  </button>
                  
                  {/* Start for free - primary CTA */}
                  <Button
                    onClick={scrollToHeroCTA}
                    size="sm"
                    className="font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #5B21B6 100%)',
                      border: '1px solid rgba(196, 181, 253, 0.3)',
                    }}
                    data-testid="button-start-free-nav"
                  >
                    Start for free
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="button-user-menu">
                        <Avatar className="h-8 w-8 border border-white/20">
                          <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                          <AvatarFallback className="bg-primary/50 text-white text-xs">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-white/80 text-sm font-medium">
                          {user.firstName || user.email?.split('@')[0]}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setChangeProfileOpen(true)} className="cursor-pointer" data-testid="button-change-profile">
                        <Settings className="mr-2 h-4 w-4" />
                        Change Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" data-testid="button-logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* CV Review - subtle text link */}
                  <button
                    onClick={handleCVReview}
                    className="text-white/70 text-sm font-medium hover:text-white transition-colors"
                    data-testid="link-cv-review"
                  >
                    CV Review
                  </button>
                  
                  {/* Start for free - primary CTA */}
                  <Button
                    onClick={scrollToHeroCTA}
                    size="sm"
                    className="font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #5B21B6 100%)',
                      border: '1px solid rgba(196, 181, 253, 0.3)',
                    }}
                    data-testid="button-start-free-nav"
                  >
                    Start for free
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      
      <ChangeProfileModal 
        open={changeProfileOpen} 
        onOpenChange={setChangeProfileOpen}
        profile={user ? {
          current_status: (user as any).current_status,
          target_role: (user as any).target_role,
          years_experience: (user as any).years_experience
        } : null}
      />
    </>
  );
}
