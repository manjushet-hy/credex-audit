# Credex AI Spend Auditor: The "Mint" for Enterprise AI

**Credex AI Spend Auditor** is a professional-grade diagnostic tool built for startup founders and finance teams to identify overspend, security gaps, and consolidation opportunities in their AI tool stack.

## 🚀 60-Second Summary
I built an end-to-end audit platform that takes a fragmented inventory of AI subscriptions (Cursor, Claude, ChatGPT, etc.) and transforms it into a defensible, executive-ready optimization report. It's designed to be a high-conversion lead-generation asset for Credex, proving the ROI of enterprise credit consolidation before a single dollar is spent.

## 📺 Demo & Screenshots
- **Live URL:** [https://credex-audit.vercel.app](https://credex-audit.vercel.app)
- **Screenshots:** (Check the `/public/screenshots` folder for high-res views)
- **Video Walkthrough:** [YouTube/Loom Link Placeholder]

## 🛠 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GROQ_API_KEY=your_key
RESEND_API_KEY=your_key
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Run Tests
```bash
npm test
```

## 🧠 Key Decisions & Trade-offs

1. **Heuristic vs. API-First:** I chose a heuristic model (manual input) for the MVP to eliminate user friction. Requiring a CFO to connect their bank account or OAuth to 7 different tools would have killed the conversion funnel.
2. **"Impact-First" UI:** I prioritized a high-fidelity "Enterprise OS" aesthetic. In B2B SaaS, the perceived value of an audit is directly tied to the professionalism of the UI.
3. **Stateless Engine:** The audit logic is a pure, stateless function. This makes it incredibly easy to test and scale to 10k+ audits/day without database bottlenecks.
4. **Next.js 16 + Turbopack:** I opted for the latest stack to ensure the fastest possible iteration speed and future-proof the codebase for long-term maintenance.
5. **No-Auth Lead Gate:** Instead of a full sign-up flow, I implemented a simple lead-capture gate to "Unlock" the AI summary. This maximizes the volume of top-of-funnel leads for Credex.

## 📂 Project Structure
- `lib/audit-engine`: The core mathematical optimization logic.
- `app/audit/[id]`: The dynamic, high-fidelity executive dashboard.
- `app/audit/share/[id]`: The public-facing viral share route.
- `components/NexusAssistant`: Global AI voice assistant for NLP-driven navigation.

---
**Built with ❤️ for the Credex Internship Assessment.**
