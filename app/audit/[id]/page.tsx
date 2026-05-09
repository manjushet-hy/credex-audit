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
  Command,
  LayoutDashboard,
  Search,
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
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OVERSPEND_REPORT_MOCK, SECURITY_RISK_REPORT_MOCK, HEALTHY_REPORT_MOCK } from '@/lib/mocks/auditReports';
import { AuditReport, AuditRecommendation } from '@/lib/audit-engine/types';

export default function AuditDashboardPage() {
  const [activeReport, setActiveReport] = useState<AuditReport>(OVERSPEND_REPORT_MOCK);
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-white/10 overflow-hidden">
      
      {/* Sidebar - Linear/Stripe Style */}
      <aside className={`w-64 border-r border-white/5 bg-black flex flex-col transition-all duration-300 ${isNavOpen ? 'translate-x-0' : '-translate-x-full w-0'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-black font-black text-xs">
            C
          </div>
          <span className="font-semibold tracking-tight text-sm">Credex / Audit</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active />
          <SidebarItem icon={<Activity className="w-4 h-4" />} label="Live Analysis" />
          <SidebarItem icon={<History className="w-4 h-4" />} label="Audit Logs" />
          <SidebarItem icon={<Layers className="w-4 h-4" />} label="Inventory" badge="14" />
          <SidebarItem icon={<ShieldAlert className="w-4 h-4" />} label="Compliance" />
          
          <div className="pt-8 px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Intelligence</div>
          <SidebarItem icon={<Zap className="w-4 h-4" />} label="Optimization" />
          <SidebarItem icon={<FileText className="w-4 h-4" />} label="Reports" />
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
        {/* Top Header - Vercel Style */}
        <header className="h-14 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-white/40 hover:text-white transition-colors cursor-pointer">Intelligence</span>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className="text-white/40 hover:text-white transition-colors cursor-pointer">Audit Sessions</span>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className="text-white">{activeReport.engineVersion}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex p-0.5 bg-neutral-900 rounded-lg border border-white/5">
              {[
                { id: 'overspend', label: 'Overspend', mock: OVERSPEND_REPORT_MOCK },
                { id: 'security', label: 'Security', mock: SECURITY_RISK_REPORT_MOCK },
                { id: 'healthy', label: 'Healthy', mock: HEALTHY_REPORT_MOCK }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveReport(tab.mock)}
                  className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all ${
                    activeReport === tab.mock ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <button className="p-2 hover:bg-white/5 rounded-md transition-colors relative">
              <Bell className="w-4 h-4 text-white/60" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
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
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Audit Intelligence</h1>
                <p className="text-sm text-white/40 font-medium">Analyzing <span className="text-white">6 high-performance LLM instances</span> across your organization.</p>
              </div>
              <div className="flex items-center gap-4 bg-neutral-900/50 px-4 py-2 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Live Analysis Online</span>
                </div>
                <div className="h-3 w-[1px] bg-white/10" />
                <span className="text-[10px] font-mono text-white/40">ID: AUD-9842-X</span>
              </div>
            </div>

            {/* KPI Grid - Bloomberg/Linear Style */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              <KPICard 
                label="Monthly Burn" 
                value={`$${activeReport.currentMonthlySpend.toLocaleString()}`} 
                trend="+2.4%" 
                chartColor="emerald"
                subtitle="Baseline from current inventory"
              />
              <KPICard 
                label="Optimized Burn" 
                value={`$${activeReport.projectedMonthlySpend.toLocaleString()}`} 
                trend="-14.2%" 
                chartColor="blue"
                active
                subtitle="Projected after tactical shifts"
              />
              <KPICard 
                label="Financial Delta" 
                value={`$${activeReport.totalMonthlyDelta.toLocaleString()}`} 
                trend={activeReport.totalMonthlyDelta >= 0 ? "Potential" : "Required"} 
                chartColor={activeReport.totalMonthlyDelta >= 0 ? "emerald" : "rose"}
                subtitle="Total Monthly P&L impact"
              />
              <KPICard 
                label="Annual Trajectory" 
                value={`$${activeReport.totalAnnualDelta.toLocaleString()}`} 
                trend="Projected" 
                chartColor="violet"
                subtitle="Total 12-month savings forecast"
              />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              {/* Main Feed */}
              <div className="xl:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight flex items-center gap-3 text-white">
                    <BarChart2 className="w-4 h-4 text-blue-500" />
                    Tactical Recommendations
                  </h2>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-1">
                    View All <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-4">
                  {activeReport.recommendations.length > 0 ? (
                    activeReport.recommendations.map((rec) => (
                      <RecommendationEntry key={rec.id} rec={rec} />
                    ))
                  ) : (
                    <div className="border border-white/5 bg-neutral-900/20 rounded-2xl p-12 text-center">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Your stack is fully optimized</h3>
                      <p className="text-sm text-white/40 max-w-xs mx-auto">Our intelligence engine has verified all subscriptions against current usage and security policies.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Insights */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-sm font-semibold tracking-tight text-white/40 uppercase tracking-widest">Global Insights</h2>
                </div>
                
                <div className="glass-card p-6 rounded-2xl border-white/5 space-y-6">
                  <InsightItem 
                    icon={<Globe className="w-4 h-4 text-blue-400" />}
                    title="Vendor Consolidation"
                    desc="High overlap detected between OpenAI and Anthropic instances."
                    status="High Impact"
                  />
                  <InsightItem 
                    icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    title="Security Posture"
                    desc="Zero-trust guarantees verified on all Enterprise tier plans."
                    status="Secure"
                  />
                  <InsightItem 
                    icon={<Activity className="w-4 h-4 text-amber-400" />}
                    title="Usage Saturation"
                    desc="Current seat utilization is at 84.2% across your engineering team."
                    status="Balanced"
                  />
                </div>

                <div className="bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group cursor-pointer">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full transition-transform group-hover:scale-150" />
                  <h4 className="text-sm font-semibold text-white mb-2">Strategic Forecast</h4>
                  <p className="text-[11px] text-white/50 leading-relaxed mb-4">
                    Applying all recommendations will reduce your annual SaaS Opex by 18.5% while increasing compliance by 40%.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                    Apply All Changes <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tactile Table Section */}
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold tracking-tight text-white">Full Inventory Breakdown</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-neutral-900 border border-white/5 rounded-md text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">Export CSV</button>
                  <button className="px-3 py-1.5 bg-neutral-900 border border-white/5 rounded-md text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors flex items-center gap-1">Filter <ChevronDown className="w-3 h-3" /></button>
                </div>
              </div>
              
              <div className="border border-white/5 rounded-xl overflow-hidden bg-neutral-950/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-900/50 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                      <th className="px-6 py-4 font-bold">Tool Instance</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Burn Rate</th>
                      <th className="px-6 py-4 font-bold text-right">Potential Delta</th>
                      <th className="px-6 py-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <InventoryRow name="Corp ChatGPT" status="Active" cost="$2,400" delta="-$800" severity="warning" />
                    <InventoryRow name="Eng Cursor" status="Warning" cost="$1,200" delta="+$350" severity="critical" />
                    <InventoryRow name="Shadow Claude" status="Inactive" cost="$600" delta="-$600" severity="info" />
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, badge }: any) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer group ${active ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-white' : 'text-white/40 group-hover:text-white'} transition-colors`}>{icon}</span>
        <span className="text-xs font-medium tracking-tight">{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 font-bold">{badge}</span>
      )}
    </div>
  );
}

