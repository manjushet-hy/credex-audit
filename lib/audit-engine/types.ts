import { VendorPricing, PricingPlan, UseCase, TargetAudience, SecurityFlags } from '../../types/pricing';

export interface UserCurrentTool {
  toolInstanceId: string; // Uniquely identifies this exact subscription (e.g., 'eng-chatgpt-1')
  vendorId: string;
  planId: string;
  seats: number;
}

export interface AuditRequest {
  currentTools: UserCurrentTool[];
  primaryUseCases: UseCase[];
  targetAudience: TargetAudience;
  requiredSecurity: {
    needsPrivacyMode: boolean;
    needsSSO: boolean;
    needsAuditLogs: boolean;
  };
  optimizationStrategy: 'cost' | 'security' | 'balanced'; // NEW: Org Policy Strategy
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type SeverityLevel = 'info' | 'warning' | 'critical';
export type ImpactArea = 'cost' | 'security' | 'productivity' | 'governance';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface RecommendationExplanation {
  summary: string;
  technicalReason?: string;
  businessReason?: string;
}

export interface AuditRecommendation {
  id: string; 
  createdAt: string; 
  
  recommendationCategory: 'cost' | 'security' | 'consolidation';
  recommendationType: 'upgrade' | 'downgrade' | 'cancel' | 'switch';
  
  confidence: ConfidenceLevel;
  severity: SeverityLevel;
  impactArea: ImpactArea;
  riskLevel: RiskLevel; 
  
  triggeredBy: string[];
  blockedBy?: string[]; // IDs of other recommendations that conceptually override this one
  dependsOn?: string[]; // IDs of recommendations that must be executed first
  
  targetToolInstanceId: string; // The exact subscription this recommendation targets
  targetVendorId: string;
  targetPlanId?: string;
  
  monthlyDelta: number;
  annualDelta: number;
  priorityScore: number;
  
  title: string;
  explanation: RecommendationExplanation; // Structured explanation for UI expandable cards
}

export interface AuditReport {
  engineVersion: string;
  createdAt: string; 
  isHealthyStack: boolean;
  
  currentMonthlySpend: number;
  projectedMonthlySpend: number;
  totalMonthlyDelta: number;
  totalAnnualDelta: number;
  
  recommendations: AuditRecommendation[];
}
