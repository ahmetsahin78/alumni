import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes";
import { swaggerSpec } from "./docs/swaggerSpec";
import utilityRoutes from "./routes/utility.routes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const publicDir = path.join(__dirname, "../public");

// Global Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI and local HTML to execute smoothly
  })
);
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

// Swagger UI - available at /api/swagger and /api-docs as requested
const swaggerOptions: swaggerUi.SwaggerOptions = {
  customSiteTitle: "Alumni Tracker API — Swagger Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "list",
    filter: true,
    tryItOutEnabled: true,
  },
};

app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// Raw OpenAPI JSON endpoint
app.get("/api/swagger.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

// GET / -> Root page (Serves index.html or helpful JSON)
app.get("/", (req: Request, res: Response) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(publicDir, "index.html"));
  } else {
    res.json({
      name: "Alumni Tracking System API",
      status: "running",
      documentation: "/api/swagger",
      healthCheck: "/api/health",
      alumniApi: "/api/alumni",
      usersApi: "/api/users",
    });
  }
});

// GET /about -> About page from course
app.get("/about", (req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, "about.html"));
});

// GET /alumni -> Redirect to /api/alumni
app.get("/alumni", (req: Request, res: Response) => {
  res.redirect("/api/alumni");
});

// Root Utility Routes (/hello/:name, /sum/:number1/:number2)
app.use("/", utilityRoutes);

// Main API Endpoints (/api/health, /api/alumni, /api/users)
app.use("/api", apiRoutes);

// Default 404 Handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: `Endpoint '${req.method} ${req.originalUrl}' bulunamadı.`,
    availableDocs: "/api/swagger",
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Alumni Tracking Server is active!`);
    console.log(`📡 Root URL:    http://localhost:${PORT}/`);
    console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🎓 Alumni API:  http://localhost:${PORT}/api/alumni`);
    console.log(`👤 Users API:   http://localhost:${PORT}/api/users`);
    console.log(`📖 Swagger UI:  http://localhost:${PORT}/api/swagger`);
    console.log(`======================================================\n`);
  });
}

export default app;
