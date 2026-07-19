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

// Connect once
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL || "",
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/competitors", competitorRoutes);
app.use("/api/landing-pages", landingPageRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/modules", modulesRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

app.get("/", (_, res) => {
  res.send("Welcome to the LaunchPilot API Server");
});

export default app;