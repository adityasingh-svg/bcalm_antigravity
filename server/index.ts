import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { storage } from "./storage";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

// --- ESM helpers for __dirname from dist/index.js ---
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

// ---- main bootstrap ----
async function bootstrap() {
  const port = Number(process.env.PORT) || 8080;

  // 1) Try to init storage, but don't kill the process if it fails.
  try {
    await storage.initialize();
    console.log("Storage initialized");
  } catch (err) {
    console.error("Failed to initialize storage (continuing anyway):", err);
  }

  // 2) Try to register routes, but keep server alive even on failure.
  let server: any;
  try {
    server = await registerRoutes(app);
    console.log("Routes registered");
  } catch (err) {
    console.error("Failed to register routes (continuing anyway):", err);
  }

  // 3) Error handler (do NOT rethrow, just log + respond).
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

  // 4) Dev vs prod behaviour
  if (app.get("env") === "development" && server) {
    // Local dev: Vite middleware
    await setupVite(app, server);
  } else {
    // Production: serve built SPA from /dist/public
    // At runtime __dirname === /usr/src/app/dist
    const distPublic = path.resolve(__dirname, "public");

    // Static assets
    app.use(express.static(distPublic));

    // SPA fallback (non-API routes → index.html)
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPublic, "index.html"));
    });
  }

  // 5) Always start listening so Cloud Run sees a healthy container.
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Start the app
bootstrap().catch((err) => {
  console.error("Bootstrap error:", err);
  // Don't call process.exit here; let Cloud Run decide based on health.
});
