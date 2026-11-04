import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  BrainCircuit,
  Cloud,
  Server,
  Smartphone,
  Workflow,
} from "lucide-react";

export const profile = {
  name: "Kunal Charde",
  role: "Full-Stack Developer & AI Solutions Consultant",
  location: "Nagpur, India · Working with clients worldwide",
  email: "kunalcharde1@gmail.com",
  linkedin: "https://www.linkedin.com/in/kunal-charde",
  github: "https://github.com/kunalCharde04",
};

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
};

export const services: Service[] = [
  {
    icon: AppWindow,
    title: "Custom Web Applications",
    description:
      "Let's turn the spreadsheets and scattered tools into one system your team actually enjoys using, shaped around the way you already work.",
    items: ["Business dashboards", "CRM & ERP systems", "SaaS platforms", "Admin panels", "Workflow management"],
  },
  {
    icon: BrainCircuit,
    title: "AI & LLM Solutions",
    description:
      "Together we can put your documents and data to work, with assistants that answer from your own knowledge and show where every answer came from.",
    items: ["AI chatbots", "RAG knowledge assistants", "Document intelligence", "AI-powered search", "Data extraction"],
  },
  {
    icon: Server,
    title: "Backend & API Development",
    description:
      "The quiet foundations your product stands on. I take care to get the data, APIs and integrations right so they keep up as you grow.",
    items: ["REST APIs", "Node.js applications", "Database architecture", "Third-party & ERP integrations", "Scalable backends"],
  },
  {
    icon: Workflow,
    title: "Automation & Business Solutions",
    description:
      "We look at the repetitive work eating your team's week, the imports, reports and approvals, and gently hand it over to software.",
    items: ["Process automation", "Data processing workflows", "Reporting automation", "System integrations"],
  },
  {
    icon: Cloud,
    title: "Cloud & Deployment",
    description:
      "Launch day should feel calm. I set up the infrastructure and deployments with care, and I'm still around after it goes live.",
    items: ["AWS infrastructure", "Docker deployment", "CI/CD pipelines", "Server configuration", "Production rollout"],
  },
  {
    icon: Smartphone,
    title: "Mobile & Cross-Platform Apps",
    description:
      "We meet your users where they are, with Android, iOS and web apps that all share one backend, looked after as one product.",
    items: ["Flutter apps (Android & iOS)", "Progressive Web Apps", "API integration", "Field-force & business apps"],
  },
];

export type MockupKind = "crm" | "legal" | "assistant" | "health";

export type CaseStudy = {
  id: string;
  name: string;
  category: string;
  context: string;
  overview: string;
  problem: string;
  solution: string[];
  stack: string[];
  mockup: MockupKind;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "enterprise-crm",
    name: "Enterprise CRM & Field-Force Platform",
    category: "Enterprise Software · Web + Mobile",
    context: "Client product for one of India's largest education publishers",
    overview:
      "A multi-company sales, catalogue and field-force platform delivered as a web application, a cross-platform mobile app for field teams, and a shared backend. I looked after it end to end, from the first requirements to production.",
    problem:
      "Sales teams across multiple companies were managing customers, sampling, sales orders and approvals through fragmented processes, with ERP data and analytics living in separate systems.",
    solution: [
      "Database-driven role-based access with per-module permissions and multi-tenant company scoping",
      "Configurable multi-level approval workflows for sampling, sales orders and visit plans",
      "SAP integrations for sales, stock movement and catalogue imports via FTP/FTPS sync",
      "Analytics dashboards and pivot reports over 1.7M+ sales records, tuned with materialized views",
      "Production on AWS with CI/CD, data migrations and Jest + Playwright quality gates",
    ],
    stack: ["React", "Redux Toolkit", "React Query", "Flutter", "Node.js", "Express", "Prisma", "PostgreSQL", "AWS", "Docker"],
    mockup: "crm",
  },
  {
    id: "legal-intelligence",
    name: "AI Legal Document Intelligence",
    category: "Legal Tech · AI",
    context: "In-house AI product for legal research and case workflows",
    overview:
      "A legal research platform that collects, normalizes and indexes court judgments, then lets lawyers search, summarize and analyse them on the web and directly inside WhatsApp.",
    problem:
      "Legal research meant manually searching across many separate court websites and reading long judgments end to end to find the passages that actually matter.",
    solution: [
      "Ingestion pipelines that scrape and process judgments from all 24 High Courts and the Supreme Court of India",
      "Normalization, indexing and search pipelines for fast, accurate retrieval across the corpus",
      "AI workflows for judgment summarization, anonymization and intelligent search",
      "A WhatsApp assistant for legal research, judgment search and document summaries",
      "GPU-backed AWS infrastructure for reliable AI workloads",
    ],
    stack: ["React", "Node.js", "Python", "LLMs", "Vector Search", "PostgreSQL", "AWS EC2 / GPU"],
    mockup: "legal",
  },
  {
    id: "knowledge-assistant",
    name: "Enterprise AI Knowledge Assistant",
    category: "AI Infrastructure · RAG",
    context: "In-house platform for deploying domain-specific enterprise chatbots",
    overview:
      "A platform that lets organisations turn their internal documents into trustworthy, governed AI assistants, configured without code and available in the channels their teams already use.",
    problem:
      "Teams kept answering the same questions from SOPs, FAQs and support tickets, while generic chatbots couldn't answer from company knowledge or meet governance requirements.",
    solution: [
      "Knowledge-ingestion and RAG pipelines for PDF, DOCX, CSV, SOPs, FAQs and support tickets",
      "A no-code bot builder with per-team tone, scope and guardrails, plus AI-generated quizzes",
      "Multi-channel deployment to website chat, Slack, Microsoft Teams, CRMs and support portals",
      "Governance: analytics dashboards, audit logs and compliance controls",
    ],
    stack: ["React", "Node.js", "Python", "RAG", "Vector Database", "LLM APIs", "PostgreSQL"],
    mockup: "assistant",
  },
  {
    id: "healthcare-platform",
    name: "AI Healthcare Platform",
    category: "HealthTech · Progressive Web Apps",
    context: "In-house ABDM-compliant healthcare product",
    overview:
      "Patient and clinical workflows shipped as cross-platform Progressive Web Apps, integrated with India's national digital health stack.",
    problem:
      "Patients and clinicians needed simple, secure digital workflows that also met strict national health-data interoperability and certification requirements.",
    solution: [
      "Production PWAs in React for patient and clinical workflows",
      "FHIR-aligned workflows delivering ABDM M1, M2 and M3 milestones and PHR certification",
      "Secure REST API integration handling auth, API state and validation of sensitive health data",
      "Admin interfaces and internal tools, with containerized CI/CD releases on AWS ECS",
    ],
    stack: ["React", "PWA", "REST APIs", "FHIR", "ABDM", "Bubble", "AWS ECS", "Docker"],
    mockup: "health",
  },
];

