export type NavLink = {
  label: string;
  href: string;
};

export type FooterLink = {
  label: string;
  href: string;
  title?: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type Testimonial = {
  id: string;
  title: string;
  date: string;
  author: string;
  quote: string;
};

export type PricingFeature = {
  text: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  popular?: boolean;
  enterprise?: boolean;
  features: PricingFeature[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FeatureCard = {
  id: string;
  title: string;
  description: string;
  colSpan: 'lg:col-span-3' | 'lg:col-span-2';
  minHeight?: string;
};

const NGUYEN_TEMPLATE_BASE = '/templates/nguyen';

export const nguyenNavLinks: NavLink[] = [
  { label: 'Features', href: `${NGUYEN_TEMPLATE_BASE}#features` },
  { label: 'Solution', href: `${NGUYEN_TEMPLATE_BASE}#solution` },
  { label: 'Pricing', href: `${NGUYEN_TEMPLATE_BASE}#pricing` },
  { label: 'Changelog', href: `${NGUYEN_TEMPLATE_BASE}/changelog` },
];

export const nguyenHero = {
  title: 'The Unified Workspace',
  titleMuted: 'for AI-Native Teams.',
  description:
    'Route tasks to the right AI, automate workflows, and keep your team in sync from idea to production.',
  primaryCta: { label: 'Get Started', href: '/pricing' },
  secondaryCta: { label: 'View Pricing', href: '/pricing' },
  video: {
    thumbnailSrc:
      '/templates/nguyen/blue-sky-gradient-watercolor-background-free-vector.jpg',
    thumbnailAlt: 'Blue sky gradient watercolor background',
    videoSrc: '/templates/nguyen/hero-demo.mp4',
  },
};

export const nguyenFeaturesSection = {
  title: 'Everything your team needs to ship faster with AI',
  description:
    'Boards, chat, and model routing in one place so work does not sprawl across tabs.',
};

export const nguyenFeatureCards: FeatureCard[] = [
  {
    id: 'visual-task-management',
    title: 'Visual Task Management',
    description:
      'Organize work with drag-and-drop boards. Track progress across sprints, assign tasks, and keep your entire team aligned in real time.',
    colSpan: 'lg:col-span-3',
    minHeight: 'min-h-[420px]',
  },
  {
    id: 'team-chat',
    title: 'Built-in Team Chat',
    description:
      'Chat next to the work. Threads stay tied to the project so you are not jumping between apps.',
    colSpan: 'lg:col-span-3',
    minHeight: 'min-h-[420px]',
  },
  {
    id: 'ai-benchmarks',
    title: 'AI Model Benchmarks',
    description:
      'Compare leading AI models side-by-side to pick the best fit for your workflows.',
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'multi-model',
    title: 'Multi-Model Integrations',
    description:
      'Connect Anthropic, OpenAI, Gemini, and more from a single unified interface.',
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'automated-workflows',
    title: 'Automated Workflows',
    description:
      'Trigger actions, notify your team, and close the loop without manual follow-up.',
    colSpan: 'lg:col-span-2',
  },
];

export const nguyenSolutionSections = [
  {
    id: 'smart-context',
    eyebrow: 'SMART CONTEXT',
    title: 'Mention Anything, Instantly',
    description:
      "Reference files, teammates, and resources directly in conversations. Our intelligent @-mention system surfaces the right context so your team never loses track of what matters.",
    seeAlso: [
      "How smart mentions connect your team's knowledge.",
      'Explore file sharing and real-time collaboration.',
    ],
  },
  {
    id: 'ai-work',
    eyebrow: 'AI ASSISTANT',
    title: 'AI That Understands Your Work',
    description:
      "Summarize threads, pull out action items, and get answers using your team's existing context.",
    seeAlso: [
      'See how AI summaries save hours every week.',
      'Learn about our multi-model AI architecture.',
    ],
  },
  {
    id: 'autonomous-agents',
    eyebrow: 'AI AGENTS',
    title: 'Autonomous agents that handle the heavy lifting.',
    description:
      'Agents route tasks across providers and return results without someone babysitting every step.',
    seeAlso: [
      'Explore agent routing and orchestration.',
      'See how teams automate repetitive workflows.',
    ],
  },
];

export const nguyenTestimonialsSection = {
  title: "Don't Take",
  titleAccent: 'Our Word for It',
  description:
    'Teams use Nguyen to ship faster with less tool sprawl.',
};

export const nguyenTestimonials: Testimonial[] = [
  {
    id: 'giana-herwitz',
    title: 'Game-changing for our startup',
    date: 'Mar 15',
    author: 'Giana Herwitz',
    quote:
      'Nguyen helped us ship our product 3x faster. The collaboration tools are incredible and our team has never been more aligned.',
  },
  {
    id: 'marcus-johnson',
    title: 'Best investment we made',
    date: 'Apr 2',
    author: 'Marcus Johnson',
    quote:
      "Since switching to Nguyen, our team's productivity increased by 40%. The analytics dashboard alone is worth the price.",
  },
  {
    id: 'kaiya-donin',
    title: 'Simple yet powerful',
    date: 'Apr 18',
    author: 'Kaiya Donin',
    quote:
      'I love how easy it is to manage everything from one dashboard. Nguyen keeps it simple but incredibly powerful.',
  },
  {
    id: 'alex-chen',
    title: 'Perfect for remote teams',
    date: 'May 4',
    author: 'Alex Chen',
    quote:
      "With our team spread across 5 countries, Nguyen keeps everyone connected and productive. Couldn't imagine working without it.",
  },
];

export const nguyenPricingSection = {
  title: 'Choose the Right Plan for Your Team',
  description:
    'Flexible pricing that scales with your business, from solo developers to large enterprises.',
  billingToggle: {
    monthly: 'Monthly',
    annual: 'Annual',
    annualSavings: 'Save 20%',
  },
};

export const nguyenPricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: 'Up to 5 team members' },
      { text: '3 active projects' },
      { text: 'Basic analytics dashboard' },
      { text: '5GB cloud storage' },
      { text: 'Community support' },
      { text: 'Mobile app access' },
      { text: 'Standard integrations' },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Best for growing teams and businesses',
    monthlyPrice: 29,
    yearlyPrice: 278,
    popular: true,
    features: [
      { text: 'Unlimited team members' },
      { text: 'Unlimited projects' },
      { text: 'Advanced analytics & reports' },
      { text: '100GB cloud storage' },
      { text: 'Priority support (4hr response)' },
      { text: '100+ integrations' },
      { text: 'Custom workflows' },
      { text: 'Version history' },
      { text: 'API access' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large teams with advanced needs',
    monthlyPrice: 99,
    yearlyPrice: 950,
    enterprise: true,
    features: [
      { text: 'Everything in Professional' },
      { text: 'Unlimited storage' },
      { text: '24/7 dedicated support' },
      { text: 'Custom integrations' },
      { text: 'Single Sign-On (SSO)' },
      { text: 'Advanced security & compliance' },
      { text: 'Dedicated account manager' },
      { text: 'Custom SLAs' },
      { text: 'Onboarding & training' },
    ],
  },
];

export const nguyenFaqSection = {
  title: 'Frequently Asked Questions',
  description:
    'Get answers to commonly asked questions. Still have questions? Get started free.',
};

export const nguyenFaqItems: FaqItem[] = [
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start.',
  },
  {
    question: 'Can I change plans later?',
    answer:
      'Yes. Upgrade or downgrade anytime. Changes apply immediately and billing is prorated.',
  },
  {
    question: 'What AI models do you support?',
    answer:
      'Nguyen connects to Anthropic Claude, OpenAI GPT, Google Gemini, Mistral, and more from one workspace.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. Encryption in transit and at rest, SOC 2, and SSO for teams that need it.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee on all paid plans. Contact support if you are not satisfied.',
  },
];

export const nguyenFooter = {
  description:
    'Building the future of digital experiences. We help teams ship better products faster with our powerful platform.',
  copyrightYear: 2026,
  copyright: 'Nguyen Inc. All rights reserved.',
  legalLinks: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Refunds', href: '#' },
  ],
};

