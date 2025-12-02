import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const weeks = [
  {
    week: "Week 1",
    title: "Resume & Profile Optimization",
    whatYouLearn: [
      "AI-powered resume analysis and scoring",
      "Crafting achievement-focused bullet points that pass ATS",
      "LinkedIn optimization for recruiter visibility",
      "Identifying and filling skill gaps for target roles",
      "Building a compelling personal narrative"
    ],
    outcome: "Walk away with a polished, ATS-optimized resume and LinkedIn profile ready to attract recruiters.",
    assignment: "Submit your resume for AI scoring + expert review. Rewrite 3 bullet points using the STAR format."
  },
  {
    week: "Week 2",
    title: "Interview Fundamentals & Practice",
    whatYouLearn: [
      "Common interview formats: behavioral, case, technical",
      "Mastering the STAR method for behavioral questions",
      "Frameworks for structuring clear, confident answers",
      "Body language, tone, and first impression tips",
      "Handling tough questions: salary, gaps, weaknesses"
    ],
    outcome: "Build confidence with structured frameworks to answer any interview question clearly.",
    assignment: "Complete 2 mock interview sessions and review your recorded performance with detailed feedback."
  },
  {
    week: "Week 3",
    title: "Role-Specific Deep Dives",
    whatYouLearn: [
      "Tailored prep for your target role (PM, Analyst, Ops, Tech)",
      "Case study & problem-solving walkthroughs",
      "Understanding what hiring managers actually look for",
      "Industry-specific questions and best practices",
      "Salary negotiation strategies and offer evaluation"
    ],
    outcome: "Develop role-specific expertise that sets you apart from other candidates.",
    assignment: "Solve a role-specific case study and present your approach to mentors for feedback."
  },
  {
    week: "Week 4",
    title: "Final Prep & Job Search Launch",
    whatYouLearn: [
      "Full-length mock interviews with industry experts",
      "Refining answers based on feedback patterns",
      "Job search strategy: where to apply, how to stand out",
      "Leveraging referrals and networking effectively",
      "Post-interview follow-ups and closing techniques"
    ],
    outcome: "Graduate interview-ready with a clear job search strategy and referral network.",
    assignment: "Complete a final mock interview, finalize your target company list, and send 5 tailored applications."
  }
];

interface CurriculumSectionProps {
  onDownloadCurriculum: () => void;
}

export default function CurriculumSection({ onDownloadCurriculum }: CurriculumSectionProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const toggleWeek = (index: number) => {
    setExpandedWeek(expandedWeek === index ? null : index);
  };

  return (
    <section id="curriculum" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your 30-Day Roadmap
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A structured, hands-on program to take you from unprepared to interview-ready in 30 days.
          </p>
        </motion.div>
        
        <div className="space-y-4 mb-12">
          {weeks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover-elevate">
                <CardHeader className="cursor-pointer" onClick={() => toggleWeek(index)}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{item.week}</p>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWeek(index);
                      }}
                      aria-expanded={expandedWeek === index}
                      aria-label={`${expandedWeek === index ? 'Collapse' : 'Expand'} ${item.week} details`}
                      data-testid={`button-toggle-week-${index + 1}`}
                    >
                      {expandedWeek === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                  </div>
                </CardHeader>
                <AnimatePresence>
                  {expandedWeek === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">What You Learn:</h4>
                          <ul className="space-y-1.5 text-muted-foreground">
                            {item.whatYouLearn.map((point, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary mt-1.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-md">
                          <h4 className="font-semibold mb-1 text-foreground">Outcome:</h4>
                          <p className="text-muted-foreground">{item.outcome}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-foreground">Hands-on Assignment:</h4>
                          <p className="text-muted-foreground">{item.assignment}</p>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2"
            onClick={onDownloadCurriculum}
            data-testid="button-download-curriculum"
          >
            <Download className="h-5 w-5" />
            Download Detailed Curriculum
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
