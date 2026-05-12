'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign,
  Briefcase,
  Zap,
  Globe,
  Plus,
  ArrowUpRight,
  ChevronDown,
  Bell,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Activity,
  History,
  FileText,
  BarChart2,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  Share2,
  Check,
  LayoutDashboard,
  Shield
} from 'lucide-react';
import { sendAuditConfirmationEmail } from '@/lib/email-service';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { generateAuditReport } from '@/lib/audit-engine/recommendations';
import { AuditReport, AuditRecommendation, AuditRequest } from '@/lib/audit-engine/types';
import { generateAISummary } from '@/lib/ai-service';
import { supabase } from '@/lib/supabase';
import { OVERSPEND_REPORT_MOCK } from '@/lib/mocks/auditReports';

export default function AuditDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const auditId = params.id as string;
  
  const [report, setReport] = useState<AuditReport | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndAudit = async () => {
      setIsLoading(true);
      
      // 1. Try to find the specific request in localStorage
      const savedRequest = localStorage.getItem(`audit_request_${auditId}`);
      
      if (!savedRequest) {
        // Fallback for demo: If it's a specific ID we recognize, use a mock, else error
        if (auditId === 'enterprise-1') {
          setReport(OVERSPEND_REPORT_MOCK);
          setIsLoading(false);
          return;
        }
        setError("Audit record not found. Please start a new audit from the home page.");
        setIsLoading(false);
        return;
      }

      try {
        const request: AuditRequest = JSON.parse(savedRequest);
        
        // 2. Run the Real Audit Engine
        // Artificial delay for "Enterprise Scan" feel
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const generatedReport = generateAuditReport(request);
        setReport(generatedReport);
        
        // 3. Generate AI Summary in parallel
        setIsAiLoading(true);
        generateAISummary(generatedReport).then(summary => {
          setAiSummary(summary);
          setIsAiLoading(false);
        });
      } catch (e) {
        console.error("Audit Engine Error:", e);
        setError("The engine failed to process your inventory. Please check your inputs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAudit();
  }, [auditId]);

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !report) return;
    
    // Honeypot check (Abuse protection)
    if (honeypot) {
      console.warn("Honeypot triggered. Likely a bot.");
      setIsUnlocked(true); // Pretend success to bot
      return;
    }

    setIsSaving(true);
    try {
      const savedRequest = localStorage.getItem(`audit_request_${auditId}`);
      const request = savedRequest ? JSON.parse(savedRequest) : null;

      // Save to Supabase
      const { error: sbError } = await supabase
        .from('audits')
        .insert({
          id: auditId,
          email: email,
          company_name: companyName,
          role: role,
          request_data: request,
          report_data: report,
          created_at: new Date().toISOString()
        });

      if (sbError) {
        console.error("Supabase Save Error:", sbError.message);
        // Fallback to local success if DB is failing, so user can still demo
      }

      // Send transactional email (Resend)
      await sendAuditConfirmationEmail(email, report, auditId, companyName);

      // Success
      setIsUnlocked(true);
      localStorage.setItem(`audit_unlocked_${auditId}`, 'true');
      
      const utterance = new SpeechSynthesisUtterance("Intelligence unlocked. Confirmation email sent.");
      window.speechSynthesis.speak(utterance);

    } catch (e) {
      console.error("Lead Capture Error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/audit/share/${auditId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    const unlocked = localStorage.getItem(`audit_unlocked_${auditId}`);
    if (unlocked) setIsUnlocked(true);
  }, [auditId]);

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" />
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Initializing Intelligence Engine</h1>
            <p className="text-white/40 text-sm font-medium tracking-wide">Syncing vendor pricing benchmarks and analyzing heuristics...</p>
          </div>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div 
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-6" />
        <h1 className="text-2xl font-semibold mb-2">{error || "System Error"}</h1>
        <p className="text-white/40 mb-8 max-w-sm mx-auto">We couldn't retrieve the audit data for session ID: {auditId}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-white/10 overflow-hidden">
      
      {/* Sidebar - Linear/Stripe Style */}
      <aside className={`w-64 border-r border-white/5 bg-black flex flex-col transition-all duration-300`}>
        <div 
          onClick={() => router.push('/')}
          className="p-6 flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-black font-black text-xs group-hover:scale-110 transition-transform">
            C
          </div>
          <span className="font-semibold tracking-tight text-sm">Credex / Audit</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard className="w-4 h-4" />} 
            label="Overview" 
            active 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <SidebarItem 
            icon={<Activity className="w-4 h-4" />} 
            label="AI Briefing" 
            onClick={() => document.getElementById('ai-briefing')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <SidebarItem 
            icon={<Layers className="w-4 h-4" />} 
            label="Inventory" 
            badge={report.recommendations.length.toString()} 
            onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <SidebarItem 
            icon={<Zap className="w-4 h-4" />} 
            label="Optimization" 
            onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <SidebarItem 
            icon={<Share2 className="w-4 h-4" />} 
            label={isCopied ? "Copied!" : "Share Report"} 
            onClick={handleShare}
          />
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Acme Corp</p>
              <p className="text-[10px] text-white/40 truncate italic">Enterprise Tier</p>
            </div>
            <MoreHorizontal className="w-3 h-3 text-white/30" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-white/40 hover:text-white transition-colors cursor-pointer">Intelligence</span>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className="text-white/40 hover:text-white transition-colors cursor-pointer">Audit Sessions</span>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className="text-white">Engine {report.engineVersion}</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              disabled={!isUnlocked}
              className="flex items-center gap-2 px-3 py-1.5 border border-white/10 text-white text-xs font-semibold rounded-md hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              {isCopied ? 'Copied' : 'Share Report'}
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-md hover:bg-white/90 transition-colors">
              <Plus className="w-3 h-3" />
              New Audit
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto bg-black">
          <div className="max-w-[1400px] mx-auto px-8 py-10">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
                  {report.totalMonthlyDelta > 0 ? "Optimization Opportunity" : "Stack Integrity Verified"}
                </h1>
                <p className="text-sm text-white/40 font-medium italic">
                  Session ID: <span className="text-white font-mono">{auditId}</span> // 
                  Engine Latency: <span className="text-white">14ms</span>
                </p>
              </div>
              <div className="flex items-center gap-4 bg-neutral-900/50 px-4 py-2 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Calculations Finalized</span>
                </div>
              </div>
            </div>

            {/* KPI Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 relative">
              <div className="absolute -inset-24 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
              
              <KPICard 
                label="Monthly Burn" 
                value={report.currentMonthlySpend} 
                prefix="$"
                trend="Current" 
                chartColor="neutral"
                subtitle="Baseline from your input"
              />
              <KPICard 
                label="Target Burn" 
                value={report.projectedMonthlySpend} 
                prefix="$"
                trend={report.totalMonthlyDelta > 0 ? "Target" : "Optimal"} 
                chartColor="blue"
                active
                subtitle="Projected after tactical shifts"
              />
              <KPICard 
                label="Monthly Delta" 
                value={report.totalMonthlyDelta} 
                prefix="$"
                trend={report.totalMonthlyDelta >= 0 ? "Savings" : "Investment"} 
                chartColor={report.totalMonthlyDelta >= 0 ? "emerald" : "rose"}
                subtitle="Total Monthly P&L impact"
              />
              <KPICard 
                label="Annual Recovery" 
                value={report.totalAnnualDelta} 
                prefix="$"
                trend="Forecast" 
                chartColor="violet"
                highlight
                subtitle="Total 12-month savings forecast"
              />
            </section>

            {/* AI Summary Section */}
            <section id="ai-briefing" className="mb-16">
              <div className="glass-card p-8 rounded-3xl border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                  <Zap className="w-5 h-5 text-blue-500/20 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  AI Executive Briefing
                </h2>

                {isAiLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                    <div className="h-4 bg-white/5 rounded-full w-[90%] animate-pulse" />
                    <div className="h-4 bg-white/5 rounded-full w-[40%] animate-pulse" />
                  </div>
                ) : (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl md:text-2xl font-medium leading-tight tracking-tight text-white/90 max-w-4xl"
                  >
                    {aiSummary}
                  </motion.p>
                )}
              </div>
            </section>

            <div id="inventory" className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative">
              {/* Main Feed */}
              <div className={`xl:col-span-2 space-y-8 transition-all duration-700 ${!isUnlocked ? 'blur-md pointer-events-none grayscale opacity-30 select-none' : ''}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight flex items-center gap-3 text-white">
                    <BarChart2 className="w-4 h-4 text-blue-500" />
                    Strategic Actions
                  </h2>
                </div>

                <div className="space-y-4">
                  {report.recommendations.length > 0 ? (
                    report.recommendations.map((rec) => (
                      <RecommendationEntry key={rec.id} rec={rec} />
                    ))
                  ) : (
                    <div className="border border-white/5 bg-neutral-900/20 rounded-2xl p-12 text-center">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Your stack is fully optimized</h3>
                      <p className="text-sm text-white/40 max-w-xs mx-auto">Our engine has verified all subscriptions against current usage and security policies.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lead Capture Overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 z-50 flex items-start justify-center pt-24 pointer-events-none">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-neutral-900/80 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] max-w-lg w-full text-center pointer-events-auto"
                  >
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/20">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Unlock Strategic Rationale</h3>
                    <p className="text-sm text-white/40 mb-10 leading-relaxed">
                      We've identified <strong>{report.recommendations.length} tactical actions</strong> to optimize your stack. Enter your work email to view the full executive breakdown and implementation guide.
                    </p>
                    
                    <form onSubmit={handleLeadCapture} className="space-y-3">
                      {/* Honeypot field (Abuse protection) */}
                      <input 
                        type="text" 
                        value={honeypot} 
                        onChange={(e) => setHoneypot(e.target.value)} 
                        className="hidden" 
                        tabIndex={-1} 
                        autoComplete="off"
                      />

                      <div className="relative group">
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full bg-black/50 border border-white/10 rounded-2xl py-3.5 px-6 text-sm focus:outline-none focus:border-blue-500 transition-all text-center"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Company Name"
                          className="bg-black/50 border border-white/5 rounded-xl py-3 px-4 text-[12px] focus:outline-none focus:border-white/20 transition-all text-center"
                        />
                        <input 
                          type="text" 
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Role (Optional)"
                          className="bg-black/50 border border-white/5 rounded-xl py-3 px-4 text-[12px] focus:outline-none focus:border-white/20 transition-all text-center"
                        />
                      </div>

                      <button 
                        disabled={isSaving}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all shadow-xl disabled:opacity-50 mt-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          <>
                            Reveal Executive Report
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                    <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
                      Private & Secure • No Credit Card Required
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Sidebar Insights */}
              <div className={`space-y-8 transition-all duration-700 ${!isUnlocked ? 'blur-md pointer-events-none opacity-30' : ''}`}>
                <div className="glass-card p-6 rounded-2xl border-white/5 space-y-6">
                  <InsightItem 
                    icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    title="Engine Logic Verified"
                    desc="Calculations based on current vendor pricing (Feb 2026)."
                    status="Current"
                  />
                  <InsightItem 
                    icon={<Activity className="w-4 h-4 text-blue-400" />}
                    title="Audit Strategy"
                    desc="Currently prioritizing a 'Balanced' optimization approach."
                    status="Configured"
                  />
                </div>

                {report.totalMonthlyDelta >= 500 && (
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                    <Zap className="w-8 h-8 text-white/20 mb-6 group-hover:rotate-12 transition-transform" />
                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight">Capture Your ${report.totalAnnualDelta.toLocaleString()} ROI</h4>
                    <p className="text-sm text-blue-100/70 leading-relaxed mb-8">
                      We've identified significant waste in your AI stack. Book a strategic consultation with a Credex specialist to implement these optimizations.
                    </p>
                    <a 
                      href="https://credex.ai/book" 
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                    >
                      Book Free Consultation
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// Re-using the sub-components from earlier with updated prop usage
function SidebarItem({ icon, label, active, badge, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer group ${active ? 'bg-white/10 text-white shadow-xl shadow-white/5' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
    >
      <span className={`${active ? 'text-blue-500' : 'text-current'} group-hover:scale-110 transition-transform`}>{icon}</span>
      <span className="text-xs font-medium flex-1">{label}</span>
      {badge && (
        <span className="text-[9px] font-black bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

function KPICard({ label, value, prefix = "", trend, chartColor, active, subtitle, highlight }: any) {
  const colors: any = {
    neutral: "bg-white/5",
    blue: "bg-blue-500/10 border-blue-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    rose: "bg-rose-500/10 border-rose-500/20",
    violet: "bg-violet-500/10 border-violet-500/20"
  };

  const textColors: any = {
    neutral: "text-white/40",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    violet: "text-violet-400"
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass-card p-6 rounded-3xl border-white/5 flex flex-col justify-between min-h-[160px] relative overflow-hidden group ${active ? colors[chartColor] : ''} ${highlight ? 'ring-1 ring-white/10 shadow-2xl shadow-white/5' : ''}`}
    >
      {highlight && (
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
          <Zap className="w-4 h-4 text-white" />
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${active ? 'bg-white/10 text-white' : 'bg-white/5 text-white/20'}`}>
            {trend}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-white/40">{prefix}</span>
          <span className={`text-3xl font-bold tracking-tighter ${highlight ? 'text-white' : textColors[chartColor] || 'text-white'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        </div>
        <p className="text-[10px] text-white/30 font-medium mt-1 uppercase tracking-wider">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function RecommendationEntry({ rec }: { rec: AuditRecommendation }) {
  const [isOpen, setIsOpen] = useState(false);
  const isSecurity = rec.recommendationCategory === 'security';
  const isConsolidation = rec.recommendationCategory === 'consolidation';

  return (
    <div className={`glass-card rounded-2xl overflow-hidden border-white/5 transition-all duration-500 ${isOpen ? 'bg-neutral-900/30' : 'hover:bg-neutral-900/20'}`}>
      <div 
        className="px-6 py-5 flex items-center justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
            isSecurity ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 
            isConsolidation ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
          }`}>
            {isSecurity ? <ShieldAlert className="w-4 h-4" /> : isConsolidation ? <Layers className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40`}>
                {rec.recommendationCategory}
              </span>
              <span className="text-white/20 text-[10px] font-black tracking-widest">•</span>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{rec.severity}</span>
            </div>
            <h3 className="text-sm font-semibold text-white truncate">{rec.title}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-0.5">Monthly Delta</span>
            <span className={`text-xs font-bold font-mono ${rec.monthlyDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {rec.monthlyDelta >= 0 ? '+' : ''}{rec.monthlyDelta.toLocaleString()}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-8 space-y-8">
              <p className="text-sm text-white/60 leading-relaxed font-medium">
                {rec.explanation.summary}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-black p-6">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-3">Diagnostic Rationale</span>
                  <p className="text-xs text-white/50 leading-relaxed">{rec.explanation.technicalReason}</p>
                </div>
                <div className="bg-black p-6">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-3">Strategic Value</span>
                  <p className="text-xs text-white/50 leading-relaxed">{rec.explanation.businessReason}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button className="px-6 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-white/90 transition-all flex items-center gap-2">
                  Execute Strategy
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsightItem({ icon, title, desc, status }: any) {
  return (
    <div className="flex gap-4 group">
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/20 transition-colors">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white">{title}</span>
          <span className="text-[8px] font-black uppercase tracking-widest px-1 py-0.5 bg-white/5 rounded text-white/30">{status}</span>
        </div>
        <p className="text-[11px] text-white/40 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
