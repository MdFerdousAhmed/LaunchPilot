import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// Import Routes
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";
import competitorRoutes from "./routes/competitors";
import landingPageRoutes from "./routes/landingPages";
import copilotRoutes from "./routes/copilot";
import aiRoutes from "./routes/ai";
import modulesRoutes from "./routes/modules";

// Load Environment Variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "https://launch-pilot-client.vercel.app",
];

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

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

// Handle Preflight Requests
app.options("*", cors());

app.use(express.json());

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
    status: "healthy",
    timestamp: new Date(),
  });
});

// Root Route
app.get("/", (_, res) => {
  res.send("🚀 Welcome to the LaunchPilot API Server");
});

// Start Server (Local Only)
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;