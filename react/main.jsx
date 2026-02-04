import React, { useState, useMemo, useRef } from 'react';
import { Search, Shield, Server, Code, TrendingUp, Cpu, Database, PenTool, Gamepad2, FileText, X, Check, Star, ChevronRight, Hash, Upload, FileJson } from 'lucide-react';

// --- Types ---
type SkillCategory = 
  | 'Purple Security Analyst'
  | 'Fullstack DevOps'
  | 'Sys Admin & Cloud'
  | 'Business & Growth'
  | 'LLMs & Automation'
  | 'Data Handling'
  | 'Content Creation'
  | 'Graphics & Game Dev'
  | 'Writing & Docs';

interface RawSkill {
  id: string;
  path?: string;
  name: string;
  description: string;
}

interface EnrichedSkill extends RawSkill {
  category: SkillCategory;
  usefulness: number; // 0-100
  laymanDesc: string;
  useCases: string[];
  keywords: string[];
}

// --- Raw Data (Embedded from user file as default) ---
const DEFAULT_DATA: RawSkill[] = [
  { "id": "2d-games", "path": "skills/game-development/2d-games", "name": "2d-games", "description": "2D game development principles. Sprites, tilemaps, physics, camera." },
  { "id": "3d-games", "path": "skills/game-development/3d-games", "name": "3d-games", "description": "3D game development principles. Rendering, shaders, physics, cameras." },
  { "id": "3d-web-experience", "path": "skills/3d-web-experience", "name": "3d-web-experience", "description": "\"Expert in building 3D experiences for the web - Three.js, React Three Fiber, Spline, WebGL, and interactive 3D scenes. Covers product configurators, 3D portfolios, immersive websites, and bringing depth to web experiences. Use when: 3D website, three.js, WebGL, react three fiber, 3D experience.\""
  },
  { "id": "ab-test-setup", "path": "skills/ab-test-setup", "name": "ab-test-setup", "description": "When the user wants to plan, design, or implement an A/B test or experiment. Also use when the user mentions \"A/B test,\" \"split test,\" \"experiment,\" \"test this change,\" \"variant copy,\" \"multivariate test,\" or \"hypothesis.\" For tracking implementation, see analytics-tracking."
  },
  { "id": "active-directory-attacks", "path": "skills/active-directory-attacks", "name": "Active Directory Attacks", "description": "Attack Active Directory, exploit AD, Kerberoasting..." },
  { "id": "address-github-comments", "path": "skills/address-github-comments", "name": "address-github-comments", "description": "Address review or issue comments on GitHub..." },
  { "id": "agent-evaluation", "path": "skills/agent-evaluation", "name": "agent-evaluation", "description": "Testing and benchmarking LLM agents..." },
  { "id": "agent-manager-skill", "path": "skills/agent-manager-skill", "name": "agent-manager-skill", "description": "Manage multiple local CLI agents via tmux..." },
  { "id": "agent-memory-mcp", "path": "skills/agent-memory-mcp", "name": "agent-memory-mcp", "description": "Hybrid memory system for AI agents..." },
  { "id": "agent-memory-systems", "path": "skills/agent-memory-systems", "name": "agent-memory-systems", "description": "Architecture of agent memory..." },
  { "id": "agent-tool-builder", "path": "skills/agent-tool-builder", "name": "agent-tool-builder", "description": "Tools are how AI agents interact with the world..." },
  { "id": "ai-agents-architect", "path": "skills/ai-agents-architect", "name": "ai-agents-architect", "description": "Expert in designing autonomous AI agents..." },
  { "id": "ai-product", "path": "skills/ai-product", "name": "ai-product", "description": "LLM integration patterns, RAG architecture..." },
  { "id": "ai-wrapper-product", "path": "skills/ai-wrapper-product", "name": "ai-wrapper-product", "description": "Building products that wrap AI APIs..." },
  { "id": "algolia-search", "path": "skills/algolia-search", "name": "algolia-search", "description": "Expert patterns for Algolia search..." },
  { "id": "algorithmic-art", "path": "skills/algorithmic-art", "name": "algorithmic-art", "description": "Creating algorithmic art using p5.js..." },
  { "id": "analytics-tracking", "path": "skills/analytics-tracking", "name": "analytics-tracking", "description": "Set up, improve, or audit analytics..." },
  { "id": "api-fuzzing-bug-bounty", "path": "skills/api-fuzzing-bug-bounty", "name": "API Fuzzing for Bug Bounty", "description": "Test API security, fuzz APIs, find IDOR..." },
  { "id": "api-documentation-generator", "path": "skills/api-documentation-generator", "name": "api-documentation-generator", "description": "Generate comprehensive API documentation..." },
  { "id": "api-patterns", "path": "skills/api-patterns", "name": "api-patterns", "description": "API design principles..." },
  { "id": "api-security-best-practices", "path": "skills/api-security-best-practices", "name": "api-security-best-practices", "description": "Implement secure API design patterns..." },
  { "id": "app-builder", "path": "skills/app-builder", "name": "app-builder", "description": "Main application building orchestrator..." },
  { "id": "app-store-optimization", "path": "skills/app-store-optimization", "name": "app-store-optimization", "description": "Complete App Store Optimization (ASO) toolkit..." },
  { "id": "architecture", "path": "skills/architecture", "name": "architecture", "description": "Architectural decision-making framework..." },
  { "id": "autonomous-agent-patterns", "path": "skills/autonomous-agent-patterns", "name": "autonomous-agent-patterns", "description": "Design patterns for building autonomous coding agents..." },
  { "id": "autonomous-agents", "path": "skills/autonomous-agents", "name": "autonomous-agents", "description": "AI systems that can independently decompose goals..." },
  { "id": "avalonia-layout-zafiro", "path": "skills/avalonia-layout-zafiro", "name": "avalonia-layout-zafiro", "description": "Guidelines for modern Avalonia UI layout..." },
  { "id": "avalonia-viewmodels-zafiro", "path": "skills/avalonia-viewmodels-zafiro", "name": "avalonia-viewmodels-zafiro", "description": "Optimal ViewModel and Wizard creation patterns..." },
  { "id": "avalonia-zafiro-development", "path": "skills/avalonia-zafiro-development", "name": "avalonia-zafiro-development", "description": "Mandatory skills for Avalonia UI development..." },
  { "id": "aws-penetration-testing", "path": "skills/aws-penetration-testing", "name": "AWS Penetration Testing", "description": "Pentest AWS, test AWS security..." },
  { "id": "aws-serverless", "path": "skills/aws-serverless", "name": "aws-serverless", "description": "Building production-ready serverless apps on AWS..." },
  { "id": "azure-functions", "path": "skills/azure-functions", "name": "azure-functions", "description": "Expert patterns for Azure Functions..." },
  { "id": "backend-dev-guidelines", "path": "skills/backend-dev-guidelines", "name": "backend-dev-guidelines", "description": "Comprehensive backend development guide..." },
  { "id": "cc-skill-backend-patterns", "path": "skills/cc-skill-backend-patterns", "name": "backend-patterns", "description": "Backend architecture patterns..." },
  { "id": "bash-linux", "path": "skills/bash-linux", "name": "bash-linux", "description": "Bash/Linux terminal patterns..." },
  { "id": "behavioral-modes", "path": "skills/behavioral-modes", "name": "behavioral-modes", "description": "AI operational modes..." },
  { "id": "blockrun", "path": "skills/blockrun", "name": "blockrun", "description": "Use when user needs capabilities Claude lacks..." },
  { "id": "brainstorming", "path": "skills/brainstorming", "name": "brainstorming", "description": "MUST use this before any creative work..." },
  { "id": "brand-guidelines-community", "path": "skills/brand-guidelines-community", "name": "brand-guidelines", "description": "Applies Anthropic's official brand colors..." },
  { "id": "brand-guidelines-anthropic", "path": "skills/brand-guidelines-anthropic", "name": "brand-guidelines", "description": "Applies Anthropic's official brand colors..." },
  { "id": "broken-authentication", "path": "skills/broken-authentication", "name": "Broken Authentication Testing", "description": "Test for broken authentication vulnerabilities..." },
  { "id": "browser-automation", "path": "skills/browser-automation", "name": "browser-automation", "description": "Browser automation powers web testing..." },
  { "id": "browser-extension-builder", "path": "skills/browser-extension-builder", "name": "browser-extension-builder", "description": "Expert in building browser extensions..." },
  { "id": "bullmq-specialist", "path": "skills/bullmq-specialist", "name": "bullmq-specialist", "description": "BullMQ expert for Redis-backed job queues..." },
  { "id": "bun-development", "path": "skills/bun-development", "name": "bun-development", "description": "Modern JS/TS development with Bun..." },
  { "id": "burp-suite-testing", "path": "skills/burp-suite-testing", "name": "Burp Suite Web Application Testing", "description": "Intercept HTTP traffic, modify web requests..." },
  { "id": "canvas-design", "path": "skills/canvas-design", "name": "canvas-design", "description": "Create beautiful visual art..." },
  { "id": "cc-skill-continuous-learning", "path": "skills/cc-skill-continuous-learning", "name": "cc-skill-continuous-learning", "description": "Development skill..." },
  { "id": "cc-skill-project-guidelines-example", "path": "skills/cc-skill-project-guidelines-example", "name": "cc-skill-project-guidelines-example", "description": "Project Guidelines Skill..." },
  { "id": "cc-skill-strategic-compact", "path": "skills/cc-skill-strategic-compact", "name": "cc-skill-strategic-compact", "description": "Development skill..." },
  { "id": "claude-code-guide", "path": "skills/claude-code-guide", "name": "Claude Code Guide", "description": "Master guide for using Claude Code..." },
  { "id": "clean-code", "path": "skills/clean-code", "name": "clean-code", "description": "Pragmatic coding standards..." },
  { "id": "clerk-auth", "path": "skills/clerk-auth", "name": "clerk-auth", "description": "Expert patterns for Clerk auth..." },
  { "id": "cc-skill-clickhouse-io", "path": "skills/cc-skill-clickhouse-io", "name": "clickhouse-io", "description": "ClickHouse database patterns..." },
  { "id": "cloud-penetration-testing", "path": "skills/cloud-penetration-testing", "name": "Cloud Penetration Testing", "description": "Perform cloud penetration testing..." },
  { "id": "code-review-checklist", "path": "skills/code-review-checklist", "name": "code-review-checklist", "description": "Checklist for conducting code reviews..." },
  { "id": "cc-skill-coding-standards", "path": "skills/cc-skill-coding-standards", "name": "coding-standards", "description": "Universal coding standards..." },
  { "id": "competitor-alternatives", "path": "skills/competitor-alternatives", "name": "competitor-alternatives", "description": "Create competitor comparison pages..." },
  { "id": "computer-use-agents", "path": "skills/computer-use-agents", "name": "computer-use-agents", "description": "Build AI agents that interact with computers..." },
  { "id": "concise-planning", "path": "skills/concise-planning", "name": "concise-planning", "description": "Generate clear, actionable checklists..." },
  { "id": "content-creator", "path": "skills/content-creator", "name": "content-creator", "description": "Create SEO-optimized marketing content..." },
  { "id": "context-window-management", "path": "skills/context-window-management", "name": "context-window-management", "description": "Strategies for managing LLM context windows..." },
  { "id": "conversation-memory", "path": "skills/conversation-memory", "name": "conversation-memory", "description": "Persistent memory systems for LLM..." },
  { "id": "copy-editing", "path": "skills/copy-editing", "name": "copy-editing", "description": "Edit, review, or improve marketing copy..." },
  { "id": "copywriting", "path": "skills/copywriting", "name": "copywriting", "description": "Write or improve marketing copy..." },
  { "id": "core-components", "path": "skills/core-components", "name": "core-components", "description": "Core component library patterns..." },
  { "id": "crewai", "path": "skills/crewai", "name": "crewai", "description": "Expert in CrewAI multi-agent framework..." },
  { "id": "xss-html-injection", "path": "skills/xss-html-injection", "name": "Cross-Site Scripting Testing", "description": "Test for XSS vulnerabilities..." },
  { "id": "claude-d3js-skill", "path": "skills/claude-d3js-skill", "name": "d3-viz", "description": "Creating interactive data visualisations..." },
  { "id": "database-design", "path": "skills/database-design", "name": "database-design", "description": "Database design principles..." },
  { "id": "deployment-procedures", "path": "skills/deployment-procedures", "name": "deployment-procedures", "description": "Production deployment principles..." },
  { "id": "discord-bot-architect", "path": "skills/discord-bot-architect", "name": "discord-bot-architect", "description": "Building production-ready Discord bots..." },
  { "id": "doc-coauthoring", "path": "skills/doc-coauthoring", "name": "doc-coauthoring", "description": "Guide users through doc co-authoring..." },
  { "id": "docker-expert", "path": "skills/docker-expert", "name": "docker-expert", "description": "Docker containerization expert..." },
  { "id": "documentation-templates", "path": "skills/documentation-templates", "name": "documentation-templates", "description": "Documentation templates and structure..." },
  { "id": "docx-official", "path": "skills/docx-official", "name": "docx", "description": "Comprehensive document creation..." },
  { "id": "email-sequence", "path": "skills/email-sequence", "name": "email-sequence", "description": "Create or optimize email sequences..." },
  { "id": "email-systems", "path": "skills/email-systems", "name": "email-systems", "description": "Transactional email that works..." },
  { "id": "environment-setup-guide", "path": "skills/environment-setup-guide", "name": "environment-setup-guide", "description": "Guide developers through setup..." },
  { "id": "ethical-hacking-methodology", "path": "skills/ethical-hacking-methodology", "name": "Ethical Hacking Methodology", "description": "Learn ethical hacking..." },
  { "id": "file-path-traversal", "path": "skills/file-path-traversal", "name": "File Path Traversal Testing", "description": "Test for directory traversal..." },
  { "id": "file-organizer", "path": "skills/file-organizer", "name": "file-organizer", "description": "Intelligently organizes files..." },
  { "id": "file-uploads", "path": "skills/file-uploads", "name": "file-uploads", "description": "Handling file uploads and S3..." },
  { "id": "firebase", "path": "skills/firebase", "name": "firebase", "description": "Firebase backend setup..." },
  { "id": "form-cro", "path": "skills/form-cro", "name": "form-cro", "description": "Optimize forms for conversion..." },
  { "id": "free-tool-strategy", "path": "skills/free-tool-strategy", "name": "free-tool-strategy", "description": "Plan or build a free marketing tool..." },
  { "id": "frontend-design", "path": "skills/frontend-design", "name": "frontend-design", "description": "Create distinctive frontend interfaces..." },
  { "id": "frontend-dev-guidelines", "path": "skills/frontend-dev-guidelines", "name": "frontend-dev-guidelines", "description": "Frontend development guidelines..." },
  { "id": "cc-skill-frontend-patterns", "path": "skills/cc-skill-frontend-patterns", "name": "frontend-patterns", "description": "Frontend development patterns..." },
  { "id": "game-art", "path": "skills/game-development/game-art", "name": "game-art", "description": "Game art principles..." },
  { "id": "game-audio", "path": "skills/game-development/game-audio", "name": "game-audio", "description": "Game audio principles..." },
  { "id": "game-design", "path": "skills/game-development/game-design", "name": "game-design", "description": "Game design principles..." },
  { "id": "game-development", "path": "skills/game-development", "name": "game-development", "description": "Game development orchestrator..." },
  { "id": "gcp-cloud-run", "path": "skills/gcp-cloud-run", "name": "gcp-cloud-run", "description": "Serverless apps on GCP..." },
  { "id": "geo-fundamentals", "path": "skills/geo-fundamentals", "name": "geo-fundamentals", "description": "Generative Engine Optimization..." },
  { "id": "git-pushing", "path": "skills/git-pushing", "name": "git-pushing", "description": "Stage, commit, and push git changes..." },
  { "id": "github-workflow-automation", "path": "skills/github-workflow-automation", "name": "github-workflow-automation", "description": "Automate GitHub workflows..." },
  { "id": "graphql", "path": "skills/graphql", "name": "graphql", "description": "GraphQL schema design and resolvers..." },
  { "id": "html-injection-testing", "path": "skills/html-injection-testing", "name": "HTML Injection Testing", "description": "Test for HTML injection..." },
  { "id": "hubspot-integration", "path": "skills/hubspot-integration", "name": "hubspot-integration", "description": "Expert patterns for HubSpot..." },
  { "id": "i18n-localization", "path": "skills/i18n-localization", "name": "i18n-localization", "description": "Internationalization patterns..." },
  { "id": "idor-testing", "path": "skills/idor-testing", "name": "IDOR Vulnerability Testing", "description": "Test for insecure direct object references..." },
  { "id": "inngest", "path": "skills/inngest", "name": "inngest", "description": "Inngest expert for serverless jobs..." },
  { "id": "interactive-portfolio", "path": "skills/interactive-portfolio", "name": "interactive-portfolio", "description": "Expert in building portfolios..." },
  { "id": "internal-comms-anthropic", "path": "skills/internal-comms-anthropic", "name": "internal-comms", "description": "Write internal communications..." },
  { "id": "javascript-mastery", "path": "skills/javascript-mastery", "name": "javascript-mastery", "description": "Comprehensive JavaScript reference..." },
  { "id": "kaizen", "path": "skills/kaizen", "name": "kaizen", "description": "Guide for continuous improvement..." },
  { "id": "langfuse", "path": "skills/langfuse", "name": "langfuse", "description": "Langfuse LLM observability..." },
  { "id": "langgraph", "path": "skills/langgraph", "name": "langgraph", "description": "LangGraph expert for stateful agents..." },
  { "id": "launch-strategy", "path": "skills/launch-strategy", "name": "launch-strategy", "description": "Plan a product launch..." },
  { "id": "lint-and-validate", "path": "skills/lint-and-validate", "name": "lint-and-validate", "description": "Automatic quality control..." },
  { "id": "linux-privilege-escalation", "path": "skills/linux-privilege-escalation", "name": "Linux Privilege Escalation", "description": "Escalate privileges on Linux..." },
  { "id": "linux-shell-scripting", "path": "skills/linux-shell-scripting", "name": "Linux Production Shell Scripts", "description": "Create bash scripts..." },
  { "id": "llm-app-patterns", "path": "skills/llm-app-patterns", "name": "llm-app-patterns", "description": "Production-ready patterns for LLM apps..." },
  { "id": "loki-mode", "path": "skills/loki-mode", "name": "loki-mode", "description": "Multi-agent autonomous startup system..." },
  { "id": "marketing-ideas", "path": "skills/marketing-ideas", "name": "marketing-ideas", "description": "Marketing ideas and strategies..." },
  { "id": "marketing-psychology", "path": "skills/marketing-psychology", "name": "marketing-psychology", "description": "Apply psychological principles to marketing..." },
  { "id": "mcp-builder", "path": "skills/mcp-builder", "name": "mcp-builder", "description": "Guide for creating MCP servers..." },
  { "id": "metasploit-framework", "path": "skills/metasploit-framework", "name": "Metasploit Framework", "description": "Use Metasploit for pentesting..." },
  { "id": "micro-saas-launcher", "path": "skills/micro-saas-launcher", "name": "micro-saas-launcher", "description": "Launching small SaaS products..." },
  { "id": "mobile-design", "path": "skills/mobile-design", "name": "mobile-design", "description": "Mobile-first design thinking..." },
  { "id": "mobile-games", "path": "skills/game-development/mobile-games", "name": "mobile-games", "description": "Mobile game development..." },
  { "id": "moodle-external-api-development", "path": "skills/moodle-external-api-development", "name": "moodle-external-api-development", "description": "Create custom Moodle APIs..." },
  { "id": "multiplayer", "path": "skills/game-development/multiplayer", "name": "multiplayer", "description": "Multiplayer game principles..." },
  { "id": "neon-postgres", "path": "skills/neon-postgres", "name": "neon-postgres", "description": "Neon serverless Postgres..." },
  { "id": "nestjs-expert", "path": "skills/nestjs-expert", "name": "nestjs-expert", "description": "Nest.js framework expert..." },
  { "id": "network-101", "path": "skills/network-101", "name": "Network 101", "description": "Network configuration and testing..." },
  { "id": "nextjs-best-practices", "path": "skills/nextjs-best-practices", "name": "nextjs-best-practices", "description": "Next.js App Router principles..." },
  { "id": "nextjs-supabase-auth", "path": "skills/nextjs-supabase-auth", "name": "nextjs-supabase-auth", "description": "Supabase Auth with Next.js..." },
  { "id": "nodejs-best-practices", "path": "skills/nodejs-best-practices", "name": "nodejs-best-practices", "description": "Node.js development principles..." },
  { "id": "notebooklm", "path": "skills/notebooklm", "name": "notebooklm", "description": "Query Google NotebookLM..." },
  { "id": "notion-template-business", "path": "skills/notion-template-business", "name": "notion-template-business", "description": "Building and selling Notion templates..." },
  { "id": "onboarding-cro", "path": "skills/onboarding-cro", "name": "onboarding-cro", "description": "Optimize onboarding flows..." },
  { "id": "page-cro", "path": "skills/page-cro", "name": "page-cro", "description": "Optimize marketing page conversion..." },
  { "id": "paid-ads", "path": "skills/paid-ads", "name": "paid-ads", "description": "Help with paid ad campaigns..." },
  { "id": "parallel-agents", "path": "skills/parallel-agents", "name": "parallel-agents", "description": "Multi-agent orchestration..." },
  { "id": "paywall-upgrade-cro", "path": "skills/paywall-upgrade-cro", "name": "paywall-upgrade-cro", "description": "Optimize in-app paywalls..." },
  { "id": "pc-games", "path": "skills/game-development/pc-games", "name": "pc-games", "description": "PC/Console game development..." },
  { "id": "pdf-official", "path": "skills/pdf-official", "name": "pdf", "description": "Comprehensive PDF manipulation..." },
  { "id": "pentest-checklist", "path": "skills/pentest-checklist", "name": "Pentest Checklist", "description": "Plan a penetration test..." },
  { "id": "pentest-commands", "path": "skills/pentest-commands", "name": "Pentest Commands", "description": "Essential pentest commands..." },
  { "id": "performance-profiling", "path": "skills/performance-profiling", "name": "performance-profiling", "description": "Performance profiling principles..." },
  { "id": "personal-tool-builder", "path": "skills/personal-tool-builder", "name": "personal-tool-builder", "description": "Build custom tools..." },
  { "id": "plaid-fintech", "path": "skills/plaid-fintech", "name": "plaid-fintech", "description": "Plaid API integration..." },
  { "id": "plan-writing", "path": "skills/plan-writing", "name": "plan-writing", "description": "Structured task planning..." },
  { "id": "planning-with-files", "path": "skills/planning-with-files", "name": "planning-with-files", "description": "Manus-style file-based planning..." },
  { "id": "playwright-skill", "path": "skills/playwright-skill", "name": "playwright-skill", "description": "Browser automation with Playwright..." },
  { "id": "popup-cro", "path": "skills/popup-cro", "name": "popup-cro", "description": "Optimize popups and modals..." },
  { "id": "powershell-windows", "path": "skills/powershell-windows", "name": "powershell-windows", "description": "PowerShell Windows patterns..." },
  { "id": "pptx-official", "path": "skills/pptx-official", "name": "pptx", "description": "Presentation creation and editing..." },
  { "id": "pricing-strategy", "path": "skills/pricing-strategy", "name": "pricing-strategy", "description": "Pricing decisions and strategy..." },
  { "id": "prisma-expert", "path": "skills/prisma-expert", "name": "prisma-expert", "description": "Prisma ORM expert..." },
  { "id": "privilege-escalation-methods", "path": "skills/privilege-escalation-methods", "name": "Privilege Escalation Methods", "description": "Escalate privileges guidance..." },
  { "id": "product-manager-toolkit", "path": "skills/product-manager-toolkit", "name": "product-manager-toolkit", "description": "Toolkit for product managers..." },
  { "id": "production-code-audit", "path": "skills/production-code-audit", "name": "production-code-audit", "description": "Deep-scan codebase for improvements..." },
  { "id": "programmatic-seo", "path": "skills/programmatic-seo", "name": "programmatic-seo", "description": "Create SEO pages at scale..." },
  { "id": "prompt-caching", "path": "skills/prompt-caching", "name": "prompt-caching", "description": "Caching strategies for LLMs..." },
  { "id": "prompt-engineer", "path": "skills/prompt-engineer", "name": "prompt-engineer", "description": "Expert in designing prompts..." },
  { "id": "prompt-engineering", "path": "skills/prompt-engineering", "name": "prompt-engineering", "description": "Guide on prompting patterns..." },
  { "id": "prompt-library", "path": "skills/prompt-library", "name": "prompt-library", "description": "Collection of high-quality prompts..." },
  { "id": "python-patterns", "path": "skills/python-patterns", "name": "python-patterns", "description": "Python development principles..." },
  { "id": "rag-engineer", "path": "skills/rag-engineer", "name": "rag-engineer", "description": "Expert in RAG systems..." },
  { "id": "react-patterns", "path": "skills/react-patterns", "name": "react-patterns", "description": "Modern React patterns..." },
  { "id": "react-ui-patterns", "path": "skills/react-ui-patterns", "name": "react-ui-patterns", "description": "React UI loading/error states..." },
  { "id": "red-team-tools", "path": "skills/red-team-tools", "name": "Red Team Tools", "description": "Red team methodology..." },
  { "id": "red-team-tactics", "path": "skills/red-team-tactics", "name": "red-team-tactics", "description": "Tactics based on MITRE ATT&CK..." },
  { "id": "referral-program", "path": "skills/referral-program", "name": "referral-program", "description": "Create referral programs..." },
  { "id": "remotion-best-practices", "path": "skills/remotion-best-practices", "name": "remotion-best-practices", "description": "Video creation in React..." },
  { "id": "research-engineer", "path": "skills/research-engineer", "name": "research-engineer", "description": "Academic Research Engineer..." },
  { "id": "salesforce-development", "path": "skills/salesforce-development", "name": "salesforce-development", "description": "Salesforce development patterns..." },
  { "id": "schema-markup", "path": "skills/schema-markup", "name": "schema-markup", "description": "Add schema markup for SEO..." },
  { "id": "scroll-experience", "path": "skills/scroll-experience", "name": "scroll-experience", "description": "Immersive scroll-driven experiences..." },
  { "id": "scanning-tools", "path": "skills/scanning-tools", "name": "Security Scanning Tools", "description": "Perform vulnerability scanning..." },
  { "id": "cc-skill-security-review", "path": "skills/cc-skill-security-review", "name": "security-review", "description": "Security checklist and patterns..." },
  { "id": "segment-cdp", "path": "skills/segment-cdp", "name": "segment-cdp", "description": "Segment CDP patterns..." },
  { "id": "senior-architect", "path": "skills/senior-architect", "name": "senior-architect", "description": "Software architecture skill..." },
  { "id": "senior-fullstack", "path": "skills/senior-fullstack", "name": "senior-fullstack", "description": "Comprehensive fullstack skill..." },
  { "id": "seo-audit", "path": "skills/seo-audit", "name": "seo-audit", "description": "Audit SEO issues..." },
  { "id": "seo-fundamentals", "path": "skills/seo-fundamentals", "name": "seo-fundamentals", "description": "SEO fundamentals and E-E-A-T..." },
  { "id": "server-management", "path": "skills/server-management", "name": "server-management", "description": "Server management principles..." },
  { "id": "shodan-reconnaissance", "path": "skills/shodan-reconnaissance", "name": "Shodan Reconnaissance", "description": "Search for exposed devices..." },
  { "id": "shopify-apps", "path": "skills/shopify-apps", "name": "shopify-apps", "description": "Shopify app development..." },
  { "id": "shopify-development", "path": "skills/shopify-development", "name": "shopify-development", "description": "Shopify development..." },
  { "id": "signup-flow-cro", "path": "skills/signup-flow-cro", "name": "signup-flow-cro", "description": "Optimize signup flows..." },
  { "id": "skill-creator", "path": "skills/skill-creator", "name": "skill-creator", "description": "Guide for creating skills..." },
  { "id": "skill-developer", "path": "skills/skill-developer", "name": "skill-developer", "description": "Create and manage Claude Code skills..." },
  { "id": "slack-bot-builder", "path": "skills/slack-bot-builder", "name": "slack-bot-builder", "description": "Build Slack apps..." },
  { "id": "slack-gif-creator", "path": "skills/slack-gif-creator", "name": "slack-gif-creator", "description": "Create GIFs for Slack..." },
  { "id": "smtp-penetration-testing", "path": "skills/smtp-penetration-testing", "name": "SMTP Penetration Testing", "description": "Test SMTP server security..." },
  { "id": "social-content", "path": "skills/social-content", "name": "social-content", "description": "Social media content strategy..." },
  { "id": "software-architecture", "path": "skills/software-architecture", "name": "software-architecture", "description": "Quality focused architecture..." },
  { "id": "sql-injection-testing", "path": "skills/sql-injection-testing", "name": "SQL Injection Testing", "description": "Test for SQL injection..." },
  { "id": "sqlmap-database-pentesting", "path": "skills/sqlmap-database-pentesting", "name": "SQLMap Database Pentesting", "description": "Automate database pentesting..." },
  { "id": "ssh-penetration-testing", "path": "skills/ssh-penetration-testing", "name": "SSH Penetration Testing", "description": "Pentest SSH services..." },
  { "id": "stripe-integration", "path": "skills/stripe-integration", "name": "stripe-integration", "description": "Stripe payments integration..." },
  { "id": "postgres-best-practices", "path": "skills/postgres-best-practices", "name": "supabase-postgres-best-practices", "description": "Postgres optimization..." },
  { "id": "tailwind-patterns", "path": "skills/tailwind-patterns", "name": "tailwind-patterns", "description": "Tailwind CSS v4 patterns..." },
  { "id": "tdd-workflow", "path": "skills/tdd-workflow", "name": "tdd-workflow", "description": "TDD workflow principles..." },
  { "id": "telegram-bot-builder", "path": "skills/telegram-bot-builder", "name": "telegram-bot-builder", "description": "Build Telegram bots..." },
  { "id": "telegram-mini-app", "path": "skills/telegram-mini-app", "name": "telegram-mini-app", "description": "Build Telegram Mini Apps..." },
  { "id": "templates", "path": "skills/app-builder/templates", "name": "templates", "description": "Project scaffolding templates..." },
  { "id": "test-fixing", "path": "skills/test-fixing", "name": "test-fixing", "description": "Fix failing tests..." },
  { "id": "testing-patterns", "path": "skills/testing-patterns", "name": "testing-patterns", "description": "Jest testing patterns..." },
  { "id": "theme-factory", "path": "skills/theme-factory", "name": "theme-factory", "description": "Toolkit for styling artifacts..." },
  { "id": "top-web-vulnerabilities", "path": "skills/top-web-vulnerabilities", "name": "Top 100 Web Vulnerabilities", "description": "Vulnerability reference..." },
  { "id": "trigger-dev", "path": "skills/trigger-dev", "name": "trigger-dev", "description": "Trigger.dev background jobs..." },
  { "id": "twilio-communications", "path": "skills/twilio-communications", "name": "twilio-communications", "description": "Build communication features with Twilio..." },
  { "id": "typescript-expert", "path": "skills/typescript-expert", "name": "typescript-expert", "description": "TypeScript expertise..." },
  { "id": "ui-ux-pro-max", "path": "skills/ui-ux-pro-max", "name": "ui-ux-pro-max", "description": "UI/UX design intelligence..." },
  { "id": "upstash-qstash", "path": "skills/upstash-qstash", "name": "upstash-qstash", "description": "Serverless message queues..." },
  { "id": "vercel-deployment", "path": "skills/vercel-deployment", "name": "vercel-deployment", "description": "Deploying to Vercel..." },
  { "id": "react-best-practices", "path": "skills/react-best-practices", "name": "vercel-react-best-practices", "description": "React performance guidelines..." },
  { "id": "viral-generator-builder", "path": "skills/viral-generator-builder", "name": "viral-generator-builder", "description": "Build viral generator tools..." },
  { "id": "voice-agents", "path": "skills/voice-agents", "name": "voice-agents", "description": "Real-time voice agents..." },
  { "id": "voice-ai-development", "path": "skills/voice-ai-development", "name": "voice-ai-development", "description": "Building voice AI apps..." },
  { "id": "vr-ar", "path": "skills/game-development/vr-ar", "name": "vr-ar", "description": "VR/AR development..." },
  { "id": "vulnerability-scanner", "path": "skills/vulnerability-scanner", "name": "vulnerability-scanner", "description": "Vulnerability analysis..." },
  { "id": "web-artifacts-builder", "path": "skills/web-artifacts-builder", "name": "web-artifacts-builder", "description": "Create complex HTML artifacts..." },
  { "id": "web-design-guidelines", "path": "skills/web-design-guidelines", "name": "web-design-guidelines", "description": "Review UI code..." },
  { "id": "web-games", "path": "skills/game-development/web-games", "name": "web-games", "description": "Web browser game development..." },
  { "id": "web-performance-optimization", "path": "skills/web-performance-optimization", "name": "web-performance-optimization", "description": "Optimize web performance..." },
  { "id": "webapp-testing", "path": "skills/webapp-testing", "name": "webapp-testing", "description": "Test local web apps..." },
  { "id": "windows-privilege-escalation", "path": "skills/windows-privilege-escalation", "name": "Windows Privilege Escalation", "description": "Escalate privileges on Windows..." },
  { "id": "wireshark-analysis", "path": "skills/wireshark-analysis", "name": "Wireshark Network Analysis", "description": "Analyze network traffic..." },
  { "id": "wordpress-penetration-testing", "path": "skills/wordpress-penetration-testing", "name": "WordPress Penetration Testing", "description": "Pentest WordPress sites..." },
  { "id": "workflow-automation", "path": "skills/workflow-automation", "name": "workflow-automation", "description": "Reliable AI workflows..." },
  { "id": "writing-skills", "path": "skills/writing-skills", "name": "writing-skills", "description": "Creating and verifying skills..." },
  { "id": "xlsx-official", "path": "skills/xlsx-official", "name": "xlsx", "description": "Spreadsheet manipulation..." },
  { "id": "zapier-make-patterns", "path": "skills/zapier-make-patterns", "name": "zapier-make-patterns", "description": "No-code automation patterns..." }
];

