import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";

// Debug helpers: log uncaught exceptions and unhandled rejections so we can see why process exits
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION:', err && (err.stack || err));
});

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('UNHANDLED REJECTION:', reason);
});
import { registerRoutes } from "./newRoutes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
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

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error('Express error handler:', err);
      // Don't throw, just log
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      try {
        await setupVite(app, server);
        console.log('Vite dev server started successfully');
      } catch (e) {
        console.error('Failed to start Vite dev server:', String(e));
        // Fall through to static serving
      }
    }
    
    // Always try static serving as fallback
    try {
      serveStatic(app);
      console.log('Static serving enabled');
    } catch (e) {
      // In development without a built client, skip static serving so the API can run.
      console.warn('Skipping static file serving (no built client):', String(e));
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    const listenOptions: any = { port, host: "0.0.0.0" };
    // reusePort is not supported on some platforms (notably Windows), avoid passing it there
    if (process.platform !== "win32") {
      listenOptions.reusePort = true;
    }

    await new Promise<void>((resolve, reject) => {
      server.listen(listenOptions, () => {
        log(`serving on port ${port}`);
        resolve();
      }).on('error', reject);
    });

    console.log('Server startup complete');

  } catch (e) {
    console.error('Server startup error:', e);
    process.exit(1);
  }
})().catch(e => {
  console.error('Unhandled startup error:', e);
  process.exit(1);
});