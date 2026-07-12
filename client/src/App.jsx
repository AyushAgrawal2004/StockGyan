import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import HowToUse from './pages/HowToUse';
import About from './pages/About';
import DisclaimerModal from './components/DisclaimerModal';
import { analyzeStock } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(-1);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [tokensRemaining, setTokensRemaining] = useState(5);
  const navigate = useNavigate();

  const handleAnalyze = async (query) => {
    // Navigate back to home if we are on another page
    navigate('/');
    
    setLoading(true);
    setError(null);
    setReportData(null); // Hides the report, shows Timeline
    
    // Smooth timeline progression matching AI workflow
    setStep(0);
    const intervals = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2200),
      setTimeout(() => setStep(4), 3000),
    ];

    try {
      const apiRes = await analyzeStock(query);
      
      // Update tokens
      if (apiRes.tokensRemaining !== undefined) {
        setTokensRemaining(apiRes.tokensRemaining);
      }

      // Ensure data is structured for Report
      const structuredData = {
        meta: apiRes.meta,
        llm: apiRes.data,
        historicalReturns: apiRes.meta.historicalReturns,
        marketReturns: apiRes.meta.marketReturns
      };
      
      intervals.forEach(clearTimeout);
      setStep(5); // Preparing recommendation
      
      setTimeout(() => {
        setReportData(structuredData);
        setStep(-1);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      intervals.forEach(clearTimeout);
      setError(err.message || 'An error occurred during analysis');
      setStep(-1);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      <DisclaimerModal />
      <Header onAnalyze={handleAnalyze} tokensRemaining={tokensRemaining} />
      
      <main className="flex-1 flex flex-col items-center w-full">
        <Routes>
          <Route path="/" element={
            <Home 
              loading={loading}
              step={step}
              reportData={reportData}
              error={error}
              onAnalyze={handleAnalyze}
              onResetError={() => { setError(null); setStep(-1); }}
            />
          } />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
