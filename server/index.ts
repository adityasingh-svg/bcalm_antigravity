import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { storage } from "./storage";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

// --- ESM helpers for __dirname (at runtime: /usr/src/app/dist) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- rawBody support for webhooks etc. ----
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// ---- logging middleware for /api routes ----
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const pathStr = req.path;
  let capturedJsonResponse: unknown;

  const originalResJson = res.json.bind(res);
  (res as any).json = (bodyJson: any, ...args: any[]) => {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (pathStr.startsWith("/api")) {
      let logLine = `${req.method} ${pathStr} ${res.statusCode} in ${duration}ms`;

      if (capturedJsonResponse != null) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// ---- PRODUCTION: serve built SPA from dist/public ----
// At runtime, this file is dist/index.js, so dist/public is "../public"
if (process.env.NODE_ENV === "production") {
  const distPublic = path.resolve(__dirname, "public");

  // Static assets
  app.use(express.static(distPublic));

  // SPA fallback (non-API routes → index.html)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPublic, "index.html"));
  });
}

// ---- Error handler (don’t crash the process) ----
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Unhandled request error:", err);

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  }
);

// ---- Start listening IMMEDIATELY so Cloud Run sees a healthy container ----
const port = Number(process.env.PORT) || 8080;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// ---- Do heavier async bootstrapping in the background ----
(async () => {
  try {
    // 1) Initialize storage / DB – but don’t block startup
    try {
      await storage.initialize();
      console.log("Storage initialized");
    } catch (err) {
      console.error("Failed to initialize storage:", err);
    }

    // 2) Register routes (API, etc.)
    try {
      await registerRoutes(app);
      console.log("Routes registered");
    } catch (err) {
      console.error("Failed to register routes:", err);
    }

    // 3) Dev-only Vite setup (never runs on Cloud Run because NODE_ENV=production)
    if (app.get("env") === "development") {
      try {
        await setupVite(app, server);
        console.log("Vite dev middleware enabled");
      } catch (err) {
        console.error("Failed to set up Vite dev middleware:", err);
      }
    }
  } catch (err) {
    console.error("Unexpected bootstrap error:", err);
    // Do NOT process.exit here; keep container running.
  }
})();
