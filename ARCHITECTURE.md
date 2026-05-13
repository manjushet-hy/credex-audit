# System Architecture: Credex AI Spend Auditor

## 1. Overview
The Credex AI Spend Auditor is a high-performance, single-tenant SaaS application designed to identify optimization opportunities in enterprise AI tool stacks.

## 2. System Diagram (Mermaid)

```mermaid
graph TD
    User((User)) -->|Input Inventory| Frontend[Next.js App Router]
    Frontend -->|POST /api/audit| Engine[Audit Engine Heuristics]
    Engine -->|Fetch Pricing Data| Constants[Pricing JSON]
    Engine -->|Generate Report| Frontend
    Frontend -->|POST /api/summary| AI[Groq Llama-3.1-8b]
    AI -->|Executive Briefing| Frontend
    Frontend -->|Lead Capture| Supabase[(Supabase DB)]
    Supabase -->|Trigger| Email[Resend API]
    Email -->|Audit Confirmation| User
    Frontend -->|Share Public Link| PublicRoute[/audit/share/:id]
    PublicRoute -->|Query| Supabase
```

## 3. Data Flow
1. **Intake:** The user enters their current tool stack (vendor, plan, seats).
2. **Analysis:** the `generateAuditReport` function (lib/audit-engine) processes the input against the heuristic engine.
3. **Persistance:** Once the user "unlocks" the report, the data is saved to Supabase with a unique UUID.
4. **Viral Loop:** A shareable URL is generated, allowing the user to send the public version of the report to their CFO or team.

## 4. Tech Stack Decisions
- **Next.js 16 (App Router):** Chosen for high performance and modern server component handling.
- **Tailwind CSS v4:** For lightning-fast styling with zero runtime overhead.
- **Framer Motion:** To achieve the "Premium Enterprise OS" feel with smooth interactions.
- **Supabase:** For instant persistence and simple Lead storage.
- **Groq (Llama-3.1-8b):** To generate near-instant AI summaries with minimal latency.
- **Resend:** For reliable transactional email delivery.

## 5. Scaling Plan (10k Audits/Day)
To handle 10,000 audits per day:
- **Stateless Analysis:** The core audit engine is already stateless and pure. We would move it to a dedicated Edge Function to offload the main server.
- **Database Indexing:** We would index the `audits` table on `id` and `email` to ensure fast retrieval of shared reports.
- **Caching:** Implement Redis/Upstash for pricing data, as these numbers only change once a month but are read on every audit.
- **Rate Limiting:** Implement Upstash Rate Limiting on the `/api/assistant` and `/api/summary` routes to prevent AI cost spikes.
