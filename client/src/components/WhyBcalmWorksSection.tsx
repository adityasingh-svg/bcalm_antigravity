import { User, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyBcalmWorksSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4" style={{ maxWidth: '1080px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Heading & Subtitle */}
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-3">
              Why Bcalm Works
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Built from real hiring experience, real product journeys, and real outcomes.
            </p>
          </div>
          
          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Card 1: Learn From a Product Leader */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl bg-card border border-card-border p-6 md:p-7"
              data-testid="card-instructor"
            >
              {/* Icon */}
              <div className="mb-3">
                <User className="w-6 h-6 text-primary" />
              </div>
              
              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                Learn from a Product Leader
              </h3>
              
              {/* Bullets */}
              <div className="space-y-3">
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  • Built large-scale products at Zepto, Apollo 247, Toppr & Housing.com
                </p>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  • Grew his career from ₹3.2 LPA → ₹2.4 Cr PA
                </p>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  • Senior Director of Product at a $7B YC-backed company
                </p>
              </div>
            </motion.div>

            {/* Card 2: 10x Your Shortlist Chances */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl bg-card border border-card-border p-6 md:p-7"
              data-testid="card-shortlist"
            >
              {/* Icon */}
              <div className="mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              
              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                10x Your Shortlist Chances
              </h3>
              
              {/* Bullets */}
              <div className="space-y-3">
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  • Learn how to craft a resume tailored for AI/PM roles, not generic applications
                </p>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  • Build a portfolio that proves you can solve real product problems
                </p>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  • Use insider hiring signals most candidates never see to stand out in shortlisting
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
