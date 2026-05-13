# User Interviews: Validating the Problem

## Interview 1: Ambika, Software Engineer @ Bosch
**Role:** Software Engineer (Large Enterprise Team)
**Context:** Working in a high-security corporate environment with fragmented tool access.

> "At a big company like Bosch, we can't just buy any tool we want. It has to go through strict security audits. Half the time, engineers end up buying individual Pro licenses on their own just to stay productive because the corporate 'Enterprise' version takes months to approve."

**Surprising Moment:** She mentioned that the **Security Gate** is a bigger bottleneck than the **Cost**. Engineers are willing to pay out of their own pockets to use tools like Cursor if the company's official "approved" tools are too slow to get.
**Design Change:** This led me to prioritize the **Security Heuristics** in the audit engine—flagging tools that aren't on Enterprise/SSO plans as a "High Priority" risk for corporate users.

---
*(Note: Remaining interviews pending final verification of conversations.)*
