import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import neuralBg from "@assets/generated_images/AI_neural_network_hero_background_86a25de9.png";

export default function HeroSection() {
  const [, navigate] = useLocation();

  const handleCheckCV = () => {
    navigate("/onboarding");
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
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-60px)]" style={{ maxWidth: '800px' }}>
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 md:mb-8">
            <span className="block whitespace-nowrap">Crack Your Dream Job</span>
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              in 30 Days
            </span>
          </h1>
          
          {/* Primary CTA Button */}
          <motion.div
            id="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <Button 
              onClick={handleCheckCV}
              className="h-14 px-10 text-lg font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                border: '1px solid rgba(167, 139, 250, 0.4)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
              data-testid="button-check-cv"
            >
              Check my CV
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            
            {/* Helper text */}
            <p className="text-white/50 text-sm">
              Free &bull; 2 min &bull; private
            </p>
          </motion.div>
          
          {/* Trust Line */}
          <p className="text-sm md:text-base text-white/60 mt-12 mb-4">
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
