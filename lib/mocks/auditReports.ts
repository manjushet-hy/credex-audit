import { AuditReport } from '../audit-engine/types';

export const HEALTHY_REPORT_MOCK: AuditReport = {
  engineVersion: 'v2.0.0-enterprise',
  createdAt: new Date().toISOString(),
  isHealthyStack: true,
  currentMonthlySpend: 1250,
  projectedMonthlySpend: 1250,
  totalMonthlyDelta: 0,
  totalAnnualDelta: 0,
  recommendations: []
};

export const OVERSPEND_REPORT_MOCK: AuditReport = {
  engineVersion: 'v2.0.0-enterprise',
  createdAt: new Date().toISOString(),
  isHealthyStack: false,
  currentMonthlySpend: 4200,
  projectedMonthlySpend: 2800,
  totalMonthlyDelta: 1400,
  totalAnnualDelta: 16800,
  recommendations: [
    {
      id: 'rec-1',
      createdAt: new Date().toISOString(),
      recommendationCategory: 'cost',
      recommendationType: 'downgrade',
      confidence: 'high',
      severity: 'warning',
      impactArea: 'cost',
      riskLevel: 'low',
      triggeredBy: ['audience_mismatch'],
      targetVendorId: 'chatgpt',
      targetPlanId: 'chatgpt-team',
      targetToolInstanceId: 'corp-chatgpt',
      monthlyDelta: 800,
      annualDelta: 9600,
      priorityScore: 850,
      title: 'Right-Size: ChatGPT Enterprise',
      explanation: {
        summary: "Downgrade ChatGPT Enterprise to Team tier.",
        technicalReason: "Your current utilization does not require SCIM or dedicated nodes provided by the Enterprise tier.",
        businessReason: "Switching to the Team plan preserves all collaborative features while reducing per-seat cost by 60%."
      }
    },
    {
      id: 'rec-2',
      createdAt: new Date().toISOString(),
      recommendationCategory: 'cost',
      recommendationType: 'cancel',
      confidence: 'medium',
      severity: 'info',
      impactArea: 'cost',
      riskLevel: 'medium',
      triggeredBy: ['tool_overlap'],
      targetVendorId: 'claude',
      targetPlanId: 'claude-pro',
      targetToolInstanceId: 'shadow-claude',
      monthlyDelta: 600,
      annualDelta: 7200,
      priorityScore: 600,
      title: 'Consolidate: Redundant Claude Pro',
      explanation: {
        summary: "Cancel individual Claude Pro subscriptions.",
        technicalReason: "These individual seats overlap 100% with your corporate ChatGPT Team coding use cases.",
        businessReason: "Consolidating to a single LLM provider reduces billing complexity and 'Shadow IT' sprawl."
      }
    }
  ]
};

export const SECURITY_RISK_REPORT_MOCK: AuditReport = {
  engineVersion: 'v2.0.0-enterprise',
  createdAt: new Date().toISOString(),
  isHealthyStack: false,
  currentMonthlySpend: 1500,
  projectedMonthlySpend: 1850, // Cost increases for security
  totalMonthlyDelta: -350,
  totalAnnualDelta: -4200,
  recommendations: [
    {
      id: 'sec-1',
      createdAt: new Date().toISOString(),
      recommendationCategory: 'security',
      recommendationType: 'upgrade',
      confidence: 'high',
      severity: 'critical',
      impactArea: 'security',
      riskLevel: 'low',
      triggeredBy: ['missing_sso', 'missing_privacy_mode'],
      targetVendorId: 'cursor',
      targetPlanId: 'cursor-business',
      targetToolInstanceId: 'eng-cursor',
      monthlyDelta: -350,
      annualDelta: -4200,
      priorityScore: 1200,
      title: 'Compliance Risk: Cursor IDE',
      explanation: {
        summary: "Upgrade Cursor to Business tier for SSO and Privacy.",
        technicalReason: "The current Hobby/Pro tier lacks SAML SSO and Zero Data Retention guarantees required by your org policy.",
        businessReason: "Ensures developer code remains private and prevents unauthorized access via centralized identity management."
      }
    }
  ]
};
