import { Router, Response } from 'express';
import { ChatMessage } from '../models/ChatMessage';
import { Project } from '../models/Project';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { chatWithCopilot, generatePitchDeck } from '../config/gemini';

const router = Router();

// Helper to verify user owns the project
async function checkProjectOwnership(projectId: string, userId: string): Promise<boolean> {
  const project = await Project.findOne({ _id: projectId, user: userId });
  return !!project;
}

// Fetch chat messages for a project
router.get('/chat', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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

    const messages = await ChatMessage.find({ project: projectId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat messages', error });
  }
});

// Post a chat message & get AI copilot reply
router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { projectId, text } = req.body;

  try {
    if (!projectId || !text) {
      res.status(400).json({ message: 'projectId and text are required' });
      return;
    }

    const project = await Project.findOne({ _id: projectId, user: req.user?.id });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Save founder's message
    const founderMessage = new ChatMessage({
      project: projectId,
      sender: 'user',
      text
    });
    await founderMessage.save();

    // Fetch message history for context
    const history = await ChatMessage.find({ project: projectId }).sort({ createdAt: 1 }).limit(10);
    const contextHistory = history.map((msg) => ({
      sender: msg.sender as 'user' | 'assistant',
      text: msg.text
    }));

    // Generate AI response
    const aiText = await chatWithCopilot(project.name, project.description, contextHistory, text);

    // Save AI message
    const copilotMessage = new ChatMessage({
      project: projectId,
      sender: 'assistant',
      text: aiText
    });
    await copilotMessage.save();

    res.json({
      userMessage: founderMessage,
      copilotMessage: copilotMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Error chatting with Copilot', error });
  }
});

// Generate Pitch Deck Outlines
router.post('/pitch-deck', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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

    const slides = await generatePitchDeck(project.name, project.description);
    res.json({ slides });
  } catch (error) {
    res.status(500).json({ message: 'Error generating pitch deck outline', error });
  }
});

export default router;
