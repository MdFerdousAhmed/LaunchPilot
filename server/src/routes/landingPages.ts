import { Router, Response } from 'express';
import { LandingPage } from '../models/LandingPage';
import { Project } from '../models/Project';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { generateLandingPage } from '../config/gemini';

const router = Router();

// Helper to verify user owns the project
async function checkProjectOwnership(projectId: string, userId: string): Promise<boolean> {
  const project = await Project.findOne({ _id: projectId, user: userId });
  return !!project;
}

// Get all landing pages for a project
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { projectId } = req.query;

  try {
    if (!projectId || typeof projectId !== 'string') {
      res.status(400).json({ message: 'projectId is required' });
      return;
    }

    const isOwner = await checkProjectOwnership(projectId, req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const pages = await LandingPage.find({ project: projectId }).sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching landing pages', error });
  }
});

// Get single landing page details
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await LandingPage.findById(req.params.id);
    if (!page) {
      res.status(404).json({ message: 'Landing page not found' });
      return;
    }

    const isOwner = await checkProjectOwnership(page.project.toString(), req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching landing page', error });
  }
});

// Generate landing page with Gemini
router.post('/generate', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { projectId, prompt, title } = req.body;

  try {
    if (!projectId || !prompt) {
      res.status(400).json({ message: 'projectId and prompt are required' });
      return;
    }

    const project = await Project.findOne({ _id: projectId, user: req.user?.id });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const aiPage = await generateLandingPage(project.name, project.description, prompt);

    const landingPage = new LandingPage({
      project: projectId,
      title: title || `Landing Page - ${new Date().toLocaleDateString()}`,
      prompt,
      htmlCode: aiPage.htmlCode,
      cssCode: aiPage.cssCode
    });

    await landingPage.save();
    res.status(201).json(landingPage);
  } catch (error) {
    res.status(500).json({ message: 'Error generating landing page with AI', error });
  }
});

// Delete landing page
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await LandingPage.findById(req.params.id);
    if (!page) {
      res.status(404).json({ message: 'Landing page not found' });
      return;
    }

    const isOwner = await checkProjectOwnership(page.project.toString(), req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await LandingPage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Landing page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting landing page', error });
  }
});

export default router;
