import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Import Routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import competitorRoutes from './routes/competitors';
import landingPageRoutes from './routes/landingPages';
import copilotRoutes from './routes/copilot';
import aiRoutes from './routes/ai';
import modulesRoutes from './routes/modules';

// Load Environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Routes Mounts
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/landing-pages', landingPageRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/modules', modulesRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the LaunchPilot API Server');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
