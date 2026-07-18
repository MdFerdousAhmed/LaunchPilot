import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK if API Key is available
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('GEMINI_API_KEY is not defined in the backend environment variables. The server will use mock AI responses.');
}

// Helper to run prompt or return mocks
async function generateText(prompt: string, mockFallback: string): Promise<string> {
  if (!genAI) {
    // Artificial delay to simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockFallback;
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return mockFallback;
  }
}

// 1. Generate Launch Tasks (returns JSON format of tasks)
export async function generateTasksForProject(
  projectName: string,
  description: string,
  industry: string
): Promise<Array<{ title: string; description: string; category: string }>> {
  const prompt = `
    You are an expert startup advisor. Create a list of exactly 10 crucial, actionable launch milestones/tasks for a startup project named "${projectName}".
    Project Description: ${description}
    Industry: ${industry}

    Categories allowed: 'Development', 'Marketing', 'Legal', 'Product', 'Launch'.
    Distribute the tasks evenly across these categories.

    Return the output ONLY as a valid JSON array of objects. Do not include markdown code block syntax (like \`\`\`json). Each object must have these exact keys:
    - "title": A short, clear task title.
    - "description": A details description of what needs to be done.
    - "category": One of 'Development', 'Marketing', 'Legal', 'Product', 'Launch'.
  `;

  const mockTasks = [
    { title: 'Define Value Proposition & Target Audience', description: 'Refine product details and narrow down exact target user persona.', category: 'Product' },
    { title: 'Incorporate Startup & Set Up Legal Entities', description: 'Address corporate registration, founders agreements, and intellectual property.', category: 'Legal' },
    { title: 'Build MVP Architecture & Tech Stack Selection', description: 'Design initial database structure and choose core tech stack components.', category: 'Development' },
    { title: 'Develop Core MVP Features', description: 'Code the minimum viable product features necessary to test with early users.', category: 'Development' },
    { title: 'Set Up Analytics & User Feedback Loops', description: 'Integrate tools like Mixpanel, Google Analytics, or hotjar to track user interactions.', category: 'Product' },
    { title: 'Draft Privacy Policy & Terms of Service', description: 'Create standard customer-facing legal agreements for the application.', category: 'Legal' },
    { title: 'Create Launch Marketing Plan & Social Media Handles', description: 'Design launch campaign, establish presence on Twitter, LinkedIn, etc.', category: 'Marketing' },
    { title: 'Set Up Landing Page & Email Collection', description: 'Deploy landing page with a waitlist form to capture early interest.', category: 'Marketing' },
    { title: 'Beta Testing with Friends and Family / Early Adopters', description: 'Launch private beta to gather feedback, fix bugs, and refine UI.', category: 'Launch' },
    { title: 'Launch on Product Hunt & Hacker News', description: 'Prepare assets, coordinate support, and launch public marketing push.', category: 'Launch' }
  ];

  try {
    const rawResult = await generateText(prompt, JSON.stringify(mockTasks));
    // Clean potential markdown blocks
    const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Failed parsing Gemini tasks response. Falling back to mocks.');
    return mockTasks;
  }
}

// 2. Generate Competitor Analysis SWOT & Price/Features
export async function generateCompetitorAnalysis(
  projectName: string,
  projectDesc: string,
  competitorName: string,
  competitorUrl: string
): Promise<{ strengths: string[]; weaknesses: string[]; features: string[]; price: string; score: number; notes: string }> {
  const prompt = `
    Analyze the competitor "${competitorName}" (${competitorUrl}) for my startup "${projectName}".
    My Startup Description: ${projectDesc}

    Generate a strategic competitor profile. 
    Return the response ONLY as a valid JSON object. Do not include markdown code block syntax. The object must contain:
    - "strengths": Array of 3 string points about what they do well.
    - "weaknesses": Array of 3 string points about what they do poorly.
    - "features": Array of 3 key features they offer.
    - "price": A brief string describing their pricing model (e.g. "$29/mo flat rate" or "Freemium").
    - "score": A threat score rating from 1 to 10 (1 = no threat, 10 = critical threat).
    - "notes": A brief paragraph of strategic positioning advice on how to compete against them.
  `;

  const mockAnalysis = {
    strengths: ['Established brand awareness', 'Broad feature suite', 'Strong customer support'],
    weaknesses: ['Expensive pricing tiers', 'Slow UI response time', 'Difficult custom integrations'],
    features: ['Real-time dashboard', 'Multi-user collaboration', 'Legacy API endpoints'],
    price: '$49 - $199/month',
    score: 7,
    notes: `To compete against ${competitorName}, focus heavily on speed and developer experience. Offer simpler custom integration guides and a more attractive, lower-priced entry tier for small startups.`
  };

  try {
    const rawResult = await generateText(prompt, JSON.stringify(mockAnalysis));
    const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Failed parsing Gemini competitor response. Falling back to mock.');
    return mockAnalysis;
  }
}

