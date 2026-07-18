import {
  CheckSquare,
  MessageSquareCode,
  Globe,
  TrendingUp,
  Presentation,
  BarChart3,
  CheckCircle2,
  Users,
  LucideIcon,
} from 'lucide-react';

export interface Review {
  name: string;
  avatar: string;
  stars: number;
  text: string;
  date: string;
}

export interface ListingCard {
  id: string;
  gradient: string;
  icon: LucideIcon;
  iconName: string;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
  detailedDesc: string;
  category: string;
  price: string;
  priceValue: number; // for sorting/filtering
  dateAdded: string;
  location: string;
  timeEstimate: string;
  rating: number;
  reviews: number;
  href: string; // The URL to launch the interactive workspace module
  keySpecs: { label: string; value: string }[];
  reviewsList: Review[];
  images: string[];
}

export const LISTING_CARDS: ListingCard[] = [
  {
    id: 'lc-1',
    gradient: 'from-blue-600/30 via-indigo-600/20 to-blue-900/40',
    icon: CheckSquare,
    iconName: 'CheckSquare',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-600/10 border-blue-500/20',
    title: 'AI Launch Checklist',
    desc: 'Auto-generated, categorized 10-task launch roadmap tailored to your specific startup idea and industry.',
    detailedDesc: 'The AI Launch Checklist is the central roadmap generator of LaunchPilot. By analyzing your product description, target audience, and industry using Gemini AI, it generates a comprehensive, prioritized list of 10 startup milestones split across Product, Development, Marketing, Legal, and Public Launch categories. You can track progress in real-time, check off tasks, and get instant guidance on how to accomplish each step.',
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
      { label: 'Export Options', value: 'PDF, CSV, Markdown' },
    ],
    reviewsList: [
      { name: 'Sarah Chen', avatar: 'SC', stars: 5, text: 'This checklist alone saved me weeks of planning. The legal milestones caught things I would have missed entirely!', date: '2026-06-12' },
      { name: 'Alex K.', avatar: 'AK', stars: 5, text: 'Super easy to set up. I love how it segments tasks so I know what to prioritize first.', date: '2026-05-30' },
      { name: 'Maria Lopez', avatar: 'ML', stars: 4, text: 'Very detailed roadmap, though I wish I could assign tasks to team members directly.', date: '2026-05-14' },
    ],
    images: [
      'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
      'from-indigo-600/40 via-purple-600/20 to-indigo-950/50',
      'from-purple-600/40 via-blue-600/20 to-purple-950/50',
    ],
  },
  {
    id: 'lc-2',
    gradient: 'from-indigo-600/30 via-purple-600/20 to-indigo-900/40',
    icon: MessageSquareCode,
    iconName: 'MessageSquareCode',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-600/10 border-indigo-500/20',
    title: 'Strategy Copilot',
    desc: 'Conversational Gemini AI advisor for pricing, copywriting, technical architecture, and go-to-market strategy.',
    detailedDesc: 'The Strategy Copilot acts as a 24/7 startup advisor in your pocket. Powered by Gemini, the Copilot has access to your project profile and details. You can ask it to draft marketing hooks, outline system design diagrams, design pricing packages, write database schemas, or coach you through hard founder dilemmas.',
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
      { label: 'Context Limit', value: '100k Tokens' },
      { label: 'Response Speed', value: '< 1.5 seconds' },
      { label: 'Specialization', value: 'SaaS Architecture & GTM' },
    ],
    reviewsList: [
      { name: 'David Miller', avatar: 'DM', stars: 5, text: 'I treated this like a senior developer and product manager in one. Incredible responses on backend database selection!', date: '2026-07-02' },
      { name: 'Jessica T.', avatar: 'JT', stars: 4, text: 'Very context-aware! Appreciated that it remembered my target audience details across sessions.', date: '2026-06-25' },
    ],
    images: [
      'from-indigo-600/40 via-purple-600/20 to-indigo-950/50',
      'from-purple-600/40 via-blue-600/20 to-purple-950/50',
      'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
    ],
  },
  {
    id: 'lc-3',
    gradient: 'from-purple-600/30 via-blue-600/20 to-purple-900/40',
    icon: Globe,
    iconName: 'Globe',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-600/10 border-purple-500/20',
    title: 'Landing Page Builder',
    desc: 'Prompt-to-HTML landing page generator. Preview responsive code live in a split-screen iframe — export instantly.',
    detailedDesc: 'The Landing Page Builder translates plain text prompts into full HTML and CSS landing page templates. With an integrated live preview pane (split-screen code editor & iframe render), founders can visualize their landing page designs instantly. Edit the generated code directly in the browser and click copy to deploy to platforms like Netlify, Vercel, or GitHub Pages.',
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
      { label: 'Language Output', value: 'HTML5, CSS3, Tailwind (inline)' },
      { label: 'Preview Mode', value: 'Interactive Sandbox Iframe' },
      { label: 'Hosting Support', value: 'Direct Copy/Paste Ready' },
      { label: 'Custom Blocks', value: 'Hero, Features, Pricing, Form' },
    ],
    reviewsList: [
      { name: 'Marcus Webb', avatar: 'MW', stars: 5, text: 'Had my product waitlist page up in exactly three minutes. The inline Tailwind CSS layout was flawless.', date: '2026-06-30' },
      { name: 'Clara S.', avatar: 'CS', stars: 5, text: 'I am not a frontend developer, but this tool let me build a highly professional presentation page instantly.', date: '2026-06-20' },
    ],
    images: [
      'from-purple-600/40 via-blue-600/20 to-purple-950/50',
      'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
      'from-indigo-600/40 via-purple-600/20 to-indigo-950/50',
    ],
  },
  {
    id: 'lc-4',
    gradient: 'from-blue-700/30 via-indigo-500/20 to-blue-800/40',
    icon: TrendingUp,
    iconName: 'TrendingUp',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-600/10 border-blue-500/20',
    title: 'Competitor Intelligence',
    desc: 'AI-powered SWOT analysis with pricing models, threat scores (1–10), and radar chart visualizations.',
    detailedDesc: 'Competitor Intelligence scans existing players in your industry to map out market gaps. By feeding the competitor profile into Gemini, LaunchPilot computes automated SWOT analyses, identifies monetization and feature gaps, assigns a Competitive Threat Score (from 1 to 10), and renders a beautiful comparative radar chart.',
    category: 'Research',
    price: 'Premium',
    priceValue: 19,
    dateAdded: '2026-04-18',
    location: 'US-East Server',
    timeEstimate: '1 min scan',
    rating: 4.7,
    reviews: 76,
    href: '/competitor',
    keySpecs: [
      { label: 'Visualization', value: 'Recharts Responsive Radar' },
      { label: 'Threat Metrics', value: 'Pricing, Features, Moat, Speed' },
      { label: 'SWOT Breakdown', value: 'Strengths, Weaknesses, Ops, Threats' },
      { label: 'Update Frequency', value: 'Live Crawl Analysis' },
    ],
    reviewsList: [
      { name: 'Priya Nair', avatar: 'PN', stars: 5, text: 'The radar chart helped us find a critical feature gap that our direct competitor was completely ignoring.', date: '2026-05-19' },
      { name: 'Tomas E.', avatar: 'TE', stars: 4, text: 'Very helpful positioning insights. The threat scoring feels realistic.', date: '2026-05-02' },
    ],
    images: [
      'from-blue-700/40 via-indigo-500/20 to-blue-850/50',
      'from-indigo-600/40 via-purple-600/20 to-indigo-950/50',
      'from-purple-600/40 via-blue-600/20 to-purple-950/50',
    ],
  },
  {
    id: 'lc-5',
    gradient: 'from-indigo-700/30 via-blue-500/20 to-purple-800/40',
    icon: Presentation,
    iconName: 'Presentation',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-600/10 border-indigo-500/20',
    title: 'Pitch Deck Outliner',
    desc: 'Gemini-crafted 10-slide investor pitch structure — TAM/SAM, problem, solution, traction, and funding ask.',
    detailedDesc: 'The Pitch Deck Outliner guides you through structuring a high-converting 10-slide investor deck. Based on your project metrics, user feedback, and financial model, it produces structured slide-by-slide outlines including problem validation, solution highlights, TAM/SAM/SOM market estimation, business model, and the seed round ask.',
    category: 'Investment',
    price: 'Premium',
    priceValue: 29, // slightly higher for sorting testing
    dateAdded: '2026-05-05',
    location: 'US-West Server',
    timeEstimate: '< 1 min',
    rating: 4.8,
    reviews: 53,
    href: '/pitch-deck',
    keySpecs: [
      { label: 'Slide Count', value: '10 Standard Slides' },
      { label: 'Output File', value: 'Markdown Outline, JSON Export' },
      { label: 'Target Audience', value: 'Venture Capital & Angel Investors' },
      { label: 'Guidance Type', value: 'Content, Visuals & Presentation Script' },
    ],
    reviewsList: [
      { name: 'Kenji S.', avatar: 'KS', stars: 5, text: 'This outline forced us to simplify our product slides. We presented last week and got highly positive feedback!', date: '2026-07-10' },
      { name: 'Amanda P.', avatar: 'AP', stars: 4, text: 'Concise and hits all the key points VCs look for. Excellent starting point.', date: '2026-06-18' },
    ],
    images: [
      'from-indigo-700/40 via-blue-500/20 to-purple-850/50',
      'from-purple-600/40 via-blue-600/20 to-purple-950/50',
      'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
    ],
  },
  {
    id: 'lc-6',
    gradient: 'from-purple-700/30 via-indigo-500/20 to-blue-800/40',
    icon: BarChart3,
    iconName: 'BarChart3',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-600/10 border-purple-500/20',
    title: 'Launch Readiness Score',
    desc: 'Real-time progress gauge on your dashboard — calculated live from completed vs pending launch milestones.',
    detailedDesc: 'The Launch Readiness Score calculates a dynamic percentage score based on your active milestones. The score tracks your progress across Product, Development, Legal, Marketing, and Launch categories, updating automatically as you mark tasks completed in your Kanban dashboard.',
    category: 'Analytics',
    price: 'Free',
    priceValue: 0,
    dateAdded: '2026-05-20',
    location: 'Global Cloud',
    timeEstimate: 'Auto-tracked',
    rating: 4.9,
    reviews: 182,
    href: '/dashboard',
    keySpecs: [
      { label: 'Metrics tracked', value: 'Tasks completed, category coverage' },
      { label: 'Dashboard widget', value: 'Radial Gauge' },
      { label: 'Update frequency', value: 'Real-time' },
      { label: 'Calculated on', value: 'MongoDB tasks collection state' },
    ],
    reviewsList: [
      { name: 'Vikram R.', avatar: 'VR', stars: 5, text: 'Watching the readiness gauge move up toward 100% is incredibly satisfying. Kept me motivated!', date: '2026-07-14' },
      { name: 'Lucy H.', avatar: 'LH', stars: 5, text: 'Helps us stay focused on the core milestones instead of getting lost in details.', date: '2026-07-01' },
    ],
    images: [
      'from-purple-700/40 via-indigo-500/20 to-blue-850/50',
      'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
      'from-indigo-600/40 via-purple-600/20 to-indigo-950/50',
    ],
  },
  {
    id: 'lc-7',
    gradient: 'from-blue-600/20 via-purple-700/20 to-indigo-800/40',
    icon: CheckCircle2,
    iconName: 'CheckCircle2',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-600/10 border-blue-500/20',
    title: 'Task Management Board',
    desc: 'Kanban-style task tracker with Todo, In Progress, and Done states. Filter by category. Delete or add tasks manually.',
    detailedDesc: 'The Task Management Board houses your launch roadmap. It organizes milestones into distinct boards (Todo, In Progress, Done) allowing drag-and-drop workflow tracking. Users can filter by project category, add custom tasks, edit milestone summaries, or delete tasks.',
    category: 'Productivity',
    price: 'Free',
    priceValue: 0,
    dateAdded: '2026-06-01',
    location: 'Global Cloud',
    timeEstimate: 'Instant',
    rating: 4.7,
    reviews: 99,
    href: '/tasks',
    keySpecs: [
      { label: 'Interface', value: 'Kanban Columns' },
      { label: 'Database Storage', value: 'MongoDB Atlas' },
      { label: 'Filtering', value: 'By category & completion state' },
      { label: 'Custom Tasks', value: 'Supported' },
    ],
    reviewsList: [
      { name: 'Nate D.', avatar: 'ND', stars: 5, text: 'Fast, responsive interface. Syncs instantly with the MongoDB backend.', date: '2026-06-15' },
      { name: 'Sofia B.', avatar: 'SB', stars: 4, text: 'Simple but effective Kanban board. Works great on tablet too.', date: '2026-06-10' },
    ],
    images: [
      'from-blue-600/30 via-purple-700/30 to-indigo-850/50',
      'from-indigo-600/40 via-purple-600/20 to-indigo-950/50',
      'from-purple-600/40 via-blue-600/20 to-purple-950/50',
    ],
  },
  {
    id: 'lc-8',
    gradient: 'from-indigo-600/20 via-blue-700/20 to-purple-800/40',
    icon: Users,
    iconName: 'Users',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-600/10 border-indigo-500/20',
    title: 'Multi-Project Workspace',
    desc: 'Create and manage multiple startup ideas in one account. Switch projects instantly from the sidebar project picker.',
    detailedDesc: 'Multi-Project Workspace enables serial founders to incubate several ideas simultaneously. You can switch between active projects with a single click in the sidebar, loading separate checklists, competitor maps, and landing page codebases instantly.',
    category: 'Workspace',
    price: 'Free',
    priceValue: 0,
    dateAdded: '2026-06-15',
    location: 'Global Cloud',
    timeEstimate: 'Unlimited',
    rating: 4.8,
    reviews: 141,
    href: '/dashboard',
    keySpecs: [
      { label: 'Project Limit', value: 'Unlimited' },
      { label: 'State isolation', value: 'Per project collections' },
      { label: 'Quick Picker', value: 'Dropdown sidebar' },
      { label: 'Collab Mode', value: 'Single User (Personal Workspace)' },
    ],
    reviewsList: [
      { name: 'Eric V.', avatar: 'EV', stars: 5, text: 'I launch 3-4 side projects a year. Having a separate checklist and competitor dashboard for each of them is a lifesaver.', date: '2026-07-05' },
      { name: 'Julie K.', avatar: 'JK', stars: 4, text: 'Very clean switcher. Keeps all context separated and tidy.', date: '2026-06-28' },
    ],
    images: [
      'from-indigo-600/30 via-blue-700/30 to-purple-850/50',
      'from-purple-600/40 via-blue-600/20 to-purple-950/50',
      'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
    ],
  },
];

