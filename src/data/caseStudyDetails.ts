// Long-form case study content for /work/:id. Architecture is simplified and generalized to respect client confidentiality;
// every fact here comes from the real projects (see the resume), nothing is invented.

export type ArchLayer = { name: string; nodes: string[]; tone?: "core" | "external" | "infra" };

export type CaseStudyDetail = {
  role: string;
  problem: string[];
  challenges: string[];
  approach: { title: string; body: string }[];
  architecture: ArchLayer[];
  /** Steps of a typical request; `at` lists the architecture layer indices each step passes through. */
  flow: { text: string; at: number[] }[];
  decisions: { title: string; body: string }[];
  reflection: string;
};

export const caseStudyDetails: Record<string, CaseStudyDetail> = {
  "enterprise-crm": {
    role: "Led it end to end: requirements, architecture, web, mobile, backend and AWS. Main technical point of contact for the client's business heads.",
    problem: [
      "The client runs sales across several group companies. Each company handled customers, sampling requests, sales orders and visit plans in its own way, and most of it lived in spreadsheets, phone calls and email threads.",
      "Approvals were slow because nobody could see where a request was stuck. Sales numbers lived in SAP, so the people in the field and the people making decisions were never looking at the same picture.",
    ],
    challenges: [
      "Several companies on one platform, each with its own data, people and rules",
      "Approval chains that differ by company and request type, and change often",
      "Keeping catalogue, stock and sales in sync with SAP without touching SAP directly",
      "Fast analytics over more than 1.7 million sales records",
      "Field teams working from their phones, often on patchy networks",
    ],
    approach: [
      {
        title: "One data model for many companies",
        body: "I designed a multi-tenant PostgreSQL schema where every record is scoped to a company, and access is decided by database-driven roles with per-module permissions. Adding a company or a role is configuration, not code.",
      },
      {
        title: "A configurable approval engine",
        body: "Instead of hardcoding approval chains, I modelled them as data: levels, approvers and conditions per request type. Sampling requests, sales orders and visit plans all move through the same engine, and everyone can see exactly where a request is waiting.",
      },
      {
        title: "SAP integration through file sync",
        body: "SAP exports sales, stock movement and catalogue files over FTP/FTPS. Scheduled Node.js jobs pick them up, validate them and upsert them into PostgreSQL, so the app always has fresh data without depending on SAP being reachable in real time.",
      },
      {
        title: "Analytics that stay fast",
        body: "Dashboards and pivot reports run over 1.7M+ records. Materialized views refreshed on a schedule, plus targeted indexes and query tuning, keep reports quick without slowing down day to day work.",
      },
      {
        title: "One backend, two apps",
        body: "The React web app (Redux Toolkit and React Query) serves managers and admins, and the Flutter app serves the field team on Android and iOS. Both talk to the same Express API, so business rules live in one place.",
      },
      {
        title: "Shipping it safely",
        body: "Everything runs in Docker on AWS (EC2, RDS, S3) behind nginx, with CI/CD, scripted data migrations, and Jest and Playwright suites as quality gates before anything reaches production.",
      },
    ],
    architecture: [
      { name: "Clients", nodes: ["React web app", "Flutter app (Android & iOS)"] },
      { name: "Gateway", nodes: ["nginx reverse proxy", "TLS"] },
      { name: "Application", nodes: ["Express API", "RBAC & tenant scoping", "Approval engine", "Reports service"], tone: "core" },
      { name: "Data", nodes: ["PostgreSQL via Prisma", "Materialized views", "S3 file storage"] },
      { name: "Integrations", nodes: ["Scheduled sync jobs", "SAP files over FTP/FTPS"], tone: "external" },
      { name: "Infrastructure", nodes: ["Docker", "AWS EC2 · RDS · S3", "CI/CD"], tone: "infra" },
    ],
    flow: [
      { text: "A field rep creates a sampling request in the Flutter app.", at: [0] },
      { text: "The API checks the rep's role and company scope, then hands the request to the approval engine.", at: [1, 2] },
      { text: "The engine finds the right chain for that company and request type, and notifies the first approver.", at: [2, 3] },
      { text: "Approvers act from the web app. Every step is recorded, so anyone can see where the request stands.", at: [0, 1, 2, 3] },
      { text: "SAP files sync in on schedule and the materialized views refresh, so dashboards reflect the latest sales and stock.", at: [3, 4] },
    ],
    decisions: [
      {
        title: "Configuration over code",
        body: "Approval chains and permissions live in the database. It took longer up front, but the client can now change rules without waiting for a release.",
      },
      {
        title: "File sync over live SAP calls",
        body: "A scheduled, validated sync is less instant, but far more resilient. The app keeps working even when SAP is unavailable.",
      },
      {
        title: "Materialized views over a separate warehouse",
        body: "At this scale, well-tuned PostgreSQL views were fast enough and much simpler to look after than another system.",
      },
    ],
    reflection:
      "The best part of this project was sitting with the client's business heads and turning the way they actually work into software. Owning it end to end meant every decision could be made with the whole picture in mind.",
  },

  "legal-intelligence": {
    role: "Built the frontend, APIs and data pipelines, set up the AWS infrastructure, and worked directly with judges, law firms and legal professionals.",
    problem: [
      "Indian legal research is spread across the websites of 24 High Courts and the Supreme Court. Each publishes judgments in its own format, so finding the right precedent meant searching site by site and then reading very long documents.",
      "Lawyers needed one place to search everything, quick summaries of what a judgment actually held, and a way to do it from wherever they are.",
    ],
    challenges: [
      "25 different court sources with different formats, layouts and update schedules",
      "Messy documents: scanned PDFs, inconsistent metadata and duplicates",
      "Search that understands legal meaning, not only keywords",
      "Summaries that are accurate, and anonymized where needed",
      "Running heavy AI workloads reliably without runaway costs",
    ],
    approach: [
      {
        title: "Scraping pipelines per court",
        body: "Each court got its own scraper and parser, feeding one common pipeline. Judgments are collected on a schedule, deduplicated and stored with their source, so nothing is lost or counted twice.",
      },
      {
        title: "Normalization into one shape",
        body: "Every judgment is cleaned and mapped into a single schema: court, bench, date, parties, citations and full text. This is what makes searching across all courts possible.",
      },
      {
        title: "Indexing for words and meaning",
        body: "Documents are chunked and indexed for both full-text and vector search, so a query can match exact legal phrases as well as related concepts.",
      },
      {
        title: "AI workflows on top",
        body: "LLM workflows summarize judgments, pull out key holdings and anonymize personal details. Summaries point back to the source text, so lawyers can check every claim.",
      },
      {
        title: "Research inside WhatsApp",
        body: "A WhatsApp bot brings search, judgment lookup and document summaries into the app lawyers already have open all day.",
      },
      {
        title: "Infrastructure for AI workloads",
        body: "GPU instances on AWS EC2 run the AI work, separate from the web and API tier, so heavy processing never slows down search.",
      },
    ],
    architecture: [
      { name: "Sources", nodes: ["24 High Courts", "Supreme Court of India"], tone: "external" },
      { name: "Ingestion", nodes: ["Court scrapers", "Parsing", "Deduplication"] },
      { name: "Processing", nodes: ["Normalization", "Chunking & embeddings", "Anonymization"] },
      { name: "Search & data", nodes: ["PostgreSQL", "Full-text index", "Vector index"] },
      { name: "Application", nodes: ["Node.js APIs", "Search service", "LLM summarization"], tone: "core" },
      { name: "Clients", nodes: ["React web app", "WhatsApp bot"] },
      { name: "Infrastructure", nodes: ["AWS EC2", "GPU instances"], tone: "infra" },
    ],
    flow: [
      { text: "Scrapers collect new judgments from each court on a schedule.", at: [0, 1] },
      { text: "Each document is parsed, cleaned and mapped into the common schema.", at: [1, 2] },
      { text: "Text is chunked, embedded and indexed for keyword and semantic search.", at: [2, 3] },
      { text: "A lawyer asks a question on the web or in WhatsApp.", at: [5] },
      { text: "The search service finds the most relevant passages, and an LLM summarizes them with references back to the judgments.", at: [3, 4, 5] },
    ],
    decisions: [
      {
        title: "Hybrid search",
        body: "Vector search alone missed exact legal phrases, and keyword search alone missed related ideas. Combining both gave results lawyers could trust.",
      },
      {
        title: "Answers that cite",
        body: "Every summary links back to the source judgment. In law, an answer without a reference isn't useful.",
      },
      {
        title: "Separate AI compute",
        body: "Keeping GPU workloads apart from the API tier made costs predictable and kept the product responsive.",
      },
    ],
    reflection:
      "Working directly with judges, law firms and legal professionals shaped every feature. I also got to mentor IIT Delhi interns and work with BITS Law students on this one, which I really enjoyed.",
  },

  "knowledge-assistant": {
    role: "Built the knowledge-ingestion and RAG pipelines, the no-code bot builder, multi-channel delivery and the governance features.",
    problem: [
      "Support, HR, IT and finance teams kept answering the same questions. The answers existed in SOPs, FAQs, PDFs and old tickets, but nobody could find them quickly.",
      "Generic chatbots didn't know the company's own knowledge, and they couldn't meet governance needs like audit trails and clear limits on what the bot talks about.",
    ],
    challenges: [
      "Many document types: PDF, DOCX, CSV, SOPs, FAQs and support tickets",
      "Answers grounded in company knowledge, with sources, and no making things up",
      "Different teams needing different bots, tones and boundaries",
      "Meeting people where they work: website, Slack, Teams and CRMs",
      "Governance: who asked what, what the bot answered, and why",
    ],
    approach: [
      {
        title: "Ingestion for any document",
        body: "Uploaded files are parsed, cleaned, split into meaningful chunks and embedded into a vector database, with metadata so every chunk knows exactly where it came from.",
      },
      {
        title: "Retrieval-augmented answers",
        body: "When someone asks a question, the most relevant chunks are retrieved and passed to the LLM with clear instructions to answer only from them and to cite them.",
      },
      {
        title: "A no-code bot builder",
        body: "Teams create their own bots by choosing knowledge, tone, scope and guardrails, without writing code. The same knowledge can also generate quizzes and assessments.",
      },
      {
        title: "Guardrails per team",
        body: "Each bot has a defined scope, so an HR bot stays on HR topics and politely declines everything else.",
      },
      {
        title: "One brain, many channels",
        body: "The same bot is reachable from website chat, Slack, Microsoft Teams, CRMs and support portals through APIs and channel adapters.",
      },
      {
        title: "Governance built in",
        body: "Analytics dashboards, audit logs and compliance controls show what people ask, how the bot answered, and where the knowledge has gaps.",
      },
    ],
    architecture: [
      { name: "Channels", nodes: ["Website chat", "Slack", "Microsoft Teams", "CRM & support portals"] },
      { name: "Application", nodes: ["Bot API", "Channel adapters", "No-code bot builder"] },
      { name: "AI layer", nodes: ["Retriever", "Guardrails", "LLM APIs", "Quiz generator"], tone: "core" },
      { name: "Knowledge", nodes: ["Ingestion pipeline", "Vector database", "PostgreSQL metadata"] },
      { name: "Governance", nodes: ["Analytics", "Audit logs", "Compliance controls"], tone: "infra" },
    ],
    flow: [
      { text: "A team uploads its SOPs, FAQs and documents to its bot.", at: [1] },
      { text: "The ingestion pipeline parses, chunks and embeds them into the vector database.", at: [3] },
      { text: "An employee asks a question in Slack, Teams or on the website.", at: [0, 1] },
      { text: "The retriever finds the relevant chunks, and guardrails check the question is in scope.", at: [2, 3] },
      { text: "The LLM answers from those chunks and cites them, and the exchange is logged for analytics and audit.", at: [2, 3, 4] },
    ],
    decisions: [
      {
        title: "Grounded over clever",
        body: "The bot answers only from retrieved knowledge and says so when it doesn't know. Trust matters more than sounding smart.",
      },
      {
        title: "Channel adapters",
        body: "Keeping channel logic apart from the bot means adding a new channel never touches the core.",
      },
      {
        title: "A builder for non-engineers",
        body: "Putting configuration in each team's hands let them own their bots without waiting on engineering.",
      },
    ],
    reflection:
      "This platform is all about trust. Watching teams go from wondering whether AI could really answer their questions to relying on their own bots every day was genuinely rewarding.",
  },

  "healthcare-platform": {
    role: "Frontend and product engineering: the PWAs, API integration, FHIR workflows and admin tools, working closely with PMs, clinicians and backend engineers.",
    problem: [
      "Patients and clinicians needed simple digital workflows for records, appointments and consent that work on any device.",
      "At the same time, everything had to meet India's national digital health standards (ABDM), including strict rules on how health data is shared and certified.",
    ],
    challenges: [
      "One codebase that feels at home on phones and works well on desktops",
      "Interoperable health data that follows FHIR",
      "Delivering ABDM milestones M1, M2 and M3, and PHR certification",
      "Handling sensitive health data safely in the browser",
      "Shipping often without breaking clinical workflows",
    ],
    approach: [
      {
        title: "Progressive Web Apps in React",
        body: "Patient and clinical apps were built as PWAs from a single React codebase: installable on phones and fast on desktops.",
      },
      {
        title: "FHIR-aligned workflows",
        body: "Health records, consents and linking flows were modelled on FHIR resources, so data moves between systems in the standard shape.",
      },
      {
        title: "ABDM milestones, step by step",
        body: "We worked through the ABDM M1, M2 and M3 milestones and PHR certification together as a team, building each required flow and testing it carefully before review.",
      },
      {
        title: "Careful API integration",
        body: "Auth, API state and validation of sensitive data are handled in one well-tested layer, so screens never deal with raw health data directly.",
      },
      {
        title: "Admin and internal tools",
        body: "Admin interfaces and internal tools were built with React and Bubble, so the operations team could move quickly.",
      },
      {
        title: "Containerized releases",
        body: "Releases ship as containers through CI/CD to AWS ECS, which made deployments routine and easy to roll back.",
      },
    ],
    architecture: [
      { name: "Clients", nodes: ["Patient PWA", "Clinician PWA", "Admin tools (React & Bubble)"] },
      { name: "Application", nodes: ["REST APIs", "Auth & consent", "Validation layer"], tone: "core" },
      { name: "Health standards", nodes: ["FHIR resources", "ABDM M1 · M2 · M3", "PHR"], tone: "external" },
      { name: "Infrastructure", nodes: ["Docker", "AWS ECS", "CI/CD"], tone: "infra" },
    ],
    flow: [
      { text: "A patient signs in on the PWA and links their health ID.", at: [0, 1, 2] },
      { text: "The app asks for consent through the ABDM flow before any records are shared.", at: [1, 2] },
      { text: "Records arrive as FHIR resources and are validated before they're shown.", at: [1, 2] },
      { text: "Clinicians view and update records from their own PWA.", at: [0, 1] },
      { text: "The operations team manages everything from internal admin tools.", at: [0] },
    ],
    decisions: [
      {
        title: "PWAs over native apps",
        body: "One codebase for every device let a small team move faster, while still feeling app-like on phones.",
      },
      {
        title: "Standards first",
        body: "Designing around FHIR and ABDM from day one made certification smoother than adding it later.",
      },
      {
        title: "Containers for every release",
        body: "Shipping through ECS made releases predictable, which matters when clinicians depend on the product.",
      },
    ],
    reflection:
      "Building for healthcare means every small detail touches someone's care. Working closely with PMs, clinicians and backend engineers taught me to slow down exactly where it matters.",
  },
};