export const nguyenSocialLinks: SocialLink[] = [
  { label: 'Twitter', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'GitHub', href: '#' },
];

export const nguyenFooterColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#', title: 'See our features' },
      { label: 'Pricing', href: '#', title: 'View pricing' },
      { label: 'Integrations', href: '#', title: 'View integrations' },
      { label: 'Changelog', href: `${NGUYEN_TEMPLATE_BASE}/changelog`, title: 'View changelog' },
      { label: 'Roadmap', href: '#', title: 'View roadmap' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#', title: 'Read documentation' },
      { label: 'API Reference', href: '#', title: 'API Reference' },
      { label: 'Blog', href: '#', title: 'Read our blog' },
      { label: 'Community', href: '#', title: 'Join community' },
      { label: 'Support', href: '#', title: 'Get support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#', title: 'About us' },
      { label: 'Careers', href: '#', title: 'View careers' },
      { label: 'Press', href: '#', title: 'Press' },
      { label: 'Contact', href: '#', title: 'Contact us' },
      { label: 'Partners', href: '#', title: 'Our partners' },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        label: 'Terms & Conditions',
        href: '#',
        title: 'Read our Terms & Conditions',
      },
      { label: 'Privacy Policy', href: '#', title: 'Read our Privacy Policy' },
      { label: 'Refund Policy', href: '#', title: 'Read our Refund Policy' },
      { label: 'Cookie Policy', href: '#', title: 'Cookie Policy' },
      { label: 'GDPR', href: '#', title: 'GDPR Compliance' },
    ],
  },
];