// 3. Generate Landing Page HTML & CSS
export async function generateLandingPage(
  projectName: string,
  projectDesc: string,
  customPrompt: string
): Promise<{ htmlCode: string; cssCode: string }> {
  const prompt = `
    You are an expert web designer. Generate a stunning, responsive single-page landing page website for a startup.
    Startup Name: "${projectName}"
    Description: ${projectDesc}
    Special request / theme / landing page goal: ${customPrompt}

    Design requirements:
    - Dark premium background color theme.
    - Modern styling, card components, buttons with hover effects.
    - A clean hero section with headline, subheadline, and a "Join Waitlist" input form.
    - A features grid showing 3 core benefits.
    - An FAQ or testimonials section.
    - A clean footer.
    - Fully responsive layout.
    - Use inline styles or a self-contained <style> block embedded inside the HTML.

    Return the output ONLY as a valid JSON object. Do not include markdown code block syntax. The object must have:
    - "htmlCode": A string containing the entire HTML page body (including embedded styled tags, structural markup, grids, and hero sections).
    - "cssCode": A string containing any helper CSS variables or animations that should be loaded.
  `;

  const mockHtml = `
<div style="background-color: #0b0f19; color: #f3f4f6; font-family: sans-serif; min-height: 100vh; padding: 2rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
  <header style="width: 100%; max-width: 1200px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 5rem;">
    <div style="font-size: 1.5rem; font-weight: bold; color: #3b82f6; display: flex; align-items: center; gap: 0.5rem;">
      <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${projectName}</span>
    </div>
    <a href="#waitlist" style="background-color: #1e293b; color: #fff; padding: 0.5rem 1.2rem; border-radius: 9999px; text-decoration: none; font-size: 0.9rem; transition: background-color 0.2s;">Get Started</a>
  </header>

  <main style="width: 100%; max-width: 800px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2rem;">
    <h1 style="font-size: 3.5rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.025em; margin: 0; background: linear-gradient(to right, #ffffff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      Launch Your Ideas into Orbit
    </h1>
    <p style="font-size: 1.25rem; color: #94a3b8; max-width: 600px; line-height: 1.6; margin: 0;">
      ${projectDesc}. Empowering developers and founders to automate their deployments and validate MVPs instantly.
    </p>

    <div id="waitlist" style="margin-top: 2rem; width: 100%; max-width: 480px; display: flex; gap: 0.75rem; background-color: #111827; padding: 0.5rem; border-radius: 9999px; border: 1px solid #1f2937;">
      <input type="email" placeholder="Enter your email address" style="flex: 1; background: transparent; border: none; outline: none; padding: 0.5rem 1rem; color: #fff; font-size: 1rem;" />
      <button style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; cursor: pointer; font-weight: 600; font-size: 0.95rem;">Join Waitlist</button>
    </div>

    <section style="margin-top: 6rem; width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; text-align: left;">
      <div style="background-color: #111827; padding: 1.5rem; border-radius: 12px; border: 1px solid #1f2937;">
        <div style="color: #3b82f6; font-size: 1.5rem; margin-bottom: 0.5rem;">⚡</div>
        <h3 style="color: #fff; margin: 0 0 0.5rem 0; font-size: 1.2rem;">Ultra Fast Setup</h3>
        <p style="color: #94a3b8; font-size: 0.9rem; margin: 0; line-height: 1.4;">Get fully operational in seconds with automated environment configuration.</p>
      </div>
      <div style="background-color: #111827; padding: 1.5rem; border-radius: 12px; border: 1px solid #1f2937;">
        <div style="color: #8b5cf6; font-size: 1.5rem; margin-bottom: 0.5rem;">🤖</div>
        <h3 style="color: #fff; margin: 0 0 0.5rem 0; font-size: 1.2rem;">AI Integration</h3>
        <p style="color: #94a3b8; font-size: 0.9rem; margin: 0; line-height: 1.4;">Automated copilot to guide code changes and strategic launch tasks.</p>
      </div>
      <div style="background-color: #111827; padding: 1.5rem; border-radius: 12px; border: 1px solid #1f2937;">
        <div style="color: #10b981; font-size: 1.5rem; margin-bottom: 0.5rem;">📈</div>
        <h3 style="color: #fff; margin: 0 0 0.5rem 0; font-size: 1.2rem;">Smart Analytics</h3>
        <p style="color: #94a3b8; font-size: 0.9rem; margin: 0; line-height: 1.4;">Gain insights into launch milestones, conversion metrics and competitors.</p>
      </div>
    </section>
  </main>

  <footer style="margin-top: 8rem; border-top: 1px solid #1f2937; padding-top: 2rem; width: 100%; max-width: 1200px; text-align: center; color: #4b5563; font-size: 0.85rem;">
    &copy; 2026 ${projectName}. All rights reserved. Made with LaunchPilot AI.
  </footer>
</div>
  `;

  const mockCss = `
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
      50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.7); }
      100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
    }
  `;

  try {
    const rawResult = await generateText(prompt, JSON.stringify({ htmlCode: mockHtml, cssCode: mockCss }));
    const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Failed parsing Gemini landing page response. Falling back to mock.');
    return { htmlCode: mockHtml, cssCode: mockCss };
  }
}

