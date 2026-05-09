import { AuditRequest, AuditRecommendation, AuditReport, UserCurrentTool, RecommendationExplanation } from './types';
import { ALL_VENDORS } from '../../constants/plans';

const ENGINE_VERSION = 'v2.0.0-enterprise';

// Dynamic Scoring Matrix to support Org Policies
const getScoringWeights = (strategy: string) => {
  const weights = {
    USE_CASE_MATCH: 10,
    PRIMARY_USE_CASE_MULTIPLIER: 200,
    PRIVACY_MODE: 20,
    COST_PENALTY: 1,
  };

  if (strategy === 'cost') {
    weights.COST_PENALTY = 5;      // Penalize expensive tools heavily
    weights.PRIVACY_MODE = 10;     // Care slightly less about security features
  } else if (strategy === 'security') {
    weights.COST_PENALTY = 0.5;    // Forgive high costs
    weights.PRIVACY_MODE = 50;     // Massively reward secure tools
  }

  return weights;
};

const getPlanDetails = (vendorId: string, planId: string) => {
  const vendor = ALL_VENDORS.find(v => v.vendorId === vendorId);
  const plan = vendor?.plans.find(p => p.id === planId);
  return { vendor, plan };
};

const getComparablePrice = (price?: number) => price ?? Number.MAX_SAFE_INTEGER;

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateRecommendationExplanation = (
  category: string, 
  vendorName: string, 
  targetPlanName?: string, 
  useCase?: string
): RecommendationExplanation => {
  switch (category) {
    case 'cost':
      return {
        summary: `Downgrade ${vendorName} to the '${targetPlanName}' plan to optimize costs.`,
        technicalReason: `The '${targetPlanName}' plan fully preserves your required capabilities and security standards for your target audience.`,
        businessReason: `Potential overspending detected on your current tier. Downgrading immediately improves ROI.`
      };
    case 'security':
      return {
        summary: `Upgrade ${vendorName} to the '${targetPlanName}' plan to satisfy security policies.`,
        technicalReason: `Your organization requires advanced security controls (e.g., SSO, Privacy Mode) which are absent in your current tier.`,
        businessReason: `Critical compliance gap detected. Resolving this mitigates enterprise data risk.`
      };
    case 'consolidation':
      return {
        summary: `Cancel ${vendorName} to reduce redundant tool subscriptions.`,
        technicalReason: `Workflow overlap detected for the '${useCase}' use case. Another active tool scores higher in our capability matrix.`,
        businessReason: `Consolidating operations eliminates duplicate licensing costs and reduces context-switching.`
      };
    default:
      return { summary: 'Optimization opportunity identified.' };
  }
};

const calculatePriorityScore = (category: string, monthlyDelta: number, confidence: string): number => {
  let score = 0;
  if (category === 'security') score += 1000; 
  if (category === 'consolidation') score += 500;
  if (category === 'cost') score += 250;

  if (monthlyDelta > 0) score += monthlyDelta;
  if (confidence === 'high') score += 100;
  if (confidence === 'medium') score += 50;

  return score;
};

const selectBestPrimaryTool = (tools: UserCurrentTool[], request: AuditRequest): UserCurrentTool => {
  const weights = getScoringWeights(request.optimizationStrategy);

  return tools.reduce((best, current) => {
    const { vendor: bestVendor, plan: bestPlan } = getPlanDetails(best.vendorId, best.planId);
    const { vendor: currentVendor, plan: currentPlan } = getPlanDetails(current.vendorId, current.planId);
    
    if (!bestVendor || !bestPlan) return current;
    if (!currentVendor || !currentPlan) return best;

    let bestScore = 0;
    let currentScore = 0;

    bestScore += bestVendor.supportedUseCases.length * weights.USE_CASE_MATCH;
    currentScore += currentVendor.supportedUseCases.length * weights.USE_CASE_MATCH;

    const bestHasPrimary = bestVendor.supportedUseCases.some(uc => request.primaryUseCases.includes(uc));
    const currentHasPrimary = currentVendor.supportedUseCases.some(uc => request.primaryUseCases.includes(uc));
    if (bestHasPrimary) bestScore += weights.PRIMARY_USE_CASE_MULTIPLIER;
    if (currentHasPrimary) currentScore += weights.PRIMARY_USE_CASE_MULTIPLIER;

    bestScore -= getComparablePrice(bestPlan.pricePerUser) * weights.COST_PENALTY;
    currentScore -= getComparablePrice(currentPlan.pricePerUser) * weights.COST_PENALTY;

    if (bestPlan.securityFlags.hasPrivacyMode) bestScore += weights.PRIVACY_MODE;
    if (currentPlan.securityFlags.hasPrivacyMode) currentScore += weights.PRIVACY_MODE;

    bestScore += best.seats * 5;
    currentScore += current.seats * 5;

    return currentScore > bestScore ? current : best;
  });
};

