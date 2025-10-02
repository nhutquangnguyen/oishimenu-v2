> Merchant Management Portal — build rules & tech stack

## Purpose
This document defines how we build and collaborate on the project consistently: rules, tech stack, and practices.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Framer Motion  
- **Backend/Infra:** Firebase (Auth, Firestore, Cloud Functions, Hosting, Storage, Cloud Messaging)

## Rules

### 🚨 CRITICAL: Git Push Policy
- **ALWAYS push changes to Git immediately after any modification** (small, atomic commits)
- **Never leave uncommitted changes** — commit and push after every task completion
- **Push frequency**: After each feature, fix, or meaningful change
- **Commit message style**: Descriptive with Claude Code attribution

### 🚀 Deployment Rules
- **ONLY deploy to production when explicitly requested by the user**
- **No automatic production deployments** — always ask for permission first
- **Local development first** — test all changes locally before any deployment
- **Deployment commands**: Use `vercel --prod` only when user requests production deployment

### Development Rules
- **No hard-coding, no mockups** — use env vars and Firestore config.
- **Create shared pieces** when a component/hook/util is used **2+ times** (keep generic).
- **Prefer stable libraries** (well-supported, production-ready) for new features.
- **Code style:** strict TypeScript, Prettier + ESLint, Tailwind conventions.
- **CI/CD:** PR must pass build, lint, and tests before merge.