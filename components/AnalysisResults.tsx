import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const feasibilityGauge = [
    { name: 'Score', value: result.feasibilityScore },
    { name: 'Remaining', value: 100 - result.feasibilityScore },
  ];
  
  const isLowFeasibility = result.feasibilityScore < 15;
  const scoreColor = result.feasibilityScore >= 80 ? '#10b981' : result.feasibilityScore >= 50 ? '#f59e0b' : '#ef4444';

  const showEligibility = result.eligibility && (
    result.eligibility.preBidAmount || 
    result.eligibility.financialRequirements
  );

  const hasDeadline = result.bidEndDate && result.bidEndDate.trim().length > 0 && result.bidEndDate.toLowerCase() !== 'not found' && result.bidEndDate.toLowerCase() !== 'empty';

  return (
    <div className="animate-fade-in w-full space-y-8">
      
      {/* Top Bar: Company & Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${hasDeadline ? 'md:col-span-2' : 'md:col-span-3'} bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-center transition-all duration-500`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-black tracking-tight shadow-sm">
              {result.companyName}
            </div>
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Identified Portfolio
            </div>
            <div className="flex flex-wrap gap-2">
              {result.identifiedSolutions.slice(0, 3).map((sol, i) => (
                <span key={i} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-100">
                  {sol}
                </span>
              ))}
              {result.identifiedSolutions.length > 3 && <span className="text-[10px] text-slate-400 font-bold ml-1">+{result.identifiedSolutions.length - 3} more</span>}
            </div>
          </div>
          
          {result.marketContext && (
            <div className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 mt-4 pt-4">
               <span className="font-black text-indigo-600 uppercase tracking-tighter text-[10px] mr-2">Market IQ Snapshot</span>
               <p className="inline">{result.marketContext.split('\n')[0]}...</p>
            </div>
          )}
        </div>

        {/* Highlighted Deadline Card - Only shown if deadline exists, matching the image style exactly */}
        {hasDeadline && (
          <div className="bg-[#FFFBF7] border-[3px] border-[#F57C00] rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center transition-all text-center">
             <div className="text-[13px] font-black uppercase tracking-[0.15em] text-[#F57C00] mb-3">
               BID SUBMISSION DEADLINE
             </div>
             <div className="text-3xl font-black text-[#BF360C] leading-tight mb-4">
               {result.bidEndDate}
             </div>
             <div className="flex items-center gap-2 text-[11px] font-black text-[#FB8C00] uppercase tracking-wide">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ACTION REQUIRED IMMEDIATELY
             </div>
          </div>
        )}
      </div>

      {/* Contract Eligibility Section */}
      {showEligibility && (
        <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Eligibility & Commercial Constraints</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {result.eligibility?.preBidAmount && (
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">EMD / Pre-bid Guarantee</div>
                <div className="text-xl font-black text-slate-900">{result.eligibility.preBidAmount}</div>
              </div>
            )}
            {result.eligibility?.financialRequirements && (
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Financial Compliance</div>
                <div className="text-sm font-bold text-slate-700 leading-relaxed">{result.eligibility.financialRequirements}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Priority Roadmap */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            Strategic Execution Priority
          </h3>
          <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm shadow-indigo-100">Action Plan</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {result.priorityFocusPoints.map((point, idx) => (
            <div key={idx} className={`relative p-6 rounded-3xl border bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${point.urgency === 'Critical' ? 'border-rose-200 ring-2 ring-rose-50' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${point.urgency === 'Critical' ? 'bg-rose-500 animate-pulse' : point.urgency === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${point.urgency === 'Critical' ? 'text-rose-600' : point.urgency === 'High' ? 'text-orange-600' : 'text-blue-600'}`}>
                  {point.urgency}
                </span>
              </div>
              <h4 className="font-black text-slate-900 mb-3 leading-tight text-sm">{point.title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis & Platform Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border ${isLowFeasibility ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100'} flex flex-col justify-center`}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-black text-slate-900">Analysis Summary</h2>
            {isLowFeasibility && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-sm shadow-rose-200">FEASIBILITY ALERT</span>
            )}
          </div>
          <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
            {result.feasibilityReasoning}
          </p>
          <div className="mt-auto bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Tender Alignment</span>
              <span className="text-xl font-black text-indigo-600">{result.alignmentScore}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${result.alignmentScore < 30 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                style={{ width: `${result.alignmentScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Platform Readiness</h3>
          <div className="w-full h-52 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feasibilityGauge}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  startAngle={225}
                  endAngle={-45}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={scoreColor} strokeWidth={0} />
                  <Cell fill="#F1F5F9" strokeWidth={0} />
                  <Label
                    value={`${result.feasibilityScore}%`}
                    position="center"
                    className="text-4xl font-black fill-slate-900"
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Fit Score</p>
          </div>
        </div>
      </div>

      {/* Resource & Effort Estimates */}
      <div className={`rounded-[2.5rem] p-10 text-white shadow-xl transition-all duration-500 ${isLowFeasibility ? 'bg-[#1a0b0b] border border-rose-900/50' : 'bg-slate-900'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-12">
          <div className="flex gap-12">
            <div className="text-center">
              <div className={`text-5xl font-black mb-2 ${isLowFeasibility ? 'text-rose-500' : 'text-indigo-400'}`}>
                {isLowFeasibility ? '∞' : result.effortEstimation.employees}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Team Scale</div>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-black mb-2 ${isLowFeasibility ? 'text-rose-500' : 'text-emerald-400'}`}>
                {isLowFeasibility ? 'N/A' : `${result.effortEstimation.durationMonths}m`}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Timeline</div>
            </div>
          </div>
          <div className={`md:border-l md:pl-12 flex-1 ${isLowFeasibility ? 'border-rose-900' : 'border-slate-800'}`}>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 ${isLowFeasibility ? 'text-rose-400' : 'text-indigo-400'}`}>
              {isLowFeasibility && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>}
              Staffing Insight {isLowFeasibility && '— High Risk Alert'}
            </h4>
            <p className="text-base text-slate-400 font-medium leading-relaxed italic pr-4">
              "{result.effortEstimation.description}"
            </p>
          </div>
        </div>
      </div>

      {/* Gaps & Remediation */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-10 py-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-black text-slate-900 uppercase tracking-tighter text-base">Gap Remediation Protocol</h3>
          <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">{result.outOfScope.length} Strategic Gaps</span>
        </div>
        <div className="divide-y divide-slate-100">
          {result.outOfScope.map((item, i) => (
            <div key={i} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 hover:bg-slate-50/40 transition-colors">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requirement Deficit</h4>
                <p className="text-base font-black text-slate-800">{item.point}</p>
              </div>
              <div className={`p-6 rounded-3xl border ${isLowFeasibility ? 'bg-rose-50/50 border-rose-100 shadow-sm' : 'bg-indigo-50/30 border-indigo-100/50 shadow-sm'}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isLowFeasibility ? 'text-rose-600' : 'text-indigo-600'}`}>Strategic Remediation</h4>
                <p className={`text-sm font-semibold leading-relaxed ${isLowFeasibility ? 'text-rose-900' : 'text-indigo-900'}`}>{item.remediation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