export const nguyenAssets = {
  logoLight: '/templates/nguyen/logos/logo-light.png',
  logoDark: '/templates/nguyen/logos/logo-dark.png',
  backgroundBlurMobile: '/templates/nguyen/background-blur-mobile.png',
  footerBlurMobile: '/templates/nguyen/footer-blur-mobile.png',
  footerBlurDesktop: '/templates/nguyen/footer-blur-desktop.png',
} as const;

export const nguyenKanbanColumns = [
  {
    name: 'In Progress',
    tasks: [
      {
        label: 'High',
        title: 'Integrate multi-model AI routing',
        stacked: true,
        assignee: {
          initials: 'A',
          name: 'Alex Chen',
          color: 'bg-blue-500',
        },
      },
      {
        label: 'Medium',
        title: 'Build workflow automation engine',
        assignee: {
          initials: 'M',
          name: 'Maya Lee',
          color: 'bg-neutral-300 dark:bg-neutral-600',
        },
      },
    ],
  },
  {
    name: 'Ready for Review',
    placeholder: true,
    tasks: [
      {
        label: 'Ready',
        title: 'Design token system & color palette',
        assignee: {
          initials: 'J',
          name: 'Jordan S.',
          color: 'bg-neutral-600',
        },
      },
    ],
  },
] as const;

export const nguyenChatMessage = {
  author: 'Maya Lee',
  initials: 'ML',
  time: '3:48 pm',
  message:
    'Sprint review is ready. All three milestones shipped ahead of schedule.',
} as const;

export const nguyenBenchmarkModels = [
  { name: 'Claude Sonnet', score: 96, duration: '1.2s' },
  { name: 'GPT-4o', score: 91, duration: '1.4s' },
] as const;

export const nguyenIntegrationModels = [
  { name: 'Cortex', color: '#bfdbfe', opacity: 0.6, rotateX: 16 },
  { name: 'Mistral AI', color: '#93c5fd', opacity: 0.8, rotateX: 8 },
  { name: 'Synaptic AI', color: '#60a5fa', opacity: 1, rotateX: 4 },
  { name: 'Quantum Cor', color: '#3b82f6', opacity: 1, rotateX: 0 },
  { name: 'Neuraliy AI', color: '#60a5fa', opacity: 1, rotateX: -4 },
  { name: 'Deep AI', color: '#93c5fd', opacity: 0.8, rotateX: -8 },
  { name: 'Flux', color: '#bfdbfe', opacity: 0.6, rotateX: -16 },
] as const;

