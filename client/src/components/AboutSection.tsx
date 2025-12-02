import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            About the Program
          </h2>
          
          <p className="text-lg text-foreground/90 leading-relaxed">
            Built for graduating students and early-career professionals from India's top colleges who want to land their dream job. You'll get AI-powered resume feedback, practice with realistic mock interviews, and learn exactly what hiring managers look for. Each week blends expert guidance, hands-on practice, and personalized feedback to get you interview-ready in 30 days.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