// --- Enrichment Logic ---
const getEnrichedData = (skills: RawSkill[]): EnrichedSkill[] => {
  return skills.map(skill => {
    let category: SkillCategory = 'Fullstack DevOps';
    let usefulness = 75;
    
    // Clean up original description
    let specificDesc = skill.description;
    if (specificDesc) {
      // Remove surrounding quotes if present
      if (specificDesc.startsWith('"') && specificDesc.endsWith('"')) {
        specificDesc = specificDesc.slice(1, -1);
      }
      // Handle the pipe placeholder case
      if (specificDesc === "|" || specificDesc.trim() === "") {
        specificDesc = "No specific description available for this skill.";
      }
    } else {
        specificDesc = "No description available.";
    }

    // Initialize laymanDesc with the specific description
    let laymanDesc = specificDesc;
    let useCases: string[] = ["General development", "Code improvement"];
    let keywords: string[] = ["coding", "development", "programming", "tech", "software", "engineering", "tools", "utility", "productivity", "guide"];

    const id = skill.id.toLowerCase();
    const name = skill.name.toLowerCase();

    // --- Category & Detail Logic ---
    if (id.includes('security') || id.includes('pentest') || id.includes('attack') || id.includes('vulnerability') || id.includes('exploit') || id.includes('hacking') || id.includes('burp') || id.includes('shodan') || id.includes('wireshark') || id.includes('escalation') || id.includes('injection')) {
      category = 'Purple Security Analyst';
      usefulness = 95;
      useCases = ["Conducting a penetration test", "Auditing system security", "Finding vulnerabilities before hackers do", "Red teaming exercises"];
      keywords = ["cybersecurity", "hacking", "pentesting", "vulnerability", "exploit", "red team", "blue team", "network security", "infosec", "audit", "compliance", "threat analysis", "risk assessment", "system hardening"];
    } 
    else if (id.includes('aws') || id.includes('azure') || id.includes('docker') || id.includes('linux') || id.includes('server') || id.includes('network') || id.includes('deployment') || id.includes('environment') || id.includes('gcp') || id.includes('vercel')) {
      category = 'Sys Admin & Cloud';
      usefulness = 90;
      useCases = ["Setting up a cloud server", "Deploying an application to the web", "Managing containers", "Automating server tasks"];
      keywords = ["cloud", "server", "infrastructure", "devops", "aws", "azure", "deployment", "linux", "hosting", "backend", "system admin", "docker", "containers", "serverless", "scale"];
    }
    else if (id.includes('marketing') || id.includes('pricing') || id.includes('product') || id.includes('seo') || id.includes('growth') || id.includes('business') || id.includes('launch') || id.includes('stripe') || id.includes('analytics') || id.includes('cro')) {
      category = 'Business & Growth';
      usefulness = 88;
      useCases = ["Planning a product launch", "Optimizing pricing strategy", "Improving search engine ranking", "Analyzing user behavior"];
      keywords = ["business", "marketing", "growth", "strategy", "product management", "seo", "analytics", "sales", "revenue", "startup", "optimization", "conversion", "pricing", "advertising"];
    }
    else if (id.includes('agent') || id.includes('ai-') || id.includes('llm') || id.includes('prompt') || id.includes('rag') || id.includes('langgraph') || id.includes('crewai') || id.includes('voice') || id.includes('trigger') || id.includes('automation')) {
      category = 'LLMs & Automation';
      usefulness = 98;
      useCases = ["Building a customer service bot", "Automating complex workflows", "Creating AI agents that can code", "Optimizing AI prompts"];
      keywords = ["ai", "artificial intelligence", "automation", "llm", "agents", "machine learning", "workflow", "bots", "chatbots", "prompt engineering", "rag", "generative ai", "nlp", "future tech"];
    }
    else if (id.includes('sql') || id.includes('data') || id.includes('xlsx') || id.includes('spreadsheet') || id.includes('clickhouse') || id.includes('postgres') || id.includes('prisma') || id.includes('database')) {
      category = 'Data Handling';
      usefulness = 85;
      useCases = ["Designing a database schema", "Analyzing spreadsheet data", "Optimizing database queries", "Managing data migrations"];
      keywords = ["data", "database", "sql", "analytics", "storage", "backend", "information", "query", "spreadsheet", "excel", "schema", "migration", "data science", "statistics"];
    }
    else if (id.includes('write') || id.includes('writing') || id.includes('doc') || id.includes('copy') || id.includes('content') || id.includes('social') || id.includes('blog') || id.includes('viral')) {
        // Distinguish technical docs from creative content
        if (id.includes('technical') || id.includes('doc')) {
             category = 'Writing & Docs';
             usefulness = 80;
             useCases = ["Writing API documentation", "Creating user manuals", "Structuring project wikis", "Technical editing"];
             keywords = ["writing", "documentation", "technical writing", "docs", "manuals", "guides", "communication", "clarity", "editing", "publishing"];
        } else {
             category = 'Content Creation';
             usefulness = 85;
             useCases = ["Writing blog posts", "Creating social media threads", "Drafting email newsletters", "Generating viral ideas"];
             keywords = ["content", "creative", "social media", "marketing", "copywriting", "blogging", "storytelling", "viral", "audience", "engagement", "media", "publishing", "brand voice"];
        }
    }
    else if (id.includes('game') || id.includes('3d') || id.includes('canvas') || id.includes('design') || id.includes('art') || id.includes('ui') || id.includes('ux') || id.includes('video') || id.includes('remotion')) {
      category = 'Graphics & Game Dev';
      usefulness = 78;
      useCases = ["Developing a mobile game", "Creating a 3D website", "Designing a user interface", "Programmatic video creation"];
      keywords = ["graphics", "design", "ui", "ux", "game dev", "3d", "rendering", "visuals", "art", "creative", "animation", "frontend", "webgl", "unity", "interactive"];
    }
    else {
        // Fallback to Fullstack for coding stuff
       category = 'Fullstack DevOps';
       usefulness = 92;
       useCases = ["Building a React app", "Creating a mobile app", "Debugging code", "Setting up a development environment"];
       keywords = ["coding", "programming", "development", "web dev", "app dev", "software", "engineering", "fullstack", "frontend", "backend", "react", "typescript", "javascript", "code quality"];
    }

    return {
      ...skill,
      category,
      usefulness,
      laymanDesc,
      useCases,
      keywords: [...keywords, ...skill.name.split(' '), ...skill.id.split('-')].filter((v, i, a) => a.indexOf(v) === i && v.length > 2).slice(0, 15)
    };
  });
};

