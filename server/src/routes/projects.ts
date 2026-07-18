import { Router, Response } from 'express';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { generateTasksForProject } from '../config/gemini';

const router = Router();

// Create Project + Auto AI Task Generation
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, description, industry, targetAudience, launchDate } = req.body;
  const userId = req.user?.id;

  try {
    if (!name || !description) {
      res.status(400).json({ message: 'Project name and description are required' });
      return;
    }

    const project = new Project({
      name,
      description,
      industry,
      targetAudience,
      launchDate,
      user: userId,
      launchReadinessScore: 0
    });

    await project.save();

    // Trigger AI checklist generation asynchronously or synchronously
    // To give immediate success, we can generate and save the tasks synchronously
    try {
      const generatedTasks = await generateTasksForProject(name, description, industry || 'Software');
      
      const tasksToInsert = generatedTasks.map((t) => ({
        title: t.title,
        description: t.description,
        category: t.category,
        status: 'Todo',
        project: project._id
      }));

      if (tasksToInsert.length > 0) {
        await Task.insertMany(tasksToInsert);
      }
    } catch (aiErr) {
      console.error('Failed to generate initial tasks for project:', aiErr);
    }

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Get User's Projects (updates launchReadinessScore dynamically)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ user: req.user?.id }).sort({ createdAt: -1 });
    
    // Update readiness score for each project dynamically
    const updatedProjects = await Promise.all(
      projects.map(async (project) => {
        const total = await Task.countDocuments({ project: project._id });
        const done = await Task.countDocuments({ project: project._id, status: 'Done' });
        const score = total > 0 ? Math.round((done / total) * 100) : 0;
        
        if (project.launchReadinessScore !== score) {
          project.launchReadinessScore = score;
          await project.save();
        }
        return project;
      })
    );

    res.json(updatedProjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// Get Single Project
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user?.id });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const total = await Task.countDocuments({ project: project._id });
    const done = await Task.countDocuments({ project: project._id, status: 'Done' });
    const score = total > 0 ? Math.round((done / total) * 100) : 0;

    project.launchReadinessScore = score;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
});

// Update Project
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, description, industry, targetAudience, launchDate } = req.body;

  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      { name, description, industry, targetAudience, launchDate },
      { new: true }
    );

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
});

// Delete Project & Tasks
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user?.id });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Delete related items
    await Task.deleteMany({ project: project._id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

export default router;