export const runRightSizing = (request: AuditRequest): AuditRecommendation[] => {
  const recommendations: AuditRecommendation[] = [];

  request.currentTools.forEach(tool => {
    const { vendor, plan } = getPlanDetails(tool.vendorId, tool.planId);
    if (!vendor || !plan) return;

    const cheaperPlans = vendor.plans.filter(p => {
      if (p.pricePerUser === undefined || plan.pricePerUser === undefined) return false;
      if (p.pricePerUser >= plan.pricePerUser) return false;
      if (p.id === plan.id) return false; 
      if (p.pricingModel !== 'per_seat') return false;
      if (p.targetAudience !== request.targetAudience && p.targetAudience !== 'individual') return false;
      
      if (request.requiredSecurity.needsPrivacyMode && !p.securityFlags.hasPrivacyMode) return false;
      if (request.requiredSecurity.needsSSO && !p.securityFlags.hasSSO) return false;
      if (request.requiredSecurity.needsAuditLogs && !p.securityFlags.hasAuditLogs) return false;

      return true;
    });

    if (cheaperPlans.length > 0) {
      cheaperPlans.sort((a, b) => getComparablePrice(a.pricePerUser) - getComparablePrice(b.pricePerUser));
      const optimalPlan = cheaperPlans[0];

      const currentMonthlyCost = (plan.pricePerUser || 0) * tool.seats;
      const newMonthlyCost = (optimalPlan.pricePerUser || 0) * tool.seats;
      const monthlyDelta = currentMonthlyCost - newMonthlyCost;

      recommendations.push({
        id: generateUUID(),
        createdAt: new Date().toISOString(),
        recommendationCategory: 'cost',
        recommendationType: 'downgrade',
        confidence: 'high',
        severity: 'warning',
        impactArea: 'cost',
        riskLevel: 'low', 
        triggeredBy: ['audience_mismatch', 'cheaper_tier_available', 'capabilities_validated'],
        blockedBy: [],
        dependsOn: [],
        targetToolInstanceId: tool.toolInstanceId, // NEW: Targeting exact instance
        targetVendorId: tool.vendorId,
        targetPlanId: optimalPlan.id,
        monthlyDelta,
        annualDelta: monthlyDelta * 12,
        priorityScore: calculatePriorityScore('cost', monthlyDelta, 'high'),
        title: `Right-Size: ${vendor.vendorName}`,
        explanation: generateRecommendationExplanation('cost', vendor.vendorName, optimalPlan.name)
      });
    }
  });

  return recommendations;
};

export const runSecurityAudit = (request: AuditRequest): AuditRecommendation[] => {
  const recommendations: AuditRecommendation[] = [];

  request.currentTools.forEach(tool => {
    const { vendor, plan } = getPlanDetails(tool.vendorId, tool.planId);
    if (!vendor || !plan) return;

    const needsPrivacy = request.requiredSecurity.needsPrivacyMode && !plan.securityFlags.hasPrivacyMode;
    const needsSSO = request.requiredSecurity.needsSSO && !plan.securityFlags.hasSSO;
    const needsLogs = request.requiredSecurity.needsAuditLogs && !plan.securityFlags.hasAuditLogs;

    if (needsPrivacy || needsSSO || needsLogs) {
      const securePlans = vendor.plans.filter(p => 
        p.id !== plan.id &&
        (!request.requiredSecurity.needsPrivacyMode || p.securityFlags.hasPrivacyMode) &&
        (!request.requiredSecurity.needsSSO || p.securityFlags.hasSSO) &&
        (!request.requiredSecurity.needsAuditLogs || p.securityFlags.hasAuditLogs)
      );

      if (securePlans.length > 0) {
        securePlans.sort((a, b) => getComparablePrice(a.pricePerUser) - getComparablePrice(b.pricePerUser));
        const securePlan = securePlans[0];

        const currentMonthlyCost = (plan.pricePerUser || 0) * tool.seats;
        const newMonthlyCost = securePlan.pricePerUser !== undefined ? (securePlan.pricePerUser * tool.seats) : currentMonthlyCost * 3; 
        const monthlyDelta = currentMonthlyCost - newMonthlyCost; 
        
        const triggers = [];
        if (needsPrivacy) triggers.push('missing_privacy_mode');
        if (needsSSO) triggers.push('missing_sso');
        if (needsLogs) triggers.push('missing_audit_logs');

        recommendations.push({
          id: generateUUID(),
          createdAt: new Date().toISOString(),
          recommendationCategory: 'security',
          recommendationType: 'upgrade',
          confidence: 'high',
          severity: 'critical',
          impactArea: 'security',
          riskLevel: 'low', 
          triggeredBy: triggers,
          blockedBy: [],
          dependsOn: [],
          targetToolInstanceId: tool.toolInstanceId, // NEW: Targeting exact instance
          targetVendorId: tool.vendorId,
          targetPlanId: securePlan.id,
          monthlyDelta,
          annualDelta: monthlyDelta * 12,
          priorityScore: calculatePriorityScore('security', monthlyDelta, 'high'),
          title: `Compliance Risk: ${vendor.vendorName}`,
          explanation: generateRecommendationExplanation('security', vendor.vendorName, securePlan.name)
        });
      }
    }
  });

  return recommendations;
};

