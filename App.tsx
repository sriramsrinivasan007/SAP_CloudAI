import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { AnalysisResult, AppState } from './types';
import { analyzeDocument, fetchMarketContext, generateLogo } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [companyName, setCompanyName] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate logo on mount
    const loadLogo = async () => {
      try {
        const url = await generateLogo();
        setLogoUrl(url);
      } catch (err) {
        console.error("Logo generation failed", err);
      }
    };
    loadLogo();
  }, []);

  const handleFileSelect = async (file: File) => {
    if (!companyName.trim()) {
      alert('Please enter a company name first.');
      return;
    }

    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    setLoadingStatus('Initializing Search Grounding...');

    try {
      // Step 1: Search Grounding (Gemini 3 Flash)
      const context = await fetchMarketContext(companyName);
      
      setLoadingStatus(`Analyzing Document for ${companyName}...`);
      
      // Step 2: Complex Analysis (Gemini 3 Pro)
      const data = await analyzeDocument(file, companyName, context.text);
      
      setResult({
        ...data,
        marketContext: context.text,
        groundingSources: context.sources
      });
      
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg('Analysis failed. The AI couldn\'t process the document or find enough market info.');
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-xl w-10 h-10 overflow-hidden flex items-center justify-center shadow-sm shadow-indigo-200">
               {logoUrl ? (
                 <img src={logoUrl} alt="LegalLens.AI Logo" className="w-full h-full object-cover" />
               ) : (
                 <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                 </svg>
               )}
            </div>
            <h1 className="font-black text-xl tracking-tighter text-slate-900">LegalLens<span className="text-indigo-600">.AI</span></h1>
          </div>
          {appState === AppState.SUCCESS && (
            <button 
              onClick={handleReset}
              className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {appState === AppState.IDLE && (
          <div className="text-center mb-12 max-w-2xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Powered by Gemini 3 Pro & Search Grounding
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Instant Tender Intelligence
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              We use real-time market data to verify company solutions against your documents. Fast, accurate, and grounded.
            </p>
          </div>
        )}

        {(appState === AppState.IDLE || appState === AppState.ANALYZING || appState === AppState.ERROR) && (
          <div className={`max-w-3xl mx-auto transition-all duration-300 ${appState === AppState.ANALYZING ? 'opacity-40 pointer-events-none scale-95 blur-sm' : 'opacity-100'}`}>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 mb-8">
              <div className="mb-8">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  Who is the Bidding Company?
                </label>
                <input 
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Microsoft, Deloitte, SpaceX..."
                  className="w-full text-2xl font-bold p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-800 placeholder:text-slate-300"
                />
              </div>

              <div className={`transition-all duration-500 ${companyName.trim().length > 1 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2 pointer-events-none'}`}>
                <FileUpload 
                  onFileSelect={handleFileSelect} 
                  disabled={appState === AppState.ANALYZING}
                />
              </div>
            </div>

            {appState === AppState.ERROR && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center text-rose-600 font-bold animate-fade-in">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-50/50 backdrop-blur-sm">
             <div className="bg-white p-10 rounded-3xl shadow-2xl border border-indigo-100 flex flex-col items-center max-w-sm text-center">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Bid Analysis</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">{loadingStatus}</p>
             </div>
          </div>
        )}

        {appState === AppState.SUCCESS && result && (
          <div className="w-full">
            <AnalysisResults result={result} />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
