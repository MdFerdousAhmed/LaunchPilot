import { Router, Response } from 'express';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { generateTasksForProject } from '../config/gemini';

const router = Router();

// Helper to verify user owns the project
async function checkProjectOwnership(projectId: string, userId: string): Promise<boolean> {
  const project = await Project.findOne({ _id: projectId, user: userId });
  return !!project;
}

// Get tasks for a project
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { projectId } = req.query;

  try {
    if (!projectId || typeof projectId !== 'string') {
      res.status(400).json({ message: 'projectId query param is required' });
      return;
    }

    const isOwner = await checkProjectOwnership(projectId, req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied: not your project' });
      return;
    }

    const tasks = await Task.find({ project: projectId }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Create task manually
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, category, status, dueDate, projectId } = req.body;

  try {
    if (!title || !projectId) {
      res.status(400).json({ message: 'Title and projectId are required' });
      return;
    }

    const isOwner = await checkProjectOwnership(projectId, req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied: not your project' });
      return;
    }

    const task = new Task({
      title,
      description,
      category,
      status,
      dueDate,
      project: projectId
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

// Update task details / status
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, category, status, dueDate } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const isOwner = await checkProjectOwnership(task.project.toString(), req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied: not your project' });
      return;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const isOwner = await checkProjectOwnership(task.project.toString(), req.user?.id || '');
    if (!isOwner) {
      res.status(403).json({ message: 'Access denied: not your project' });
      return;
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

// Regenerate all tasks using Gemini AI
router.post('/regenerate', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { projectId } = req.body;

  try {
    if (!projectId) {
      res.status(400).json({ message: 'projectId is required' });
      return;
    }

    const project = await Project.findOne({ _id: projectId, user: req.user?.id });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Delete existing tasks
    await Task.deleteMany({ project: projectId });

    // Generate new ones using Gemini
    const generatedTasks = await generateTasksForProject(project.name, project.description, project.industry || 'Software');
    
    const tasksToInsert = generatedTasks.map((t) => ({
      title: t.title,
      description: t.description,
      category: t.category,
      status: 'Todo',
      project: projectId
    }));

    if (tasksToInsert.length > 0) {
      await Task.insertMany(tasksToInsert);
    }

    const allTasks = await Task.find({ project: projectId }).sort({ createdAt: 1 });
    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error regenerating tasks', error });
  }
});

export default router;
