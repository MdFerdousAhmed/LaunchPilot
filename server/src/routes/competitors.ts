import { Router, Response } from 'express';
import { Competitor } from '../models/Competitor';
import { Project } from '../models/Project';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { generateCompetitorAnalysis } from '../config/gemini';

const router = Router();

// Helper to verify user owns the project
async function checkProjectOwnership(projectId: string, userId: string): Promise<boolean> {
  const project = await Project.findOne({ _id: projectId, user: userId });
  return !!project;
}

// Get all competitors for a project
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

    const competitors = await Competitor.find({ project: projectId }).sort({ createdAt: -1 });
    res.json(competitors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching competitors', error });
  }
});

// Create a competitor manually
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, url, strengths, weaknesses, features, price, notes, score, projectId } = req.body;

  try {
    if (!name || !projectId) {
      res.status(400).json({ message: 'Competitor name and projectId are required' });
      return;
    }

    const isOwner = await checkProjectOwnership(projectId, req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const competitor = new Competitor({
      name,
      url,
      strengths: strengths || [],
      weaknesses: weaknesses || [],
      features: features || [],
      price: price || '',
      notes: notes || '',
      score: score || 5,
      project: projectId
    });

    await competitor.save();
    res.status(201).json(competitor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating competitor', error });
  }
});

// Analyze competitor with AI
router.post('/analyze', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, url, projectId } = req.body;

  try {
    if (!name || !projectId) {
      res.status(400).json({ message: 'Competitor name and projectId are required' });
      return;
    }

    const project = await Project.findOne({ _id: projectId, user: req.user?.id });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Call Gemini API to analyze competitor based on project details
    const aiAnalysis = await generateCompetitorAnalysis(
      project.name,
      project.description,
      name,
      url || ''
    );

    const competitor = new Competitor({
      name,
      url: url || '',
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      features: aiAnalysis.features,
      price: aiAnalysis.price,
      notes: aiAnalysis.notes,
      score: aiAnalysis.score,
      project: projectId
    });

    await competitor.save();
    res.status(201).json(competitor);
  } catch (error) {
    res.status(500).json({ message: 'Error conducting AI competitor analysis', error });
  }
});

// Update a competitor
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, url, strengths, weaknesses, features, price, notes, score } = req.body;

  try {
    const competitor = await Competitor.findById(req.params.id);
    if (!competitor) {
      res.status(404).json({ message: 'Competitor not found' });
      return;
    }

    const isOwner = await checkProjectOwnership(competitor.project.toString(), req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (name !== undefined) competitor.name = name;
    if (url !== undefined) competitor.url = url;
    if (strengths !== undefined) competitor.strengths = strengths;
    if (weaknesses !== undefined) competitor.weaknesses = weaknesses;
    if (features !== undefined) competitor.features = features;
    if (price !== undefined) competitor.price = price;
    if (notes !== undefined) competitor.notes = notes;
    if (score !== undefined) competitor.score = score;

    await competitor.save();
    res.json(competitor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating competitor', error });
  }
});

// Delete competitor
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const competitor = await Competitor.findById(req.params.id);
    if (!competitor) {
      res.status(404).json({ message: 'Competitor not found' });
      return;
    }

    const isOwner = await checkProjectOwnership(competitor.project.toString(), req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await Competitor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Competitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting competitor', error });
  }
});

export default router;