// 4. Chat with Startup Copilot (includes history)
export async function chatWithCopilot(
  projectName: string,
  projectDesc: string,
  chatHistory: Array<{ sender: 'user' | 'assistant'; text: string }>,
  userMessage: string
): Promise<string> {
  const historyString = chatHistory
    .map((msg) => `${msg.sender === 'user' ? 'Founder' : 'Copilot'}: ${msg.text}`)
    .join('\n');

  const prompt = `
    You are "LaunchPilot Copilot", an elite startup strategist, business mentor, and tech consultant.
    You are advising the founder of "${projectName}".
    Startup Description: ${projectDesc}

    Previous chat history:
    ${historyString}

    Founder's new message: "${userMessage}"

    Provide a professional, extremely useful, concise response. Use formatting, bolding, and bullet points where helpful. Guide them step-by-step.
  `;

  const mockReply = `
    That is a great question! For a project like **${projectName}**, I recommend addressing this in three specific phases:
    
    1. **Validate Core Demand**: Set up a simple 1-page questionnaire or standard landing page and run $50/day targeted search ads.
    2. **Focus on MVP simplicity**: Limit your features to only the core value proposition. Don't build extensive multi-tenant billing before validating that users want the utility itself.
    3. **Pre-Launch Outreach**: Build an email waitlist of at least 200 interested contacts before launching on Product Hunt.

    Would you like me to draft a marketing message or a set of features that fit this MVP structure?
  `;

  return generateText(prompt, mockReply);
}

