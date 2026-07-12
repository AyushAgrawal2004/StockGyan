import React from 'react';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import Report from '../components/Report';

const Home = ({ loading, step, reportData, error, onAnalyze, onResetError }) => {
  return (
    <>
      {/* Only show Hero if NO report and NO loading */}
      {!reportData && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <Hero onAnalyze={onAnalyze} />
        </div>
      )}

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center pt-24">
          <h2 className="text-2xl font-bold mb-10 text-text-primary tracking-tight">Gathering Intelligence...</h2>
          <Timeline step={step} />
        </div>
      )}

      {error && (
        <div className="max-w-xl mx-auto mt-20 w-full px-4">
          <div className="p-6 bg-neg-bg border border-neg-bd text-neg rounded-3xl shadow-sm text-center">
            <p className="font-semibold text-lg">{error}</p>
            <button 
              onClick={onResetError}
              className="mt-6 px-6 py-2 bg-neg text-surface rounded-full font-medium hover:bg-opacity-90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {reportData && !loading && (
        <div className="pt-8 w-full">
          <Report data={reportData} />
        </div>
      )}
    </>
  );
};

export default Home;
