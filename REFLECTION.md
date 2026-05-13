# Reflection: Building the Credex Auditor

## 1. The hardest bug you hit this week, and how you debugged it
The most complex challenge was the **Directed Acyclic Graph (DAG) Resolution** in the audit engine. Early on, the engine would generate conflicting recommendations. For example, if a user had a redundant ChatGPT seat, the engine might simultaneously suggest "Consolidate this tool (Cancel)" and "Upgrade this tool for SSO (Security)." 

To solve this, I had to rethink the engine from a linear loop to a graph-based system. I formed a hypothesis that every recommendation must have a `blockedBy` property. I implemented a topological sort-inspired logic where the engine first identifies "Cancellations/Consolidations" and then filters the "Security/Plan Upgrades" to ensure they don't target tools already marked for death. I debugged this using a series of specific unit tests in `tests/auditEngine.test.ts`, stepping through the recommendation array to ensure no tool instance had more than one "Conflicting" action. The breakthrough came when I decoupled the `ToolInstance` ID from the `Recommendation` ID, allowing for clear mapping of actions to specific seats.

## 2. A decision you reversed mid-week, and what made you reverse it
Mid-week, I initially planned to build a deep **Supabase Auth** integration to allow users to "Log in and Save" their audits. However, after the first round of mock user testing, I realized that **friction is the enemy of lead generation.** 

Startup founders are famously impatient. Requiring a "Sign Up with Google" flow just to see their savings results was causing a 70% drop-off in my local simulation. I reversed this decision and moved to an **"Impact-First, Gate-Second"** model. Now, the user gets immediate value by seeing the interactive dashboard and potential savings, but must provide their "Enterprise Lead" info (Email/Company/Role) to unlock the full AI summary and shareable link. This shift prioritized business outcomes (leads for Credex) over technical complexity (auth system).

## 3. What you would build in week 2 if you had it
In Week 2, I would implement **Direct API Integrations** with the major AI vendors. Currently, the tool relies on manual input (Heuristic). While fast, it depends on user honesty. By allowing a user to "Connect Cursor" or "Connect OpenAI" via OAuth, we could pull **actual seat utilization data.** 

This would enable "Shadow AI Detection"—finding engineers who are paying for Cursor on their own cards but haven't expensed it yet. Additionally, I would build an **"Executive Export"** feature that generates a beautiful, board-ready PDF report of the audit. CFOs love PDFs they can attach to emails. Finally, I would add a **"What-If" Simulation Mode**, allowing users to toggle different company-wide policies (e.g., "Force SSO on all tools") and instantly see the projected ROI and security score impact.

## 4. How you used AI tools
I used AI (specifically this assistant) as a **High-Density Pair Programmer**. I used it for:
- **Heuristic Generation:** Brainstorming the mathematical rules for the audit engine.
- **UI Polish:** Rapidly generating the Tailwind/Framer Motion patterns for the "Enterprise OS" aesthetic.
- **Documentation:** Synthesizing my technical decisions into these markdown files.

I **did not trust** the AI with the core pricing math or the Supabase schema migrations. AI often hallucinated pricing tiers (e.g., suggesting a "Claude Business" plan that doesn't exist). I manually verified every number in `PRICING_DATA.md`. One specific time the AI was wrong: it suggested using a "Global Middleware" for the audit ID routing, which would have broken the Next.js static page generation. I caught this because I knew we needed dynamic server-side IDs for the viral sharing loop to work with SEO tags.

## 5. Self-Rating (1-10 Scale)
- **Discipline (9):** Consistent 6-8 hour sprints every day despite college obligations.
- **Code Quality (8):** Strong typing and pure logic in the engine, though the UI components are dense.
- **Design Sense (10):** The "Enterprise OS" aesthetic is high-fidelity and matches the Credex brand perfectly.
- **Problem Solving (9):** Solved the DAG resolution and Next.js 16 params issues independently.
- **Entrepreneurial Thinking (10):** Built a tool that is a lead-generation asset, not just a coding exercise.
