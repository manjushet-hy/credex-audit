'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Check,
  Building2,
  Users,
  Settings2,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ALL_VENDORS } from '@/constants/plans';
import { UseCase, TargetAudience } from '@/types/pricing';
import { AuditRequest, UserCurrentTool } from '@/lib/audit-engine/types';

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [teamSize, setTeamSize] = useState<number>(10);
  const [primaryUseCase, setPrimaryUseCase] = useState<UseCase>('mixed');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('team');
  const [optimizationStrategy, setOptimizationStrategy] = useState<'cost' | 'security' | 'balanced'>('balanced');
  const [currentTools, setCurrentTools] = useState<UserCurrentTool[]>([]);

  // LocalStorage Persistence
  useEffect(() => {
    const saved = localStorage.getItem('credex_audit_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeamSize(parsed.teamSize || 10);
        setPrimaryUseCase(parsed.primaryUseCase || 'mixed');
        setTargetAudience(parsed.targetAudience || 'team');
        setOptimizationStrategy(parsed.optimizationStrategy || 'balanced');
        setCurrentTools(parsed.currentTools || []);
      } catch (e) {
        console.error("Failed to parse saved audit draft", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('credex_audit_draft', JSON.stringify({
      teamSize,
      primaryUseCase,
      targetAudience,
      optimizationStrategy,
      currentTools
    }));
  }, [teamSize, primaryUseCase, targetAudience, optimizationStrategy, currentTools]);

  const addTool = (vendorId: string) => {
    const vendor = ALL_VENDORS.find(v => v.vendorId === vendorId);
    if (!vendor) return;
    
    const newTool: UserCurrentTool = {
      toolInstanceId: `${vendorId}-${Date.now()}`,
      vendorId: vendor.vendorId,
      planId: vendor.plans[0].id,
      seats: teamSize
    };
    setCurrentTools([...currentTools, newTool]);
  };

  const removeTool = (id: string) => {
    setCurrentTools(currentTools.filter(t => t.toolInstanceId !== id));
  };

  const updateTool = (id: string, updates: Partial<UserCurrentTool>) => {
    setCurrentTools(currentTools.map(t => 
      t.toolInstanceId === id ? { ...t, ...updates } : t
    ));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Construct the Audit Request
    const auditRequest: AuditRequest = {
      currentTools,
      primaryUseCases: [primaryUseCase],
      targetAudience,
      requiredSecurity: {
        needsPrivacyMode: targetAudience === 'enterprise',
        needsSSO: targetAudience === 'enterprise',
        needsAuditLogs: targetAudience === 'enterprise'
      },
      optimizationStrategy
    };

    // Save to localStorage for the results page to pick up (since we don't have a backend yet)
    const auditId = `audit-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(`audit_request_${auditId}`, JSON.stringify(auditRequest));
    
    // Simulate engine processing
    setTimeout(() => {
      router.push(`/audit/${auditId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10 overflow-x-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-black font-black text-[10px]">C</div>
          <span className="font-semibold tracking-tight text-sm">Credex Intelligence</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <a href="#" className="hover:text-white transition-colors">Platform</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-24 min-h-screen flex flex-col items-center">
        
        {/* Step Progress */}
        <div className="flex items-center gap-4 mb-16 opacity-50">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                step === s ? 'bg-white text-black border-white' : 
                step > s ? 'bg-white/20 border-white/20 text-white' : 'border-white/10 text-white/40'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className="w-12 h-[1px] bg-white/10" />}
            </React.Fragment>
          ))}
        </div>

        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Context */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-none">Your Team Context</h1>
                  <p className="text-white/40 text-lg">Define your organizational profile to tailor the heuristics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-2">Current Team Size</label>
                    <div className="relative group">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                      <input 
                        type="number" 
                        value={teamSize}
                        onChange={(e) => setTeamSize(parseInt(e.target.value) || 0)}
                        className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-white/20 focus:outline-none transition-all font-medium"
                        placeholder="Number of seats..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-2">Primary Use Case</label>
                    <div className="relative group">
                      <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                      <select 
                        value={primaryUseCase}
                        onChange={(e) => setPrimaryUseCase(e.target.value as UseCase)}
                        className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-white/20 focus:outline-none transition-all font-medium appearance-none"
                      >
                        <option value="coding">Software Engineering</option>
                        <option value="writing">Content & Copywriting</option>
                        <option value="data">Data Analysis & BI</option>
                        <option value="research">Scientific Research</option>
                        <option value="mixed">Mixed Enterprise Use</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-2 text-center block">Optimization Priority</label>
                  <div className="flex p-1 bg-neutral-900/50 rounded-2xl border border-white/5">
                    {(['cost', 'balanced', 'security'] as const).map((s) => (
                      <button 
                        key={s}
                        onClick={() => setOptimizationStrategy(s)}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                          optimizationStrategy === s ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  Configure Tools
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Tool Selection */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-none">Select Your Stack</h1>
                  <p className="text-white/40 text-lg">Which AI tools are currently in your organizational inventory?</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ALL_VENDORS.map((v) => {
                    const isSelected = currentTools.some(t => t.vendorId === v.vendorId);
                    return (
                      <button 
                        key={v.vendorId}
                        onClick={() => isSelected ? setCurrentTools(currentTools.filter(t => t.vendorId !== v.vendorId)) : addTool(v.vendorId)}
                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 text-center group ${
                          isSelected ? 'bg-white/10 border-white/20' : 'bg-neutral-900/30 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${
                          isSelected ? 'bg-white text-black scale-110' : 'bg-white/5 text-white/40 group-hover:scale-110'
                        }`}>
                          {v.vendorName[0]}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white' : 'text-white/40'}`}>
                          {v.vendorName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-5 bg-neutral-900 text-white font-bold rounded-2xl border border-white/5 hover:bg-neutral-800 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={currentTools.length === 0}
                    className="flex-[2] py-5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Set Plans & Spend
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Tool Details */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-none">Configure Spend</h1>
                  <p className="text-white/40 text-lg">Tell us the exact plans and seats for each tool.</p>
                </div>

                <div className="space-y-4">
                  {currentTools.map((tool) => {
                    const vendor = ALL_VENDORS.find(v => v.vendorId === tool.vendorId);
                    if (!vendor) return null;
                    return (
                      <div key={tool.toolInstanceId} className="bg-neutral-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs font-black">
                              {vendor.vendorName[0]}
                            </div>
                            <span className="font-bold text-sm">{vendor.vendorName}</span>
                          </div>
                          <button onClick={() => removeTool(tool.toolInstanceId)} className="text-white/20 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-2">Current Plan</label>
                            <select 
                              value={tool.planId}
                              onChange={(e) => updateTool(tool.toolInstanceId, { planId: e.target.value })}
                              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-white/20 transition-all appearance-none"
                            >
                              {vendor.plans.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-2">Seat Count</label>
                            <input 
                              type="number" 
                              value={tool.seats}
                              onChange={(e) => updateTool(tool.toolInstanceId, { seats: parseInt(e.target.value) || 0 })}
                              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-white/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 py-5 bg-neutral-900 text-white font-bold rounded-2xl border border-white/5 hover:bg-neutral-800 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] py-5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Running Audit Engine...
                      </>
                    ) : (
                      <>
                        Run Enterprise Audit
                        <Zap className="w-5 h-5 fill-current" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
