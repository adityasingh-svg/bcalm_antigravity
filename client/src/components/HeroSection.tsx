import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import neuralBg from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";

export default function HeroSection() {
  const [, navigate] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Please fill all fields",
        description: "Name and mobile number are required.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit Indian mobile number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          utmSource: urlParams.get("utm_source") || undefined,
          utmMedium: urlParams.get("utm_medium") || undefined,
          utmCampaign: urlParams.get("utm_campaign") || undefined,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }
      
      trackEvent("lead_submitted", {
        source: "hero_form"
      });
      
      setShowSuccess(true);
    } catch (error) {
      console.error("Lead submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="hero"
      className="relative min-h-screen overflow-hidden" 
      style={{ paddingTop: '60px' }}
    >
      {/* Layer 1: Rich multi-stop gradient background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #0a0014 0%, #110022 25%, #1a0033 50%, #110022 75%, #0a0014 100%)',
        }}
      />
      
      {/* Layer 2: Neural network AI background */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: `url(${neuralBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Layer 3: Central spotlight glow */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.15) 30%, transparent 70%)',
          }}
        />
        {/* Secondary glow for depth */}
        <div 
          className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[500px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.2) 0%, transparent 60%)',
          }}
        />
      </div>
      
      {/* Layer 4: Edge vignette for depth */}
      <div 
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 0, 20, 0.6) 100%)',
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 md:mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.2) 50%, rgba(109, 40, 217, 0.25) 100%)',
              border: '1px solid rgba(167, 139, 250, 0.4)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.25), inset 0 0 20px rgba(139, 92, 246, 0.1)',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs md:text-sm font-semibold text-white tracking-wide">
              India's Fastest-Growing AI Interview Prep Platform
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 md:mb-10">
            <span className="block whitespace-nowrap">Crack Your Dream Job</span>
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              in 30 Days
            </span>
          </h1>
          
          {/* Lead Capture Form Card */}
          <motion.div
            id="lead-form-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-[420px] mx-auto"
          >
            {/* Outer glow ring */}
            <div 
              className="relative rounded-3xl p-[1px]"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(109, 40, 217, 0.5) 100%)',
                boxShadow: '0 0 60px rgba(139, 92, 246, 0.3), 0 25px 50px rgba(0, 0, 0, 0.5)',
              }}
            >
            <div 
              className="rounded-3xl p-6 md:p-8"
              style={{
                background: 'linear-gradient(180deg, rgba(26, 0, 51, 0.98) 0%, rgba(20, 12, 40, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {!showSuccess ? (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                      <Label htmlFor="name" className="text-white/80 text-sm font-medium">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1.5 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                        required
                        data-testid="input-name"
                      />
                    </div>
                    
                    <div className="text-left">
                      <Label htmlFor="phone" className="text-white/80 text-sm font-medium">Mobile Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className="mt-1.5 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                        required
                        data-testid="input-phone"
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full h-12 text-base font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                        border: '1px solid rgba(167, 139, 250, 0.4)',
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                        textShadow: 'none',
                      }}
                      disabled={isSubmitting}
                      data-testid="button-start-free"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Start for free
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Congratulations! 🎉
                  </h3>
                  <p className="text-white/80 text-base mb-2">
                    You've taken the first step toward your dream job!
                  </p>
                  <p className="text-white/60 text-sm">
                    We'll reach out to you soon to get started.
                  </p>
                </div>
              )}
            </div>
            </div>
          </motion.div>
          
          {/* Trust Line */}
          <p className="text-sm md:text-base text-white/60 mt-8 mb-4">
            Trusted by Students from IITs, BITS, NITs & IIMs
          </p>
          
          {/* College Chips */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
            {["IIT", "BITS", "NIT", "IIM"].map((college) => (
              <span 
                key={college}
                className="px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold text-white/90"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.1) 100%)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  boxShadow: '0 2px 10px rgba(139, 92, 246, 0.15)',
                }}
              >
                {college}
              </span>
            ))}
          </div>
          
          {/* Success Stories with Avatars */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex -space-x-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-[#110022]"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
                }}
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-[#110022]"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                }}
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-[#110022]"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                }}
              />
            </div>
            <p className="text-sm text-white/70">
              <span className="font-bold text-white">200+</span> success stories
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