function KPICard({ label, value, trend, chartColor, active, subtitle }: any) {
  const colors: any = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
    violet: 'text-violet-500 bg-violet-500/10'
  };

  return (
    <div className={`glass-card p-6 rounded-2xl relative overflow-hidden group ${active ? 'border-white/20' : 'border-white/5'}`}>
      {active && <div className="absolute top-0 right-0 p-3"><Zap className="w-3 h-3 text-blue-500" /></div>}
      
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${colors[chartColor]}`}>
            {trend}
          </span>
        </div>
        
        <div>
          <span className="text-3xl font-semibold tracking-tight text-white">{value}</span>
          <p className="text-[10px] text-white/30 font-medium mt-1 uppercase tracking-wider">{subtitle}</p>
        </div>

        {/* Mini Sparkline Chart Placeholder - Palantir Style */}
        <div className="h-6 flex items-end gap-1 pt-2 opacity-50 group-hover:opacity-100 transition-opacity">
          {[40, 70, 45, 90, 65, 80, 50, 75, 60, 85].map((h, i) => (
            <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${colors[chartColor].split(' ')[1]}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
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
                <button className="px-4 py-2 bg-neutral-900 border border-white/5 rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors">Dismiss Intelligence</button>
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

function InventoryRow({ name, status, cost, delta, severity }: any) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-blue-500 transition-colors" />
          <span className="text-xs font-medium text-white">{name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
          status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
        }`}>{status}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-xs font-mono font-medium text-white/60">{cost}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`text-xs font-mono font-bold ${delta.includes('+') ? 'text-rose-500' : 'text-emerald-500'}`}>{delta}</span>
      </td>
      <td className="px-6 py-4">
        <button className="p-1 hover:bg-white/10 rounded-md transition-colors">
          <ChevronRight className="w-4 h-4 text-white/20" />
        </button>
      </td>
    </tr>
  );
}

function SidebarItemIcon({ icon }: any) { return icon; }
function Settings({ className }: any) { return <Command className={className} />; }
