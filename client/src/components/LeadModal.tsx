import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LeadModal({ open, onOpenChange }: LeadModalProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit Indian mobile number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          phone: formData.mobile,
          source: "nav_start_for_free"
        }),
      });

      if (!response.ok) {
        console.error("Lead submission failed");
      }
      
      sessionStorage.setItem("lead_name", formData.fullName.trim());
      sessionStorage.setItem("lead_mobile", formData.mobile);
      
      onOpenChange(false);
      navigate("/onboarding");
    } catch (error) {
      console.error("Lead submission error:", error);
      sessionStorage.setItem("lead_name", formData.fullName.trim());
      sessionStorage.setItem("lead_mobile", formData.mobile);
      onOpenChange(false);
      navigate("/onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[400px] p-0 border-0 bg-transparent"
        style={{ background: 'none' }}
      >
        <div 
          className="relative rounded-2xl p-6"
          style={{
            background: 'rgba(20, 12, 40, 0.98)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
            data-testid="button-close-lead-modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Start your journey
          </h2>
          
          {/* Subtitle */}
          <p className="text-white/60 text-sm mb-6">
            Get your plan + CV score in minutes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-white/80 text-sm font-medium">
                Full name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1.5 h-12 bg-[#1a0033] border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                data-testid="input-lead-name"
              />
            </div>
            
            <div>
              <Label htmlFor="mobile" className="text-white/80 text-sm font-medium">
                Mobile number
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="mt-1.5 h-12 bg-[#1a0033] border-white/15 text-white placeholder:text-white/40 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                data-testid="input-lead-mobile"
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full h-12 text-base font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
                border: '1px solid rgba(167, 139, 250, 0.4)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
              disabled={isSubmitting}
              data-testid="button-lead-continue"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Continue"
              )}
            </Button>
            
            {/* Reassurance line */}
            <p className="text-white/40 text-xs text-center">
              No spam. We'll only use this to share your score & plan.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