const CATEGORIES: { id: SkillCategory; icon: any; color: string }[] = [
  { id: 'Purple Security Analyst', icon: Shield, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Fullstack DevOps', icon: Code, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'LLMs & Automation', icon: Cpu, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Sys Admin & Cloud', icon: Server, color: 'text-slate-600 bg-slate-50 border-slate-200' },
  { id: 'Business & Growth', icon: TrendingUp, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Data Handling', icon: Database, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { id: 'Graphics & Game Dev', icon: Gamepad2, color: 'text-pink-600 bg-pink-50 border-pink-200' },
  { id: 'Content Creation', icon: PenTool, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'Writing & Docs', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
];

export default function SkillLibraryViewer() {
  const [rawData, setRawData] = useState<RawSkill[]>(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState<SkillCategory>('Purple Security Analyst');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<EnrichedSkill | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const enrichedData = useMemo(() => getEnrichedData(rawData), [rawData]);

  const filteredSkills = useMemo(() => {
    return enrichedData.filter(skill => {
      const matchesTab = skill.category === activeTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        skill.name.toLowerCase().includes(searchLower) || 
        skill.description.toLowerCase().includes(searchLower) ||
        skill.keywords.some(k => k.toLowerCase().includes(searchLower));
      
      return matchesTab && matchesSearch;
    }).sort((a, b) => b.usefulness - a.usefulness);
  }, [activeTab, searchQuery, enrichedData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
            // Basic validation
            const isValid = json.every(item => item.id && item.name && item.description);
            if (!isValid) {
               setErrorMsg("Invalid JSON: Items must have id, name, and description fields.");
               return;
            }
            setRawData(json);
            setSelectedSkill(null);
            setSearchQuery('');
        } else {
            setErrorMsg("Invalid JSON format. Expected an array of skills.");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Skill Library Navigator</h1>
              <p className="text-sm text-gray-500 mt-1">
                {enrichedData.length} Skills Analyzed & Categorized
              </p>
              {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Upload Button */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".json"
              />
              <button 
                onClick={handleUploadClick}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Upload JSON Skill List"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload JSON
              </button>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 sm:text-sm"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="flex overflow-x-auto pb-0 hide-scrollbar space-x-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              const count = enrichedData.filter(s => s.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`
                    flex items-center whitespace-nowrap px-4 py-3 border-b-2 font-medium text-sm transition-colors duration-200
                    ${isActive 
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {cat.id}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex max-w-7xl mx-auto w-full">
        {/* Left List */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 ${selectedSkill ? 'hidden md:block md:w-1/2 lg:w-2/3' : 'w-full'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => (
              <div 
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`
                  bg-white rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:shadow-md group
                  ${selectedSkill?.id === skill.id ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'border-gray-200'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-1">{skill.name}</h3>
                  <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{skill.usefulness}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                  {skill.laymanDesc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {skill.useCases.slice(0, 2).map((useCase, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      <Check className="w-3 h-3 mr-1 text-gray-400" />
                      {useCase}
                    </span>
                  ))}
                  {skill.useCases.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-400">
                      +{skill.useCases.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {filteredSkills.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No skills found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search terms or category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Panel */}
        {selectedSkill && (
          <div className="w-full md:w-1/2 lg:w-1/3 border-l border-gray-200 bg-white overflow-y-auto absolute inset-0 md:relative z-20 shadow-xl md:shadow-none flex flex-col">
            <div className="p-6">
              <button 
                onClick={() => setSelectedSkill(null)}
                className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${CATEGORIES.find(c => c.id === selectedSkill.category)?.color}`}>
                  {selectedSkill.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-900">{selectedSkill.name}</h2>
                <div className="flex items-center mt-2 text-sm text-gray-500 font-mono bg-gray-50 p-2 rounded border border-gray-100 break-all">
                  <Hash className="w-3 h-3 mr-2 shrink-0" />
                  {selectedSkill.id}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Layman's Description</h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-blue-900 leading-relaxed">
                      {selectedSkill.laymanDesc}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Technical Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedSkill.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Primary Use Cases</h4>
                  <ul className="space-y-3">
                    {selectedSkill.useCases.map((uc, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <span className="ml-3 text-gray-700">{uc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Search Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.keywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-default">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Footer */}
            <div className="mt-auto border-t border-gray-200 p-6 bg-gray-50">
               <div className="w-full bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                 <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Usefulness Quotient</p>
                    <div className="text-xl font-bold text-gray-900">{selectedSkill.usefulness}/100</div>
                 </div>
                 <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${selectedSkill.usefulness}%` }} />
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