export type ClientProject = {
  name: string;
  type: string;
  description: string;
  url?: string;
  linkLabel?: string;
};

export const clientWork: ClientProject[] = [
  {
    name: "Upshift Services",
    type: "Fintech · Website",
    description:
      "Website for a lending service provider that matches personal and business loan borrowers to a single best-fit regulated lender.",
    url: "https://upshiftserv.com/",
    linkLabel: "upshiftserv.com",
  },
  {
    name: "BlinkLoans",
    type: "Fintech · Web Platform",
    description:
      "Digital lending platform connecting borrowers with RBI-registered lenders, with loan journeys and an interactive EMI calculator.",
    url: "https://blinkloans.in/",
    linkLabel: "blinkloans.in",
  },
  {
    name: "Palash Club",
    type: "Wellness · Mobile App",
    description:
      "Guided relaxation and mindfulness app with structured audio and video sessions for everyday stress management.",
    url: "https://play.google.com/store/apps/details?id=com.palashclub.app",
    linkLabel: "Google Play",
  },
  {
    name: "Amrutwel Ayurveda",
    type: "Health & Wellness · Website",
    description: "Brand website for an Ayurveda health and wellness business.",
  },
];

export const experience = [
  { org: "Indika AI", role: "Member of Technical Staff, Senior Software Developer", period: "2025 to now" },
  { org: "PanScience AI Healthcare", role: "Software Engineer, Product Engineering", period: "2023 to 2024" },
  { org: "PanScience Innovation", role: "Software Engineer", period: "2023" },
];

export const domains = [
  "Legal Tech",
  "Healthcare",
  "Enterprise CRM",
  "EdTech & Publishing",
  "FinTech",
  "AI Infrastructure",
  "Media & Consumer",
  "HR Tech",
  "Industrial AI",
];

export const skillGroups = [
  { title: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit", "React Query", "Tailwind CSS", "HTML & CSS"] },
  { title: "Backend", items: ["Node.js", "Express.js", "REST APIs", "Prisma", "Python", "RBAC & approval workflows", "SAP / ERP integrations"] },
  { title: "AI & Machine Learning", items: ["LLM Integration", "RAG Architecture", "Vector Search", "Document Intelligence", "AI Agents", "Prompt Engineering"] },
  { title: "Databases", items: ["PostgreSQL", "pgvector", "MongoDB", "Redis"] },
  { title: "Cloud & DevOps", items: ["AWS (EC2, ECS, RDS, S3)", "Docker", "Nginx", "Linux", "CI/CD", "Git"] },
  { title: "Mobile & Testing", items: ["Flutter (Android & iOS)", "Progressive Web Apps", "Jest", "Playwright"] },
];

// Checkpoints on the journey road (the "How I work" story). Each gate lifts as the truck passes.
export const milestones = [
  { title: "Discover", description: "We sit down together and get clear on your goals, your users and what a win looks like for you.", check: "we're on the same page" },
  { title: "Architect", description: "I sketch the plan with you: how it fits together, what comes first, and what might trip us up.", check: "plan agreed together" },
  { title: "Build", description: "Small steps, shared often. You see it grow every week and help steer it as we go.", check: "reviewed with you" },
  { title: "Test", description: "I test it the way your users will use it, so surprises get caught here and not by them.", check: "tests passing" },
  { title: "Package", description: "Everything gets packed carefully, so what worked on my machine works exactly the same in production.", check: "packed with care" },
  { title: "Deploy", description: "We go live together, and I stay close afterwards to watch over it and keep making it better.", check: "live, and looked after" },
];

export const reasons = [
  { title: "Your problem comes first", description: "Before talking about technology, I want to understand what you're trying to make better and why it matters to you." },
  { title: "I stay with it", description: "From the first idea to launch and after. You won't be handed between people; I'm with your product the whole way." },
  { title: "AI where it truly helps", description: "I'll be honest about where AI makes your product better and where something simpler will serve you well." },
  { title: "Built like it's my own", description: "Clean, tested and documented, because I care how it holds up long after we've shipped it." },
  { title: "Room to grow", description: "We'll build it so it can grow with you, more users, more data, more ideas, without starting over." },
  { title: "You're never in the dark", description: "Regular updates, honest timelines and decisions explained in plain language. Ask me anything, anytime." },
];

export const projectTypes = [
  "Web application",
  "AI / LLM solution",
  "Backend & APIs",
  "Automation",
  "Cloud & deployment",
  "Mobile app",
  "Website",
  "Not sure yet",
];

export const budgets = ["Under $2,000", "$2,000 to $5,000", "$5,000 to $15,000", "$15,000+", "Not sure yet"];