// 5. Generate Pitch Deck Slides
export async function generatePitchDeck(
  projectName: string,
  projectDesc: string
): Promise<Array<{ slideNumber: number; title: string; bullets: string[] }>> {
  const prompt = `
    Create a standard 10-slide startup pitch deck structure for "${projectName}".
    Description: ${projectDesc}

    Generate the 10 slides:
    1. Title Slide
    2. The Problem
    3. The Solution
    4. Market Size & Opportunity (TAM, SAM, SOM)
    5. Product / How it Works
    6. Business Model / Monetization
    7. Go-To-Market Strategy
    8. Competitive Landscape
    9. Traction / Milestones
    10. The Team & Ask

    Return the output ONLY as a valid JSON array of objects. Do not include markdown code block syntax. Each object must contain:
    - "slideNumber": Number (1 to 10)
    - "title": Title of the slide
    - "bullets": Array of 3-4 descriptive bullets/content points for that slide.
  `;

  const mockPitchDeck = [
    { slideNumber: 1, title: `${projectName} - Launching Faster`, bullets: ['An AI-powered Copilot for startup founders', 'Helping validate, build, and launch MVPs', 'Pitch Deck & Landing Page creation made simple'] },
    { slideNumber: 2, title: 'The Problem: Startup Launch Inertia', bullets: ['Founders spend months building features without validation', 'High legal and marketing overhead costs', 'Competitive research is manual and time-consuming'] },
    { slideNumber: 3, title: 'The Solution: LaunchPilot Copilot', bullets: ['AI-driven task tracking and launch checklist automations', 'On-demand Landing Page generator with instant preview', 'Real-time competitive matrix mapping and positioning insights'] },
    { slideNumber: 4, title: 'Market Opportunity', bullets: ['TAM: 150 Million startups created globally each year', 'SAM: 10 Million tech-enabled founders looking for MVP builders', 'SOM: Initial focus on early-stage SaaS & software startups'] },
    { slideNumber: 5, title: 'Product Walkthrough', bullets: ['Founders sign up and input their startup concept details', 'AI instantly generates 10 tailored launch milestones', 'Chatbot provides continuous strategic feedback and creates copy'] },
    { slideNumber: 6, title: 'Business Model', bullets: ['Freemium: Basic tracking and 1 landing page generated for free', 'Pro: $29/mo for unlimited landing pages and advanced competitor reports', 'Enterprise: Custom support and white-label landing pages'] },
    { slideNumber: 7, title: 'Go-To-Market Strategy', bullets: ['Launch on Product Hunt, Hacker News, and BetaList', 'Content marketing targeting indie hackers and tech founders', 'Partnership with startup accelerators and incubators'] },
    { slideNumber: 8, title: 'Competitive Advantage', bullets: ['Unlike static templates, we offer adaptive interactive checklists', 'In-house landing page rendering engine', 'Cost-effective alternative to hiring expensive business strategists'] },
    { slideNumber: 9, title: 'Current Milestones', bullets: ['Beta product successfully designed and code completed', 'TanStack & Recharts dashboard functional', 'Pre-registering early waitlist users today'] },
    { slideNumber: 10, title: 'The Ask', bullets: ['Seeking early adopter feedback and beta testers', 'Preparing for seed round raising in Q4', 'Join us on our mission to democratize product launches'] }
  ];

  try {
    const rawResult = await generateText(prompt, JSON.stringify(mockPitchDeck));
    const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Failed parsing Gemini pitch deck response. Falling back to mock.');
    return mockPitchDeck;
  }
}

