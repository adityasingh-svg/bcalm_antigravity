import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

const SUGGESTED_ROLES = [
  'Product Manager',
  'Product Analyst',
  'Data Analyst',
  'Business Analyst',
  'Data Scientist',
  'Software Engineer',
  'UX Designer',
  'Marketing Manager'
];

const STATUS_OPTIONS = [
  'Student / Fresher',
  'Working Professional',
  'Switching Careers'
];

const EXPERIENCE_OPTIONS = [
  { value: '0', label: '0 years' },
  { value: '1', label: '1–2 years' },
  { value: '3', label: '3–5 years' },
  { value: '6', label: '6–9 years' },
  { value: '10', label: '10+ years' }
];

interface ChangeProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile?: {
    current_status?: string | null;
    target_role?: string | null;
    years_experience?: number | null;
  } | null;
  onSave?: () => void;
}

export default function ChangeProfileModal({ open, onOpenChange, profile, onSave }: ChangeProfileModalProps) {
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [targetRole, setTargetRole] = useState<string>("");
  const [yearsExperience, setYearsExperience] = useState<string>("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && profile) {
      setCurrentStatus(profile.current_status || "");
      setTargetRole(profile.target_role || "");
      setYearsExperience(profile.years_experience?.toString() || "");
    }
  }, [open, profile]);

  useEffect(() => {
    if (currentStatus === 'Student / Fresher' && !yearsExperience) {
      setYearsExperience('0');
    }
  }, [currentStatus]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiRequest("PATCH", "/api/profile", {
        current_status: currentStatus || null,
        target_role: targetRole || null,
        years_experience: yearsExperience ? parseInt(yearsExperience) : null
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profile/me'] });
      
      onSave?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-[#0E0A1A] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-center text-[#F5F2FF]">Tune your CV review</DialogTitle>
          <DialogDescription className="text-center text-[#8B84A6]">
            This helps us score more accurately.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <Select value={currentStatus} onValueChange={setCurrentStatus}>
            <SelectTrigger className="bg-[#141026] border-white/10 text-[#F5F2FF]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-[#141026] border-white/10">
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status} className="text-[#F5F2FF]">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={roleOpen} onOpenChange={setRoleOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={roleOpen}
                className="w-full justify-between bg-[#141026] border-white/10 text-[#F5F2FF] hover:bg-[#191233]"
              >
                {targetRole || "Select or type a role"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-[#141026] border-white/10">
              <Command className="bg-transparent">
                <CommandInput 
                  placeholder="Type a role..." 
                  value={targetRole}
                  onValueChange={setTargetRole}
                  className="text-[#F5F2FF]"
                />
                <CommandList>
                  <CommandEmpty className="text-[#8B84A6] py-2 text-center text-sm">
                    Press enter to use custom role
                  </CommandEmpty>
                  <CommandGroup>
                    {SUGGESTED_ROLES.filter(role => 
                      role.toLowerCase().includes(targetRole.toLowerCase())
                    ).map((role) => (
                      <CommandItem
                        key={role}
                        value={role}
                        onSelect={() => {
                          setTargetRole(role);
                          setRoleOpen(false);
                        }}
                        className="text-[#EAE6FF]"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            targetRole === role ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {role}
                      </CommandItem>
                    ))}
                    <CommandItem
                      value="not-sure"
                      onSelect={() => {
                        setTargetRole("");
                        setRoleOpen(false);
                      }}
                      className="text-[#8B84A6] italic border-t border-white/5 mt-1 pt-2"
                    >
                      Not sure yet — score me for general readiness
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Select value={yearsExperience} onValueChange={setYearsExperience}>
            <SelectTrigger className="bg-[#141026] border-white/10 text-[#F5F2FF]">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent className="bg-[#141026] border-white/10">
              {EXPERIENCE_OPTIONS.map((exp) => (
                <SelectItem key={exp.value} value={exp.value} className="text-[#F5F2FF]">
                  {exp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-white/12 text-[#B7B0CE] hover:bg-white/5 hover:text-[#EAE6FF]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#6D4CFF] hover:bg-[#7C5CFF] text-white"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
