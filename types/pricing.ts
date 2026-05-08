export type PricingModel = 'per_seat' | 'usage_based' | 'custom';
export type BillingPeriod = 'monthly' | 'annual' | 'usage';
export type TargetAudience = 'individual' | 'team' | 'enterprise';

export type VendorCategory =
  | 'coding_assistant'
  | 'chat'
  | 'api'
  | 'research';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface SecurityFlags {
  hasPrivacyMode: boolean;
  hasSSO: boolean;
  hasAuditLogs: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  pricingModel: PricingModel;
  pricePerUser?: number; // Omitted for enterprise/custom
  billingPeriod: BillingPeriod;
  targetAudience: TargetAudience;
  isCustomPricing: boolean;
  features: string[];
  
  // Smart Heuristics
  recommendedFor?: string[];
  minimumSeats?: number;
  notes?: string; // Captures billing nuances, hidden limits, or pricing ambiguity

  // Crucial for the audit engine's "Security vs Cost" heuristics
  securityFlags: SecurityFlags;
  
  // Useful for identifying feature limits (e.g., Bugbot PR limits)
  usageLimits?: {
    type: string;
    limit: number | 'unlimited';
  };
}

export interface AddOn {
  id: string;
  name: string;
  description?: string;
  plans: PricingPlan[];
}

export interface VendorPricing {
  vendorId: string;
  vendorName: string;
  category: VendorCategory;
  supportedUseCases: UseCase[];
  sourceUrl: string; // Essential for PRICING_DATA.md trace-back
  plans: PricingPlan[];
  addOns?: AddOn[];
}