// 6. AI Content Generator
export async function generateContent(
  contentType: string,
  fields: Record<string, string>,
  length: 'short' | 'medium' | 'long'
): Promise<{ content: string }> {
  const lengthGuide = length === 'short' ? '150-250 words' : length === 'medium' ? '400-600 words' : '800-1200 words';

  let prompt = '';
  switch (contentType) {
    case 'blog':
      prompt = `You are an expert content writer. Write a compelling blog article.
Topic: ${fields.topic || 'Startup Growth'}
Target Audience: ${fields.audience || 'Tech founders'}
Tone: ${fields.tone || 'Professional'}
Length: ${lengthGuide}

Write the article with a clear headline, introduction, 2-3 body sections with subheadings, and a conclusion. Use markdown formatting (##, **, -, etc).`;
      break;
    case 'product':
      prompt = `You are a product marketing expert. Write a compelling product description.
Product Name: ${fields.productName || 'My Product'}
Category: ${fields.category || 'SaaS'}
Key Features: ${fields.features || 'Fast, Reliable, Affordable'}
Tone: ${fields.tone || 'Persuasive'}
Length: ${lengthGuide}

Write a product description with a hook, feature highlights, benefits, and a call to action. Use markdown formatting.`;
      break;
    case 'social':
      prompt = `You are a social media strategist. Write a high-engagement social media post.
Platform: ${fields.platform || 'Twitter'}
Topic: ${fields.topic || 'Product Launch'}
Goal: ${fields.goal || 'Drive signups'}
Length: ${lengthGuide}

Write the post optimized for the platform. Include hashtags, emojis, and a call to action. If Twitter, keep under 280 chars for the main hook, then provide a thread of 3-5 follow-up tweets.`;
      break;
    case 'documentation':
      prompt = `You are a technical writer. Write clear developer documentation.
Module Name: ${fields.moduleName || 'API Module'}
Description: ${fields.description || 'REST API integration'}
Tech Stack: ${fields.techStack || 'Node.js, Express, MongoDB'}
Length: ${lengthGuide}

Write documentation with an overview, quick start guide, API reference section, and common troubleshooting tips. Use markdown formatting with code blocks.`;
      break;
    default:
      prompt = `Write informative content about: ${fields.topic || 'technology'}. Length: ${lengthGuide}. Use markdown formatting.`;
  }

  const mockContents: Record<string, string> = {
    blog: `## ${fields.topic || 'How AI Is Reshaping the Startup Launch Playbook'}

The startup ecosystem has undergone a fundamental shift. What once required months of planning, hiring, and capital allocation can now be accomplished in a fraction of the time \u2014 thanks to AI-powered launch platforms.

### The Old Way vs. The New Way

Traditional startup launches followed a rigid, sequential process: write a business plan, incorporate, build an MVP over 3\u20136 months, hire a marketing team, and finally go to market. Each stage introduced delays, costs, and opportunities for momentum to die.

**The new paradigm** compresses this timeline dramatically. AI tools can generate launch checklists, draft marketing copy, analyze competitors, and even scaffold landing pages \u2014 all in a single afternoon.

### Why This Matters for Founders

- **Speed-to-market** is the strongest predictor of early-stage survival
- **Resource efficiency** means bootstrapped founders can compete with funded teams
- **Data-driven decisions** replace gut instinct with AI-analyzed market signals

### What to Do Next

Start by identifying the 3 highest-impact launch tasks for your specific industry. Use an AI checklist generator to prioritize ruthlessly, then execute in 72-hour sprints.

> The best time to launch was yesterday. The second best time is today \u2014 with AI on your side.`,

    product: `## ${fields.productName || 'LaunchPilot Pro'} \u2014 Ship Products Faster Than Ever

**Stop planning. Start launching.**

${fields.productName || 'LaunchPilot Pro'} is the all-in-one platform that transforms your startup idea into a launched product in record time.

### Key Features

- **AI-Powered Roadmaps** \u2014 Get a personalized 10-step launch checklist generated in seconds
- **Strategy Copilot** \u2014 24/7 AI advisor for pricing, positioning, and go-to-market tactics
- **Landing Page Builder** \u2014 From prompt to production-ready HTML in under 3 minutes
- **Competitor Intelligence** \u2014 Automated SWOT analysis with threat scoring

### Why Teams Choose ${fields.productName || 'LaunchPilot Pro'}

Unlike generic project management tools, ${fields.productName || 'LaunchPilot Pro'} is purpose-built for the chaotic, fast-moving world of product launches. Every feature is designed to eliminate friction between "we should build this" and "it\\'s live."

### Pricing

Start free with our base tier. Upgrade to Pro for $29/mo to unlock unlimited AI generations, priority support, and advanced analytics.

**Ready to launch?** [Get started today \u2192]`,

    social: `\ud83d\ude80 We just launched ${fields.topic || 'something incredible'} and the response has been wild.

Here\\'s what we built and why it matters \ud83e\uddf5\u2193

1/ The problem: Most founders spend 3\u20136 months planning before they ship anything. By the time they launch, the market has moved.

2/ Our solution: An AI-powered platform that generates your entire launch roadmap, marketing copy, and competitive analysis \u2014 in one afternoon.

3/ Early results:
\u2022 72-hour average time from signup to launch
\u2022 4.9\u2605 average rating from 380+ teams
\u2022 14,200+ active users across 62 countries

4/ What\\'s next: We\\'re building AI-powered content generation and smart recommendations. The goal? Make launching feel inevitable.

5/ Try it free today \u2192 [link in bio]

#startup #AI #productlaunch #buildinpublic #SaaS`,

    documentation: `# ${fields.moduleName || 'LaunchPilot API'} Documentation

## Overview

${fields.moduleName || 'The LaunchPilot API'} provides programmatic access to ${fields.description || 'core platform features including project management, AI generation, and analytics'}.

**Tech Stack:** ${fields.techStack || 'Node.js, Express, MongoDB, Gemini AI'}

## Quick Start

\`\`\`bash
# Install the SDK
npm install @launchpilot/sdk

# Initialize
import { LaunchPilot } from '@launchpilot/sdk';
const lp = new LaunchPilot({ apiKey: 'your-api-key' });
\`\`\`

## API Reference

### POST /api/projects
Create a new project.

\`\`\`json
{
  "name": "My Startup",
  "description": "An AI-powered analytics platform",
  "industry": "SaaS"
}
\`\`\`

**Response:** \`201 Created\` with the project object.

### GET /api/tasks?projectId=:id
Retrieve all tasks for a project.

### POST /api/copilot/chat
Send a message to the AI Copilot.

## Troubleshooting

| Issue | Solution |
|---|---|
| 401 Unauthorized | Check your API key is valid and included in the Authorization header |
| 429 Too Many Requests | You have exceeded the rate limit. Wait 60 seconds and retry |
| Empty AI response | Verify your GEMINI_API_KEY is set in your environment variables |`
  };

  const mockContent = mockContents[contentType] || mockContents.blog;

  try {
    const rawResult = await generateText(prompt, mockContent);
    return { content: rawResult };
  } catch (err) {
    console.warn('Failed to generate content. Falling back to mock.');
    return { content: mockContent };
  }
}

