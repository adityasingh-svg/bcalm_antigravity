import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { storage } from "./storage";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Node ESM helpers for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow attaching rawBody on JSON requests (for webhooks etc.)
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

// Logging middleware for /api routes
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

async function bootstrap() {
  try {
    // Initialize storage, DB, etc.
    await storage.initialize();

    const server = await registerRoutes(app);

    // Central error handler (do NOT rethrow or it will crash the process)
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

    if (app.get("env") === "development") {
      // Vite dev middleware – only used locally
      await setupVite(app, server);
    } else {
      // ✅ PRODUCTION: serve built SPA from dist/public
      const distPublic = path.resolve(__dirname, "../dist/public");

      // Serve static assets (JS, CSS, images, etc.)
      app.use(express.static(distPublic));

      // SPA fallback – any non-API route returns index.html
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPublic, "index.html"));
      });
    }

    // Cloud Run injects PORT, default to 8080 for local runs
    const port = Number(process.env.PORT) || 8080;

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

bootstrap();
