# Automated Test Suite

This document lists all automated tests for the Credex AI Audit Platform. These tests ensure the mathematical integrity of the spend audit logic and the security heuristic engine.

## 1. Audit Engine Core Tests
- **File:** `tests/auditEngine.test.ts`
- **Coverage:**
    - **Healthy Stack Detection:** Verifies that a perfectly optimized stack returns 0 recommendations.
    - **Security Heuristics:** Verifies that tools missing SSO or Privacy Mode are flagged for security upgrades.
    - **Consolidation Logic:** Verifies that redundant tools are flagged for cancellation.
    - **DAG Resolution:** Verifies that recommendations are logically sequenced (e.g., you cannot upgrade a tool that you are already cancelling).
- **Execution:**
  ```bash
  npm test
  ```

## 2. Environment Configuration
- **Coverage:** Validates that necessary API keys (Groq, Resend) are present.
- **Execution:** Internal build-time check.

## 3. UI Component Integrity
- **Coverage:** Manual verification of responsive layout, glassmorphism rendering, and Framer Motion animation triggers.

---
**Status:** All 3 core engine tests are passing (Verified 2026-05-13).