export const runConsolidationAudit = (request: AuditRequest): AuditRecommendation[] => {
  const recommendations: AuditRecommendation[] = [];
  const toolsByUseCase: Record<string, UserCurrentTool[]> = {};

  // Group by use case
  request.currentTools.forEach(tool => {
    const { vendor } = getPlanDetails(tool.vendorId, tool.planId);
    if (!vendor) return;
    
    vendor.supportedUseCases.forEach(useCase => {
      if (!toolsByUseCase[useCase]) toolsByUseCase[useCase] = [];
      toolsByUseCase[useCase].push(tool);
    });
  });

  Object.entries(toolsByUseCase).forEach(([useCase, tools]) => {
    if (tools.length > 1) {
      const primaryTool = selectBestPrimaryTool(tools, request);
      // Filter strictly by toolInstanceId
      const redundantTools = tools.filter(t => t.toolInstanceId !== primaryTool.toolInstanceId);

      redundantTools.forEach(redundant => {
        const { vendor: redundantVendor, plan: redundantPlan } = getPlanDetails(redundant.vendorId, redundant.planId);
        if (!redundantVendor || !redundantPlan) return;

        const monthlyDelta = (redundantPlan.pricePerUser || 0) * redundant.seats;

        recommendations.push({
          id: generateUUID(),
          createdAt: new Date().toISOString(),
          recommendationCategory: 'consolidation',
          recommendationType: 'cancel',
          confidence: 'medium',
          severity: 'info',
          impactArea: 'productivity',
          riskLevel: 'medium', 
          triggeredBy: ['tool_overlap', `redundant_use_case_${useCase}`, 'scored_lower_than_primary'],
          blockedBy: [],
          dependsOn: [],
          targetToolInstanceId: redundant.toolInstanceId, // NEW: Targets exact instance
          targetVendorId: redundant.vendorId,
          targetPlanId: redundant.planId,
          monthlyDelta,
          annualDelta: monthlyDelta * 12,
          priorityScore: calculatePriorityScore('consolidation', monthlyDelta, 'medium'),
          title: `Consolidation: ${redundantVendor.vendorName}`,
          explanation: generateRecommendationExplanation('consolidation', redundantVendor.vendorName, undefined, useCase)
        });
      });
    }
  });

  // Unique key via instanceId to prevent double cancellations
  const uniqueConsolidations = Array.from(new Map(recommendations.map(r => [r.targetToolInstanceId, r])).values());
  return uniqueConsolidations;
};

export const generateAuditReport = (request: AuditRequest): AuditReport => {
  const rightSizingRecs = runRightSizing(request);
  const securityRecs = runSecurityAudit(request);
  const consolidationRecs = runConsolidationAudit(request);

  // Dependency Graph Wiring
  securityRecs.forEach(sec => {
    // If a tool is being cancelled, you shouldn't upgrade it
    const overlappingConsolidations = consolidationRecs.filter(c => c.targetToolInstanceId === sec.targetToolInstanceId);
    sec.blockedBy = overlappingConsolidations.map(c => c.id);
  });

  rightSizingRecs.forEach(rs => {
    // If a tool is being cancelled, you shouldn't right-size it
    const overlappingConsolidations = consolidationRecs.filter(c => c.targetToolInstanceId === rs.targetToolInstanceId);
    rs.blockedBy = overlappingConsolidations.map(c => c.id);
  });
  
  consolidationRecs.forEach(c => {
    // If we cancel a tool, we "depend on" the security and right-sizing optimizations 
    // of the PRIMARY tool being completed first. (Complex graph mock)
    // Not explicitly wired for MVP, but array is ready for UI consumption.
  });

  let allRecommendations = [...consolidationRecs, ...securityRecs, ...rightSizingRecs];
  allRecommendations.sort((a, b) => b.priorityScore - a.priorityScore);

  const appliedDeltas = new Map<string, number>();
  
  allRecommendations.forEach(rec => {
    if (!rec.blockedBy || rec.blockedBy.length === 0) {
      // Delta applied purely based on the specific tool instance!
      const key = `${rec.targetToolInstanceId}`; 
      if (!appliedDeltas.has(key)) {
        appliedDeltas.set(key, rec.monthlyDelta);
      }
    }
  });

  const totalMonthlyDelta = Array.from(appliedDeltas.values()).reduce((sum, delta) => sum + delta, 0);

  const currentMonthlySpend = request.currentTools.reduce((acc, tool) => {
    const { plan } = getPlanDetails(tool.vendorId, tool.planId);
    return acc + ((plan?.pricePerUser || 0) * tool.seats);
  }, 0);

  const isHealthyStack = allRecommendations.length === 0;

  return {
    engineVersion: ENGINE_VERSION,
    createdAt: new Date().toISOString(),
    isHealthyStack,
    currentMonthlySpend,
    projectedMonthlySpend: currentMonthlySpend - totalMonthlyDelta,
    totalMonthlyDelta,
    totalAnnualDelta: totalMonthlyDelta * 12,
    recommendations: allRecommendations
  };
};
