# AI Prompt Engineering Documentation

This document contains the prompt logic used for Feature 4: AI-Generated Personalized Summary.

## 1. Executive Summary Prompt
**Model:** Groq / Llama-3.1-8b-instant (or Anthropic Claude 3.5 Sonnet)
**Purpose:** Generate a professional, sharp executive briefing based on the raw audit data.

### System Prompt:
```text
You are Nexus, a professional AI auditor and financial strategist. 
Analyze the provided AI Audit Report and provide a sharp, professional executive summary (~100 words).

Context:
- Current Monthly Spend: $[currentMonthlySpend]
- Potential Monthly Savings: $[totalMonthlyDelta]
- Engine Version: [engineVersion]
- Health Status: [isHealthyStack]
- Key Recommendations: [titles]

Tone: Enterprise Executive (Linear/Stripe style). Focus on ROI, security, and strategic consolidation. 
Be direct, data-driven, and authoritative. Avoid fluff or overly enthusiastic marketing speak.
```

### Prompt Strategy:
- **Heuristic-First:** We pass the calculated math (ROI, Delta) to the AI rather than asking the AI to do the math. This ensures 100% accuracy in the figures while benefiting from the AI's natural language capabilities.
- **Tone Control:** By specifying "Linear/Stripe style," we achieve the high-fidelity enterprise OS aesthetic requested by the user.

### ❌ What Didn't Work:
- **Iteration 1 (Math Hallucination):** I initially tried sending the raw tool names to the AI and asked it to "Calculate the savings." The AI failed miserably—it hallucinated pricing tiers that didn't exist and made subtraction errors. 
- **The Fix:** I pivoted to a "Deterministic-First" approach. The TypeScript engine calculates the exact dollars saved, and the AI only handles the "Personalization" and "Tone."

## 2. Voice Assistant (Nexus) Prompt
**Model:** Groq / Llama-3.1-8b-instant
**Purpose:** Parse user voice commands and decide on UI actions.

### System Prompt:
```text
You are Nexus, a professional AI auditor. 
Analyze the user's voice command and decide on an action.
Return ONLY a JSON object in this format: 
{ 
  "action": "navigate" | "speak" | "scroll", 
  "target": string (path or element id), 
  "spoken_response": "natural language response as a helpful female assistant" 
}
Current page: [currentPath]
```

### Reasoning:
- **Intent Extraction:** The AI maps vague user speech ("go home," "show me the money") to specific technical targets (`/` or scroll targets).
- **JSON Output:** Using `response_format: { type: 'json_object' }` ensures reliable integration with the frontend voice handler.

### ❌ What Didn't Work:
- **Iteration 1 (Conversational Noise):** Initially, I let the AI return natural text. However, it would add "polite filler" like "Sure, I can help you with that! Navigating now..." which made the JSON impossible to parse in the frontend.
- **The Fix:** I implemented strict JSON-only enforcement in the system prompt and used Groq's `json_object` mode to ensure the output is always a valid technical instruction.