// 7. AI Smart Recommendation Engine
export async function generateRecommendations(
  startupDescription: string,
  industry: string,
  availableModules: Array<{ id: string; title: string; desc: string; category: string; price: string }>,
  feedbackHistory: Array<{ moduleId: string; action: 'accepted' | 'rejected' }>
): Promise<Array<{ moduleId: string; title: string; reason: string; confidence: number; priority: string }>> {
  const moduleList = availableModules.map((m) => `- ${m.id}: "${m.title}" (${m.category}, ${m.price}) - ${m.desc}`).join('\\n');

  const feedbackStr = feedbackHistory.length > 0
    ? `User feedback from previous recommendations:\\n${feedbackHistory.map((f) => `- ${f.moduleId}: ${f.action}`).join('\\n')}`
    : 'No previous feedback available.';

  const prompt = `You are a startup advisor and product recommendation engine for LaunchPilot, a platform that helps founders launch products.

A founder has described their startup:
"${startupDescription}"
Industry: ${industry}

Available platform modules:
${moduleList}

${feedbackStr}

Based on the startup description, industry, and any feedback, recommend the TOP 5 most relevant modules ranked by importance. Consider the feedback: if a module was "rejected", deprioritize similar modules; if "accepted", recommend similar ones.

Return ONLY a valid JSON array (no markdown). Each object must have:
- "moduleId": The exact module ID from the list
- "title": The module title
- "reason": A 1-2 sentence explanation of why this module is relevant to their specific startup
- "confidence": A number from 0.0 to 1.0 indicating match confidence
- "priority": One of "Critical", "High", "Medium", "Low"`;

  const mockRecommendations = [
    {
      moduleId: 'lc-1',
      title: 'AI Launch Checklist',
      reason: `Based on your ${industry} startup, a structured launch roadmap is essential. This module generates a customized 10-step plan covering product, legal, marketing, and launch phases specific to your domain.`,
      confidence: 0.96,
      priority: 'Critical'
    },
    {
      moduleId: 'lc-2',
      title: 'Strategy Copilot',
      reason: `Your startup description suggests complex strategic decisions ahead. The Copilot can help you refine pricing models, draft marketing hooks, and design technical architecture tailored to ${industry}.`,
      confidence: 0.91,
      priority: 'Critical'
    },
    {
      moduleId: 'lc-3',
      title: 'Landing Page Builder',
      reason: 'Every startup needs a public face. This module lets you go from idea to a production-ready landing page in under 3 minutes, which is crucial for early user acquisition.',
      confidence: 0.87,
      priority: 'High'
    },
    {
      moduleId: 'lc-4',
      title: 'Competitor Intelligence',
      reason: `Understanding the competitive landscape in ${industry} is vital before launch. Automated SWOT analysis and threat scoring will help you find positioning gaps.`,
      confidence: 0.82,
      priority: 'High'
    },
    {
      moduleId: 'lc-5',
      title: 'Pitch Deck Outliner',
      reason: 'If you plan to raise funding, a well-structured investor deck is non-negotiable. This module generates a 10-slide outline covering TAM/SAM, traction, and your ask.',
      confidence: 0.74,
      priority: 'Medium'
    }
  ];

  // Apply feedback filtering to mock
  const rejected = new Set(feedbackHistory.filter((f) => f.action === 'rejected').map((f) => f.moduleId));
  const filteredMock = mockRecommendations.filter((r) => !rejected.has(r.moduleId));

  try {
    const rawResult = await generateText(prompt, JSON.stringify(filteredMock.length > 0 ? filteredMock : mockRecommendations));
    const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Failed to parse recommendations. Falling back to mock.');
    return filteredMock.length > 0 ? filteredMock : mockRecommendations;
  }
}
