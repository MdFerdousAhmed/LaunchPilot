import { Router, Response, Request } from 'express';
import { Module } from '../models/Module';

const router = Router();

// Base Listing Cards Seed Data
const BASE_SEED_MODULES = [
  {
    id: 'lc-1',
    gradient: 'from-blue-600/30 via-indigo-600/20 to-blue-900/40',
    iconName: 'CheckSquare',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-600/10 border-blue-500/20',
    title: 'AI Launch Checklist',
    desc: 'Auto-generated, categorized 10-task launch roadmap tailored to your specific startup idea and industry.',
    detailedDesc: 'The AI Launch Checklist is the central roadmap generator of LaunchPilot. By analyzing your product description, target audience, and industry using Gemini AI, it generates a comprehensive, prioritized list of 10 startup milestones split across Product, Development, Marketing, Legal, and Public Launch categories.',
    category: 'Product',
    price: 'Free',
    priceValue: 0,
    dateAdded: '2026-01-10',
    location: 'Global Cloud',
    timeEstimate: '2 min setup',
    rating: 4.9,
    reviews: 128,
    href: '/tasks',
    keySpecs: [
      { label: 'Technology', value: 'Gemini 1.5 Flash' },
      { label: 'Categories', value: 'Product, Dev, Legal, Marketing' },
      { label: 'Task Limit', value: 'Unlimited tasks per project' },
      { label: 'Export Options', value: 'PDF, CSV, Markdown' }
    ],
    reviewsList: [
      { name: 'Sarah Chen', avatar: 'SC', stars: 5, text: 'This checklist alone saved me weeks of planning. The legal milestones caught things I would have missed entirely!', date: '2026-06-12' },
      { name: 'Alex K.', avatar: 'AK', stars: 5, text: 'Super easy to set up. I love how it segments tasks so I know what to prioritize first.', date: '2026-05-30' }
    ],
    images: [
      'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
      'from-indigo-600/40 via-purple-600/20 to-indigo-950/50'
    ]
  },
  {
    id: 'lc-2',
    gradient: 'from-indigo-600/30 via-purple-600/20 to-indigo-900/40',
    iconName: 'MessageSquareCode',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-600/10 border-indigo-500/20',
    title: 'Strategy Copilot',
    desc: 'Conversational Gemini AI advisor for pricing, copywriting, technical architecture, and go-to-market strategy.',
    detailedDesc: 'The Strategy Copilot acts as a 24/7 startup advisor in your pocket. Powered by Gemini, the Copilot has access to your project profile and details.',
    category: 'AI',
    price: 'Premium',
    priceValue: 19,
    dateAdded: '2026-02-15',
    location: 'US-East Server',
    timeEstimate: 'Always on',
    rating: 4.8,
    reviews: 94,
    href: '/copilot',
    keySpecs: [
      { label: 'Base Model', value: 'Gemini 1.5 Pro' },
      { label: 'Context Limit', value: '100k Tokens' }
    ],
    reviewsList: [
      { name: 'David Miller', avatar: 'DM', stars: 5, text: 'I treated this like a senior developer and product manager in one.', date: '2026-07-02' }
    ],
    images: [
      'from-indigo-600/40 via-purple-600/20 to-indigo-950/50',
      'from-purple-600/40 via-blue-600/20 to-purple-950/50'
    ]
  },
  {
    id: 'lc-3',
    gradient: 'from-purple-600/30 via-blue-600/20 to-purple-900/40',
    iconName: 'Globe',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-600/10 border-purple-500/20',
    title: 'Landing Page Builder',
    desc: 'Prompt-to-HTML landing page generator. Preview responsive code live in a split-screen iframe — export instantly.',
    detailedDesc: 'The Landing Page Builder translates plain text prompts into full HTML and CSS landing page templates.',
    category: 'Marketing',
    price: 'Free',
    priceValue: 0,
    dateAdded: '2026-03-24',
    location: 'Global Cloud',
    timeEstimate: '< 3 min',
    rating: 4.9,
    reviews: 211,
    href: '/landing-page',
    keySpecs: [
      { label: 'Language Output', value: 'HTML5, CSS3, Tailwind' }
    ],
    reviewsList: [],
    images: []
  },
  {
    id: 'lc-4',
    gradient: 'from-blue-700/30 via-indigo-500/20 to-blue-800/40',
    iconName: 'TrendingUp',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-600/10 border-blue-500/20',
    title: 'Competitor Intelligence',
    desc: 'AI-powered SWOT analysis with pricing models, threat scores (1–10), and radar chart visualizations.',
    detailedDesc: 'Competitor Intelligence scans existing players in your industry to map out market gaps.',
    category: 'Research',
    price: 'Premium',
    priceValue: 19,
    dateAdded: '2026-04-18',
    location: 'US-East Server',
    timeEstimate: '1 min scan',
    rating: 4.7,
    reviews: 76,
    href: '/competitor',
    keySpecs: [],
    reviewsList: [],
    images: []
  },
  {
    id: 'lc-5',
    gradient: 'from-indigo-700/30 via-blue-500/20 to-purple-800/40',
    iconName: 'Presentation',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-600/10 border-indigo-500/20',
    title: 'Pitch Deck Outliner',
    desc: 'Gemini-crafted 10-slide investor pitch structure — TAM/SAM, problem, solution, traction, and funding ask.',
    detailedDesc: 'The Pitch Deck Outliner guides you through structuring a high-converting 10-slide investor deck.',
    category: 'Investment',
    price: 'Premium',
    priceValue: 29,
    dateAdded: '2026-05-05',
    location: 'US-West Server',
    timeEstimate: '< 1 min',
    rating: 4.8,
    reviews: 53,
    href: '/pitch-deck',
    keySpecs: [],
    reviewsList: [],
    images: []
  },
  {
    id: 'lc-6',
    gradient: 'from-purple-700/30 via-indigo-500/20 to-blue-800/40',
    iconName: 'BarChart3',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-600/10 border-purple-500/20',
    title: 'Launch Readiness Score',
    desc: 'Real-time progress gauge on your dashboard — calculated live from completed vs pending launch milestones.',
    detailedDesc: 'The Launch Readiness Score calculates a dynamic percentage score based on your active milestones.',
    category: 'Analytics',
    price: 'Free',
    priceValue: 0,
    dateAdded: '2026-05-20',
    location: 'Global Cloud',
    timeEstimate: 'Auto-tracked',
    rating: 4.9,
    reviews: 182,
    href: '/dashboard',
    keySpecs: [],
    reviewsList: [],
    images: []
  },
  {
    id: 'lc-7',
    gradient: 'from-blue-600/20 via-purple-700/20 to-indigo-800/40',
    iconName: 'CheckCircle2',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-600/10 border-blue-500/20',
    title: 'Task Management Board',
    desc: 'Kanban-style task tracker with Todo, In Progress, and Done states. Filter by category. Delete or add tasks manually.',
    detailedDesc: 'The Task Management Board houses your launch roadmap.',
    category: 'Productivity',
    price: 'Free',
    priceValue: 0,
    dateAdded: '2026-06-01',
    location: 'Global Cloud',
    timeEstimate: 'Instant',
    rating: 4.7,
    reviews: 99,
    href: '/tasks',
    keySpecs: [],
    reviewsList: [],
    images: []
  },
  {
    id: 'lc-8',
    gradient: 'from-indigo-600/20 via-blue-700/20 to-purple-800/40',
    iconName: 'Users',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-600/10 border-indigo-500/20',
    title: 'Multi-Project Workspace',
    desc: 'Create and manage multiple startup ideas in one account. Switch projects instantly from the sidebar project picker.',
    detailedDesc: 'Multi-Project Workspace enables serial founders to incubate several ideas simultaneously.',
    category: 'Workspace',
    price: 'Free',
    priceValue: 0,
    dateAdded: '2026-06-15',
    location: 'Global Cloud',
    timeEstimate: 'Unlimited',
    rating: 4.8,
    reviews: 141,
    href: '/dashboard',
    keySpecs: [],
    reviewsList: [],
    images: []
  }
];

// Helper to seed modules if database is empty
async function seedModulesIfEmpty() {
  const count = await Module.countDocuments();
  if (count === 0) {
    console.log('Seeding default base modules in MongoDB...');
    await Module.insertMany(BASE_SEED_MODULES);
  }
}

// GET /api/modules
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    await seedModulesIfEmpty();
    const modules = await Module.find().sort({ createdAt: 1 });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules', error });
  }
});

// POST /api/modules
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const moduleData = req.body;
    const newModule = new Module({
      ...moduleData,
      isCustom: true
    });
    await newModule.save();
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating module', error });
  }
});

// DELETE /api/modules/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Module.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting module', error });
  }
});

export default router;