export const iconMap: Record<string, LucideIcon> = {
  CheckSquare,
  MessageSquareCode,
  Globe,
  TrendingUp,
  Presentation,
  BarChart3,
  CheckCircle2,
  Users,
};

import { apiRequest } from '../../utils/api';

export async function fetchCombinedModules(): Promise<ListingCard[]> {
  try {
    const serverModules = await apiRequest<any[]>('/modules');
    return serverModules.map((item: any) => ({
      ...item,
      icon: iconMap[item.iconName] || CheckSquare,
    }));
  } catch (error) {
    console.warn('Failed to fetch modules from MongoDB. Falling back to local storage...', error);
    return getCombinedModules();
  }
}

export function getCombinedModules(): ListingCard[] {
  if (typeof window === 'undefined') {
    return LISTING_CARDS;
  }
  const stored = localStorage.getItem('custom_modules');
  if (!stored) {
    return LISTING_CARDS;
  }
  try {
    const customList = JSON.parse(stored);
    const resolvedCustomList = customList.map((item: any) => ({
      ...item,
      icon: iconMap[item.iconName] || CheckSquare,
    }));
    return [...LISTING_CARDS, ...resolvedCustomList];
  } catch (e) {
    console.error('Failed to parse custom modules:', e);
    return LISTING_CARDS;
  }
}

export async function addCustomModule(moduleData: Omit<ListingCard, 'icon'> & { iconName: string }) {
  // Sync to database if possible
  try {
    await apiRequest('/modules', {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  } catch (error) {
    console.error('Failed to save module to MongoDB, saving to local storage fallback:', error);
  }

  // Local storage fallback for absolute durability
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('custom_modules');
  let currentList = [];
  if (stored) {
    try {
      currentList = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  currentList.push(moduleData);
  localStorage.setItem('custom_modules', JSON.stringify(currentList));
}

export async function deleteCustomModule(id: string) {
  // Sync delete to database if possible
  try {
    await apiRequest(`/modules/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete module from MongoDB, removing from local storage fallback:', error);
  }

  // Local storage fallback
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('custom_modules');
  if (!stored) return;
  try {
    const list = JSON.parse(stored);
    const updated = list.filter((m: any) => m.id !== id);
    localStorage.setItem('custom_modules', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}