export const nguyenWorkflowHeatmap = {
  stats: {
    allTasks: { primary: 68, secondary: 12 },
    bestCoverage: { primary: 42, secondary: 15 },
  },
  rows: [
    { day: 'Mon', cells: [3, 0, 4, 2, 1, 3, 0, 4, 2, 1, 3, 0, 2] },
    { day: 'Tue', cells: [1, 4, 0, 3, 2, 1, 4, 0, 3, 2, 1, 4, 0] },
    { day: 'Wed', cells: [4, 2, 3, 0, 4, 2, 3, 1, 4, 0, 2, 3, 4] },
    { day: 'Thu', cells: [0, 3, 1, 4, 0, 3, 2, 4, 1, 0, 3, 2, 1] },
    { day: 'Fri', cells: [2, 1, 4, 3, 2, 0, 4, 1, 3, 4, 0, 2, 3] },
    { day: 'Sat', cells: [3, 4, 2, 1, 3, 4, 0, 2, 1, 3, 4, 2, 0] },
    { day: 'Sun', cells: [1, 0, 3, 4, 1, 2, 3, 0, 4, 2, 1, 3, 4] },
  ],
} as const;

export const nguyenMentionAgents = [
  {
    id: 'gemini',
    name: 'Gemini 2.0 Flash',
    provider: 'Google AI',
  },
  {
    id: 'gpt',
    name: 'GPT-4o',
    provider: 'OpenAI',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek-V3',
    provider: 'Code & analysis',
  },
] as const;

export const nguyenThreadSummary = {
  summary:
    'Team agreed on async standups. Sprint velocity up 23%. Next milestone: v2 launch in Q3.',
  sources: ['#standup · 42 msgs', '#sprint-review · 28 msgs', '#product · 15 msgs'],
  actionItems: [
    { label: 'Update sprint board', done: true },
    { label: 'Review PR #247', done: true },
    { label: 'Schedule v2 review', done: true },
    { label: 'Ship release notes', done: false },
    { label: 'Update roadmap doc', done: false },
    { label: 'Due end of sprint', done: false },
  ],
};

export const nguyenAgentAccordionItems = [
  {
    id: 'gemini',
    title: 'Gemini 2.0 Flash',
    subtitle: 'Google AI',
    description:
      "Google's multimodal model for complex reasoning, code generation, and creative tasks.",
    tasks: [
      {
        title: 'AI Agent Routing',
        detail: 'Route queries to the right AI model dynamically',
        counts: '6 3',
      },
      {
        title: 'Prompt Tuning',
        detail: 'Optimize system prompts for accuracy & speed',
        counts: '3',
      },
      {
        title: 'RAG Pipeline',
        detail: 'Build retrieval-augmented generation flow',
        counts: '2',
      },
    ],
  },
  {
    id: 'chatgpt',
    title: 'GPT-4o',
    subtitle: 'OpenAI',
    description:
      'General-purpose reasoning with fast response times for drafting, analysis, and customer-facing workflows.',
    tasks: [
      {
        title: 'Thread Summary',
        detail: 'Condense long conversations into actionable briefs',
        counts: '4',
      },
      {
        title: 'Action Extraction',
        detail: 'Pull tasks and owners from unstructured updates',
        counts: '2',
      },
    ],
  },
  {
    id: 'deepseek',
    title: 'DeepSeek-V3',
    subtitle: 'Code & analysis',
    description:
      'Specialized for code review, data analysis, and technical documentation across large repositories.',
    tasks: [
      {
        title: 'Code Review Agent',
        detail: 'Flag regressions and suggest fixes in pull requests',
        counts: '5',
      },
      {
        title: 'Data Analysis',
        detail: 'Generate charts and insights from workspace metrics',
        counts: '3',
      },
    ],
  },
] as const;
