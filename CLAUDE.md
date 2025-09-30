> Merchant Management Portal — build rules & tech stack

## Purpose
This document defines how we build and collaborate on the project consistently: rules, tech stack, and practices.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Framer Motion  
- **Backend/Infra:** Firebase (Auth, Firestore, Cloud Functions, Hosting, Storage, Cloud Messaging)

## Rules
- **Every change → push to Git** (small, atomic commits).  
- **No hard-coding, no mockups** — use env vars and Firestore config.  
- **Create shared pieces** when a component/hook/util is used **2+ times** (keep generic).
- **Prefer stable libraries** (well-supported, production-ready) for new features.  
- **Code style:** strict TypeScript, Prettier + ESLint, Tailwind conventions.  
- **CI/CD:** PR must pass build, lint, and tests before merge.