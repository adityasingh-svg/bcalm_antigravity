import { User, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyBcalmWorksSection() {
  return (
    <section 
      className="py-16 md:py-20"
      style={{ backgroundColor: '#fbfaff' }}
    >
      <div className="container mx-auto px-4" style={{ maxWidth: '1080px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Heading & Subtitle */}
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-foreground mb-4">
              Why Bcalm Works
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Built from real hiring experience, real product journeys, and real outcomes.
            </p>
          </div>
          
          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1: Learn From Top 1% Leadership */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group cursor-pointer"
              data-testid="card-instructor"
            >
              <div 
                className="h-full p-7 md:p-8 transition-all duration-300 group-hover:-translate-y-[5px]"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  borderTop: '4px solid #6A0DFF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(106, 13, 255, 0.1)' }}
                  >
                    <User className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold mb-5 text-foreground">
                  Learn from Top 1% Leadership
                </h3>
                
                {/* Bullets */}
                <div className="space-y-4">
                  <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed">
                    • Built large-scale systems at <strong className="text-foreground">Zepto, Apollo 247, Toppr & Housing.com</strong>.
                  </p>
                  <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed">
                    • Grew his career from <strong className="text-foreground">₹3.2 LPA → ₹2.4 Cr PA</strong>.
                  </p>
                  <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed">
                    • Senior Leadership experience at a <strong className="text-foreground">$7B YC-backed company</strong>.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2: 10x Your Shortlist Chances */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group cursor-pointer"
              data-testid="card-shortlist"
            >
              <div 
                className="h-full p-7 md:p-8 transition-all duration-300 group-hover:-translate-y-[5px]"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  borderTop: '4px solid #FF9F43',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 159, 67, 0.1)' }}
                  >
                    <Target className="w-6 h-6" style={{ color: '#FF9F43' }} />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold mb-5 text-foreground">
                  10x Your Shortlist Chances
                </h3>
                
                {/* Bullets */}
                <div className="space-y-4">
                  <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed">
                    • Craft a resume tailored for <strong className="text-foreground">high-growth roles</strong>, not generic applications.
                  </p>
                  <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed">
                    • Build a portfolio that proves you can solve <strong className="text-foreground">real business problems</strong>.
                  </p>
                  <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed">
                    • Use <strong className="text-foreground">insider hiring signals</strong> most candidates never see to stand out in shortlisting.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
