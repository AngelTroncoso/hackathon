import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { CopilotRuntime, GoogleGenerativeAIAdapter, copilotRuntimeNodeExpressEndpoint } from "@copilotkit/runtime";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

console.log("Server module loading...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
  const app = express();
  const PORT = 3000;

  // CopilotKit Runtime
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not set. CopilotKit functionality will be limited.");
  }

  const runtime = new CopilotRuntime();
  const serviceAdapter = new GoogleGenerativeAIAdapter({
    model: "gemini-1.5-flash",
    apiKey: apiKey || "dummy-key",
  });

  app.use("/copilotkit", copilotRuntimeNodeExpressEndpoint({
    endpoint: "/copilotkit",
    runtime,
    serviceAdapter,
  }));

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      console.warn("Production build 'dist' directory not found. Please run 'npm run build' first.");
      // Fallback for container startup during build phase if needed
      app.get("*", (req, res) => {
        res.status(404).send("Application not built. Please run npm run build.");
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully listening on 0.0.0.0:${PORT}`);
    console.log(`CopilotKit endpoint ready at /copilotkit`);
  });
}

startServer().catch(err => {
  console.error("Critical failure during server startup:", err);
  process.exit(1);
});
