import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function HeroSection() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [showCongrats, setShowCongrats] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [phoneError, setPhoneError] = useState("");

  const handleGetCvScore = () => {
    navigate("/start");
  };

  const validatePhoneNumber = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return "Please enter a valid 10-digit phone number";
    }
    return "";
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }
    setPhoneError("");
    
    trackEvent("signup_form_submitted", {
      name: formData.name
    });
    
    setShowCongrats(true);
  };

  const handleCloseModal = () => {
    setShowCongrats(false);
    setFormData({ name: "", phoneNumber: "" });
  };


  return (
    <section 
      id="hero"
      className="relative overflow-hidden" 
      style={{ paddingTop: '20px' }}
    >
      {/* Dark gradient background - Seekho inspired */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #0a0014 0%, #1a0a2e 40%, #12082a 70%, #0a0014 100%)',
        }}
      />
      
      {/* Subtle radial glow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(138, 43, 226, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 pt-2 pb-4" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Top Badge - Seekho style pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 md:mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3) 0%, rgba(75, 0, 130, 0.3) 100%)',
              border: '1px solid rgba(138, 43, 226, 0.4)',
              boxShadow: '0 4px 20px rgba(138, 43, 226, 0.2)',
            }}
          >
            <span className="text-xs md:text-sm font-medium text-white/90">
              India's Fastest-Growing <span className="text-amber-400 font-semibold">AI Interview</span> Prep Platform
            </span>
          </motion.div>
          
          {/* Main Headline - Two lines, large and bold */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 md:mb-6">
            <span className="block">Crack Your Dream Job</span>
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              in 30 Days
            </span>
          </h1>
          
          {/* Form Card - Floating style */}
          <motion.div
            id="cv-form-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-[420px] mx-auto"
          >
            <div 
              className="rounded-3xl p-6 md:p-8"
              style={{
                background: 'rgba(30, 20, 50, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(138, 43, 226, 0.1)',
              }}
            >
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="text-left">
                  <Label htmlFor="name" className="text-white/80 text-sm font-medium">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Rakesh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                    required
                    data-testid="input-name"
                  />
                </div>
                
                <div className="text-left">
                  <Label htmlFor="phoneNumber" className="text-white/80 text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="9398354912"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, phoneNumber: e.target.value });
                      if (phoneError) setPhoneError("");
                    }}
                    className={`mt-1.5 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl ${phoneError ? 'border-red-500' : ''}`}
                    required
                    data-testid="input-phone"
                  />
                  {phoneError && (
                    <p className="text-red-400 text-xs mt-1">{phoneError}</p>
                  )}
                </div>
                
                <Button 
                  type="submit"
                  className="w-full h-14 text-lg font-semibold rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                  }}
                  data-testid="button-get-cv-score"
                >
                  Start for free
                  <ChevronRight className="ml-1 w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>
          
          {/* Urgency Microcopy */}
          <p className="mt-4 text-xs md:text-sm text-amber-400/80">
            37 students joined this week · Limited slots available
          </p>
        </motion.div>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      
      {/* Congratulations Popup Modal */}
      <Dialog open={showCongrats} onOpenChange={handleCloseModal}>
        <DialogContent 
          className="sm:max-w-md border-0 p-0 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a0033 0%, #0d001a 100%)',
            boxShadow: '0 25px 80px rgba(138, 43, 226, 0.4), 0 0 60px rgba(138, 43, 226, 0.2)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-8 text-center"
          >
            {/* Celebration Icon with Confetti Effect */}
            <motion.div 
              className="relative mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {/* Animated rings */}
              <motion.div
                className="absolute inset-0 w-24 h-24 mx-auto rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 w-24 h-24 mx-auto rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)' }}
                animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              
              {/* Main celebration emoji */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <motion.span 
                  className="text-6xl"
                  animate={{ 
                    rotate: [-5, 5, -5],
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  🎉
                </motion.span>
              </div>
              
              {/* Sparkle particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-amber-400"
                  style={{
                    left: `${50 + 40 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                    top: `${50 + 40 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: i * 0.2 
                  }}
                />
              ))}
            </motion.div>
            
            {/* Heading */}
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Congrats on taking first step towards your{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                dream career
              </span>
            </motion.h2>
            
            {/* Subtext */}
            <motion.p 
              className="text-purple-200 text-lg mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              We will get back in 24 hours
            </motion.p>
            
            {/* Got it button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleCloseModal}
                className="px-10 py-6 text-lg font-semibold rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5)',
                }}
                data-testid="button-got-it"
              >
                Got it
              </Button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
