/// <reference types="node" />
import { generateAuditReport } from '../lib/audit-engine';
import { AuditRequest } from '../lib/audit-engine/types';
import assert from 'node:assert';

console.log('Running Audit Engine v2.0.0 Tests...\n');

const baseRequest: AuditRequest = {
    optimizationStrategy: 'balanced',
    targetAudience: 'enterprise',
    primaryUseCases: ['coding'],
    requiredSecurity: {
        needsPrivacyMode: true,
        needsSSO: true,
        needsAuditLogs: false,
    },
    currentTools: []
};

try {
    // TEST 1: Healthy Stack
    const report1 = generateAuditReport(baseRequest);
    assert.strictEqual(report1.isHealthyStack, true, 'Stack should be healthy');
    assert.strictEqual(report1.recommendations.length, 0, 'Should have 0 recommendations');
    assert.strictEqual(report1.totalMonthlyDelta, 0, 'Delta should be 0');
    console.log('✅ TEST 1 PASSED: Healthy Stack returns 0 recommendations');

    // TEST 2: Security Upgrade
    const request2: AuditRequest = {
        ...baseRequest,
        currentTools: [
            {
                toolInstanceId: 'shadow-windsurf',
                vendorId: 'windsurf',
                planId: 'windsurf-free',
                seats: 5,
            }
        ]
    };
    const report2 = generateAuditReport(request2);
    assert.strictEqual(report2.isHealthyStack, false, 'Stack should not be healthy');
    assert.strictEqual(report2.recommendations.length, 1, 'Should have 1 recommendation');
    const rec2 = report2.recommendations[0];
    assert.strictEqual(rec2.recommendationCategory, 'security', 'Should be a security upgrade');
    assert.strictEqual(rec2.targetToolInstanceId, 'shadow-windsurf', 'Should target the exact instance');
    console.log('✅ TEST 2 PASSED: Security Engine correctly catches missing SSO/Privacy');

    // TEST 3: Complex Graph Resolution
    const request3: AuditRequest = {
        ...baseRequest,
        currentTools: [
            {
                toolInstanceId: 'eng-copilot',
                vendorId: 'copilot',
                planId: 'copilot-business',
                seats: 50,
            },
            {
                toolInstanceId: 'mktg-chatgpt',
                vendorId: 'chatgpt',
                planId: 'chatgpt-plus',
                seats: 10,
            }
        ]
    };
    const report3 = generateAuditReport(request3);
    const consolidationRec = report3.recommendations.find(r => r.recommendationCategory === 'consolidation');
    const securityRec = report3.recommendations.find(r => r.recommendationCategory === 'security');

    if (!consolidationRec || !securityRec) {
        throw new Error('Test 3 Failed: Recommendations not generated correctly');
    }

    assert.strictEqual(consolidationRec.targetToolInstanceId, 'mktg-chatgpt', 'Should target ChatGPT for consolidation');

    // Verify DAG Resolution
    assert.ok(securityRec.blockedBy?.includes(consolidationRec.id), 'Security upgrade MUST be blocked by the consolidation cancellation');
    console.log('✅ TEST 3 PASSED: Directed Graph correctly blocks security upgrades on cancelled tools');

    console.log('\n🎉 ALL ENGINE TESTS PASSED! Architecture is flawless.');
} catch (error) {
    console.error('❌ TEST FAILED:', error);
    process.exit(1); // Ensure CI/CD or scripts detect the failure
}
