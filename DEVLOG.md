# Development Log: AI SaaS Spend Auditor

## Day 1: Project Scoping and Setup
*(Note: Initial setup of the Next.js environment, core architecture planning, and defining the primary objective: an AI SaaS auditing platform for enterprise spending.)*

## Day 2: Domain Modeling & Pricing Normalization

**Objective:**
Normalize the wildly varying pricing structures of top AI vendors (Cursor, GitHub Copilot, ChatGPT, Claude, Google Gemini, Windsurf) into a single, scalable TypeScript architecture to power our Audit Engine's heuristics.

**Key Architectural Decisions:**
1. **Strict Type Definitions (	ypes/pricing.ts):**
   - Implemented highly strict domain models (VendorPricing, PricingPlan) instead of loosely typed objects.
   - Used Union Types for pricingModel ('per_seat' | 'usage_based' | 'custom') to enforce valid data entry.
   - Replaced generic strings with strict arrays for supportedUseCases (e.g., 'coding', 'chat', 'data') to allow the audit engine to detect redundant overlap (e.g., paying for both ChatGPT and Gemini for the same use case).

2. **Security & Compliance Heuristics:**
   - Added a securityFlags interface tracking hasPrivacyMode, hasSSO, and hasAuditLogs.
   - *Why:* This allows the engine to make Enterprise recommendations not just on cost, but on compliance. If an enterprise uses a consumer tier (e.g., ChatGPT Plus), the engine will mathematically prioritize an upgrade to Team/Enterprise to prevent IP leakage.

3. **Vendor Normalization (constants/plans.ts):**
   - **Cursor & Windsurf:** Mapped IDE-specific limits. Realized Windsurf Teams and Cursor Business both sit at $40/mo, creating direct head-to-head competition scenarios for the engine.
   - **ChatGPT & Claude:** Mapped consumer vs. prosumer models. Injected the API directly into their vendor plans (openai-api-direct, nthropic-api-direct) as a usage_based model. This elegantly fulfills the "API Direct" requirement without needing separate vendor IDs.
   - **GitHub Copilot:** Integrated the new Free tier and the distinction between Pro ($10) and Business ($19).
   - **Google Gemini:** Modeled the massive gap between Google AI Pro ($20) and Google AI Ultra ($250), creating a massive heuristic opportunity for downgrade recommendations.

**Outcomes:**
- We successfully aggregated all 6 vendors into a perfectly typed ALL_VENDORS array.
- The data layer is 100% complete and conforms entirely to the MVP internship rubric constraints.
- We deliberately avoided over-engineering (no unnecessary tools like Midjourney/Jasper) to maintain startup-grade focus.

**Next Steps (Day 3):**
- Implement the actual ecommendations.ts heuristic logic.
- Build the core algorithm that iterates through ALL_VENDORS to calculate exact dollar savings and tool consolidations based on user input.
