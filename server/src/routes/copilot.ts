import { Router, Response } from 'express';
import { ChatMessage } from '../models/ChatMessage';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { LandingPage } from '../models/LandingPage';
import { Competitor } from '../models/Competitor';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import {
  chatWithCopilot,
  generatePitchDeck,
  generateTasksForProject,
  generateLandingPage,
  generateCompetitorAnalysis,
  generateContent
} from '../config/gemini';

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

// Post a chat message & execute Agentic actions
router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { projectId, text, requestedActionType, actionPayload } = req.body;

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

    let actionType = requestedActionType || 'NONE';
    let actionData: any = null;
    let aiText = '';

    // Automatic Intent Detection if requestedActionType was not explicitly sent
    const lowerText = text.toLowerCase();
    if (actionType === 'NONE') {
      if (lowerText.includes('task') || lowerText.includes('milestone') || lowerText.includes('launch checklist') || lowerText.includes('roadmap')) {
        actionType = 'GENERATE_TASKS';
      } else if (lowerText.includes('landing page') || lowerText.includes('website') || lowerText.includes('hero section')) {
        actionType = 'GENERATE_LANDING_PAGE';
      } else if (lowerText.includes('pitch deck') || lowerText.includes('investor deck') || lowerText.includes('slides')) {
        actionType = 'GENERATE_PITCH_DECK';
      } else if (lowerText.includes('competitor') || lowerText.includes('swot') || lowerText.includes('threat analysis')) {
        actionType = 'ANALYZE_COMPETITOR';
      } else if (lowerText.includes('marketing copy') || lowerText.includes('blog post') || lowerText.includes('tweet') || lowerText.includes('social post')) {
        actionType = 'GENERATE_CONTENT';
      }
    }

    // Execute Agentic Action Tools based on intent
    if (actionType === 'GENERATE_TASKS') {
      const generated = await generateTasksForProject(project.name, project.description, project.industry || 'Software');
      
      // Optionally sync to MongoDB Tasks collection
      const tasksToInsert = generated.map((t) => ({
        title: t.title,
        description: t.description,
        category: t.category,
        status: 'Todo',
        project: projectId
      }));

      const inserted = await Task.insertMany(tasksToInsert);
      actionData = { tasks: inserted, count: inserted.length };
      aiText = `⚡ **Agent Execution Complete**: I have generated and synchronized **${inserted.length} custom launch milestones** for **${project.name}** to your project Task Manager.\n\nYou can review, update, or complete these tasks directly in the Task Manager or using the interactive card below.`;
    
    } else if (actionType === 'GENERATE_LANDING_PAGE') {
      const prompt = actionPayload?.prompt || text;
      const aiPage = await generateLandingPage(project.name, project.description, prompt);

      const landingPage = new LandingPage({
        project: projectId,
        title: actionPayload?.title || `Copilot Landing Page - ${new Date().toLocaleDateString()}`,
        prompt,
        htmlCode: aiPage.htmlCode,
        cssCode: aiPage.cssCode
      });
      await landingPage.save();

      actionData = { landingPage };
      aiText = `🎨 **Agent Execution Complete**: I created a new high-converting dark-theme landing page for **${project.name}**!\n\nIt features a custom headline, value propositions grid, waitlist collection form, and styled responsive CSS. You can view or customize it in the Landing Page Builder.`;
    
    } else if (actionType === 'GENERATE_PITCH_DECK') {
      const slides = await generatePitchDeck(project.name, project.description);
      actionData = { slides };
      aiText = `📊 **Agent Execution Complete**: I drafted a comprehensive **10-slide investor pitch deck** tailored for **${project.name}**.\n\nUse the interactive slide viewer below to inspect each slide's key bullet points or navigate to the dedicated Pitch Deck page.`;
    
    } else if (actionType === 'ANALYZE_COMPETITOR') {
      const compName = actionPayload?.name || (text.match(/competitor\s+([A-Za-z0-9\s]+)/i)?.[1]?.trim()) || 'Key Competitor';
      const compUrl = actionPayload?.url || '';

      const aiAnalysis = await generateCompetitorAnalysis(project.name, project.description, compName, compUrl);
      
      const competitor = new Competitor({
        name: compName,
        url: compUrl,
        strengths: aiAnalysis.strengths,
        weaknesses: aiAnalysis.weaknesses,
        features: aiAnalysis.features,
        price: aiAnalysis.price,
        notes: aiAnalysis.notes,
        score: aiAnalysis.score,
        project: projectId
      });
      await competitor.save();

      actionData = { competitor };
      aiText = `🔍 **Agent Execution Complete**: I conducted an AI SWOT analysis for **${compName}** relative to **${project.name}**.\n\nThreat score: **${aiAnalysis.score}/10**. Review the strengths, weaknesses, and positioning advice below.`;
    
    } else if (actionType === 'GENERATE_CONTENT') {
      let contentType = 'blog';
      if (lowerText.includes('social') || lowerText.includes('tweet')) contentType = 'social';
      else if (lowerText.includes('product')) contentType = 'product';
      else if (lowerText.includes('doc') || lowerText.includes('api')) contentType = 'documentation';

      const result = await generateContent(contentType, { topic: text, productName: project.name }, 'medium');
      actionData = { contentType, content: result.content };
      aiText = `✍️ **Agent Execution Complete**: Here is your custom generated **${contentType}** content for **${project.name}**! You can copy it directly using the button below.`;

    } else {
      // General strategic advice chat fallback
      aiText = await chatWithCopilot(project.name, project.description, contextHistory, text);
    }

    // Save AI message with action metadata
    const copilotMessage = new ChatMessage({
      project: projectId,
      sender: 'assistant',
      text: aiText,
      actionType,
      actionData
    });
    await copilotMessage.save();

    res.json({
      userMessage: founderMessage,
      copilotMessage: copilotMessage
    });
  } catch (error) {
    console.error('Error in AI Copilot chat agent:', error);
    res.status(500).json({ message: 'Error chatting with Copilot Agent', error });
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
