import { Router, Response, Request } from 'express';
import { generateContent, generateRecommendations } from '../config/gemini';

const router = Router();

// POST /api/ai/generate-content
// Public endpoint — no auth required
router.post('/generate-content', async (req: Request, res: Response): Promise<void> => {
  const { contentType, fields, length } = req.body;

  try {
    if (!contentType || !fields) {
      res.status(400).json({ message: 'contentType and fields are required' });
      return;
    }

    const validTypes = ['blog', 'product', 'social', 'documentation'];
    if (!validTypes.includes(contentType)) {
      res.status(400).json({ message: `contentType must be one of: ${validTypes.join(', ')}` });
      return;
    }

    const validLengths = ['short', 'medium', 'long'];
    const safeLength = validLengths.includes(length) ? length : 'medium';

    const result = await generateContent(contentType, fields, safeLength);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error generating content', error });
  }
});

// POST /api/ai/recommendations
// Public endpoint — no auth required
router.post('/recommendations', async (req: Request, res: Response): Promise<void> => {
  const { startupDescription, industry, availableModules, feedbackHistory } = req.body;

  try {
    if (!startupDescription || !industry) {
      res.status(400).json({ message: 'startupDescription and industry are required' });
      return;
    }

    const modules = availableModules || [];
    const feedback = feedbackHistory || [];

    const result = await generateRecommendations(startupDescription, industry, modules, feedback);
    res.json({ recommendations: result });
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations', error });
  }
});

export default router;
