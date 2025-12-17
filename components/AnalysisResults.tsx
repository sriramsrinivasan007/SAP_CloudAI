import React from 'react';
import { AnalysisResult, SolutionOption } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface AnalysisResultsProps {
  result: AnalysisResult;
  solution: SolutionOption;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, solution }) => {
  // Data for feasibility gauge
  const gaugeData = [
    { name: 'Score', value: result.feasibilityScore },
    { name: 'Remaining', value: 100 - result.feasibilityScore },
  ];
  
  // Determine color based on score
  const scoreColor = 
    result.feasibilityScore >= 80 ? '#10b981' : // Green
    result.feasibilityScore >= 50 ? '#f59e0b' : // Amber
    '#ef4444'; // Red

  return (
    <div className="animate-fade-in w-full space-y-8">
      
      {/* Header Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="w-48 h-48 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={scoreColor} />
                <Cell fill="#e2e8f0" />
                <Label
                    value={`${result.feasibilityScore}%`}
                    position="centerBottom"
                    dy={-5}
                    className="text-3xl font-bold fill-slate-800"
                    style={{ fontSize: '24px', fontWeight: 'bold' }}
                  />
                  <Label 
                    value="Feasible"
                    position="centerBottom"
                    dy={15}
                    className="text-xs text-slate-500 fill-slate-500"
                    style={{ fontSize: '12px' }}
                  />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis for {solution.name}</h2>
          <p className="text-slate-600 leading-relaxed">
            {result.feasibilityReasoning}
          </p>
        </div>
      </div>

      {/* Major Stakes */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-600 rounded-full block"></span>
          Major Stakes Identified
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.stakes.map((stake, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className={`
                  px-2 py-1 text-xs font-bold uppercase tracking-wider rounded
                  ${stake.severity === 'High' ? 'bg-red-100 text-red-700' : 
                    stake.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                    'bg-blue-100 text-blue-700'}
                `}>
                  {stake.severity} Risk
                </span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{stake.title}</h4>
              <p className="text-sm text-slate-600 flex-grow">{stake.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scope Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* In Scope */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-emerald-900">In Scope</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {result.inScope.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Out of Scope */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="bg-slate-200 p-2 rounded-full">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900">Out of Scope</h3>
          </div>
          <div className="p-6">
             <ul className="space-y-3">
              {result.outOfScope.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="text-slate-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};