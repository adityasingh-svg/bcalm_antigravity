import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Upload, CheckCircle, Users } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

const targetRoles = [
  "Product Manager",
  "Data Analyst",
  "Software Engineer",
  "Business Analyst",
  "Consultant",
  "Marketing",
  "Operations",
  "Other"
];

const colleges = [
  { name: "IIT Delhi", abbr: "IIT-D" },
  { name: "BITS Pilani", abbr: "BITS" },
  { name: "NIT", abbr: "NIT" },
  { name: "IIM", abbr: "IIM" },
];

export default function HeroSection() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    targetRole: "",
    resume: null as File | null
  });

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.targetRole) {
      trackEvent("cv_score_step1_completed", {
        targetRole: formData.targetRole
      });
      setStep(2);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.resume) {
      trackEvent("cv_score_step2_completed", {
        targetRole: formData.targetRole,
        hasResume: true
      });
      setShowSuccess(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  return (
    <section 
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden" 
      style={{ paddingTop: '60px' }}
    >
      {/* Dark purple gradient background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e 0%, #16082a 30%, #0f0c29 60%, #0b1328 100%)',
        }}
      />
      
      {/* Subtle glow effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(106, 13, 255, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(255, 159, 67, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 md:mb-6">
            Crack Your Dream Job in 30 Days —{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              Guaranteed
            </span>
          </h1>
          
          {/* Sub-headline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-3 md:mb-4">
            Get a <span className="font-semibold text-primary">FREE AI-powered CV Score</span> + a personalised interview roadmap for the role you want.
          </p>
          
          {/* Founder Credibility */}
          <p className="text-sm md:text-base text-white/60 mb-6 md:mb-8">
            Created by <span className="text-amber-400">IIT Delhi</span> & <span className="text-amber-400">IIM Calcutta</span> founders who've hired 500+ candidates.
          </p>
          
          {/* Social Proof - College Logos */}
          <div className="mb-6 md:mb-8">
            <p className="text-xs md:text-sm text-white/50 mb-3">Trusted by students from</p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-4">
              {colleges.map((college) => (
                <div 
                  key={college.abbr}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs md:text-sm font-medium"
                >
                  {college.name}
                </div>
              ))}
            </div>
            
            {/* Student Avatars */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-500 border-2 border-[#1a0a2e] flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-[#1a0a2e]" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-[#1a0a2e]" />
              </div>
              <p className="text-xs md:text-sm text-white/70">
                <span className="font-semibold text-white">+200</span> success stories and counting
              </p>
            </div>
          </div>
          
          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
              {!showSuccess ? (
                <>
                  {/* Step Indicator */}
                  <p className="text-xs md:text-sm text-white/60 mb-4">
                    Step {step} of 2 · {step === 1 ? "Get your FREE CV Score" : "Upload your CV"}
                  </p>
                  
                  {step === 1 ? (
                    <form onSubmit={handleStep1Submit} className="space-y-4">
                      <div className="text-left">
                        <Label htmlFor="fullName" className="text-white/80 text-sm">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                          required
                          data-testid="input-fullname"
                        />
                      </div>
                      
                      <div className="text-left">
                        <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                          required
                          data-testid="input-email"
                        />
                      </div>
                      
                      <div className="text-left">
                        <Label htmlFor="targetRole" className="text-white/80 text-sm">Target Role</Label>
                        <Select 
                          value={formData.targetRole} 
                          onValueChange={(value) => setFormData({ ...formData, targetRole: value })}
                        >
                          <SelectTrigger 
                            className="mt-1 bg-white/10 border-white/20 text-white focus:ring-primary"
                            data-testid="select-target-role"
                          >
                            <SelectValue placeholder="Select your target role" />
                          </SelectTrigger>
                          <SelectContent>
                            {targetRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full text-base py-6 bg-primary hover:bg-primary/90 text-white font-semibold"
                        data-testid="button-get-cv-score"
                      >
                        Get Free CV Score
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleStep2Submit} className="space-y-4">
                      <div className="text-left">
                        <Label htmlFor="resume" className="text-white/80 text-sm">Upload Resume (PDF or DOCX)</Label>
                        <div className="mt-2">
                          <label 
                            htmlFor="resume" 
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-primary/60 transition-colors bg-white/5"
                          >
                            <Upload className="w-8 h-8 text-white/50 mb-2" />
                            <span className="text-sm text-white/70">
                              {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
                            </span>
                            <span className="text-xs text-white/40 mt-1">PDF, DOCX up to 5MB</span>
                            <input 
                              id="resume" 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.docx,.doc"
                              onChange={handleFileChange}
                              data-testid="input-resume"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-white/50 mt-2">
                          We'll analyze your CV and email you a detailed score & roadmap.
                        </p>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full text-base py-6 bg-primary hover:bg-primary/90 text-white font-semibold"
                        disabled={!formData.resume}
                        data-testid="button-submit-cv"
                      >
                        Submit CV
                      </Button>
                    </form>
                  )}
                </>
              ) : (
                /* Success State */
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">You're in!</h3>
                  <p className="text-white/70 text-sm">
                    We'll email your CV Score and roadmap within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Urgency & Reassurance Microcopy */}
          <div className="mt-4 md:mt-6 space-y-2">
            <p className="text-xs md:text-sm text-amber-400/80">
              <span className="mr-1">🎉</span> 37 students joined this week · Limited FREE CV scoring slots today
            </p>
            <p className="text-xs text-white/40">
              No spam. We only email you your report and next steps.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
