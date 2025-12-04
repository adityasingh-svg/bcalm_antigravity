import type { Express } from "express";
import { createServer, type Server } from "http";
import resourcesRouter from "./routes/resources";
import assessmentRouter from "./routes/assessment";
import analyticsRouter from "./routes/analytics";
import hackathonRouter from "./routes/hackathon";
import onboardingRouter from "./routes/onboarding";
import analysisRouter from "./routes/analysis";
import leadsRouter from "./routes/leads";
import express from "express";
import path from "path";
import { setupSupabaseAuth } from "./supabaseAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupSupabaseAuth(app);

  // Serve Supabase config to frontend (anon key is safe to expose)
  app.get("/api/config/supabase", (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: "Supabase not configured" });
    }
    
    res.json({
      url: supabaseUrl,
      anonKey: supabaseAnonKey
    });
  });

  app.use("/api/resources", resourcesRouter);
  app.use("/api/assessment", assessmentRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/hackathon", hackathonRouter);
  app.use("/api/onboarding", onboardingRouter);
  app.use("/api/analysis", analysisRouter);
  app.use("/api/leads", leadsRouter);
  
  app.use("/uploads/resources", express.static(path.join(process.cwd(), "uploads/resources")));
  app.use("/uploads/cv-submissions", express.static(path.join(process.cwd(), "uploads/cv-submissions")));
  app.use("/uploads/cv-analysis", express.static(path.join(process.cwd(), "uploads/cv-analysis")));

  const httpServer = createServer(app);

  return httpServer;
}
