import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// Routes
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";
import competitorRoutes from "./routes/competitors";
import landingPageRoutes from "./routes/landingPages";
import copilotRoutes from "./routes/copilot";
import aiRoutes from "./routes/ai";
import modulesRoutes from "./routes/modules";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "https://launch-pilot-client.vercel.app",
];

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, curl
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle OPTIONS
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/competitors", competitorRoutes);
app.use("/api/landing-pages", landingPageRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/modules", modulesRoutes);

// Health Check
app.get("/health", (_, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date(),
  });
});

// Root
app.get("/", (_, res) => {
  res.send("🚀 LaunchPilot API is running");
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server (Only Local)
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;