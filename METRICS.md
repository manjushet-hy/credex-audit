# Metrics: Measuring Audit Success

## 1. The North Star Metric
**Audit-to-Lead Conversion Rate (ALCR).**
*Why:* This tool's primary purpose is lead generation for Credex. A high number of audits is useless if they don't convert into a capture lead (Email/Company/Role).

## 2. Input Metrics
1. **Tool Inventory Density:** Average number of tools entered per audit. (Higher density = more complex stacks = higher value for Credex).
2. **Mean Projected Savings:** The total dollar amount our engine identifies as "savable." (This drives the urgency for the user to convert).
3. **Viral Coefficient (k):** Number of shares per audit completion.

## 3. First Instrumentation
We will use **PostHog** or **Plausible** to track the "Audit Flow" funnel:
- `step_1_start` (Home)
- `step_2_inventory_entered` (Dashboard view)
- `step_3_unlock_clicked` (Lead gate triggered)
- `step_4_lead_captured` (Success)

## 4. Pivot Decision
**The "Pivot Number": < 2% Lead Conversion.**
If fewer than 2% of people who run an audit are willing to "Unlock" it with their email, it means our "Executive Summary" or "Projected Savings" aren't compelling enough. We would pivot to an "Open First" model or focus on a more specific niche (e.g., just Cursor audits).
