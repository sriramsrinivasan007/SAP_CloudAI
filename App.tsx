import React, { useState } from 'react';
import { SolutionSelector } from './components/SolutionSelector';
import { FileUpload } from './components/FileUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { AnalysisResult, AppState, SolutionOption } from './types';
import { analyzeDocument } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedSolution, setSelectedSolution] = useState<SolutionOption | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!selectedSolution) {
      alert('Please select a solution first.');
      return;
    }

    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      const data = await analyzeDocument(file, selectedSolution);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg('Failed to analyze document. Please ensure the PDF is readable and try again.');
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5">
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
               </svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">LegalLens</h1>
          </div>
          {appState === AppState.SUCCESS && (
            <button 
              onClick={handleReset}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Start New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Intro */}
        {appState === AppState.IDLE && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              Determine Solution Fit & Feasibility
            </h2>
            <p className="text-lg text-slate-600">
              Select your company's solution and upload a legal document. 
              Our AI will analyze the major stakes, feasibility score, and scope coverage instantly.
            </p>
          </div>
        )}

        {/* Input Phase */}
        {(appState === AppState.IDLE || appState === AppState.ANALYZING || appState === AppState.ERROR) && (
          <div className={`transition-all duration-300 ${appState === AppState.ANALYZING ? 'opacity-50 pointer-events-none blur-[1px]' : 'opacity-100'}`}>
            <SolutionSelector 
              selectedSolution={selectedSolution} 
              onSelect={setSelectedSolution}
              disabled={appState === AppState.ANALYZING}
            />
            
            <div className={`transition-all duration-500 ${selectedSolution ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4 grayscale pointer-events-none'}`}>
              <FileUpload 
                onFileSelect={handleFileSelect} 
                disabled={appState === AppState.ANALYZING || !selectedSolution}
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {appState === AppState.ANALYZING && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
             <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-indigo-100 flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-slate-800">Analyzing Document</h3>
                <p className="text-slate-500 mt-2">Extracting stakes & validating against solution...</p>
             </div>
          </div>
        )}

        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Results */}
        {appState === AppState.SUCCESS && result && selectedSolution && (
          <AnalysisResults result={result} solution={selectedSolution} />
        )}

      </main>
    </div>
  );
};

export default App;