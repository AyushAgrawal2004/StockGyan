import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const hasSeen = localStorage.getItem('stockgyan_disclaimer_v2_seen');
    if (!hasSeen) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    setPage(2);
  };

  const handleAccept = () => {
    localStorage.setItem('stockgyan_disclaimer_v2_seen', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-surface border-2 border-bd rounded-3xl shadow-2xl overflow-hidden"
          >
            {page === 1 ? (
              <motion.div
                key="page1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Header Area */}
                <div className="bg-neg-bg border-b border-neg-bd p-6 flex items-center gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-neg/10 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-neg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-neg">Important Disclaimer</h2>
                    <p className="text-sm font-medium text-neg/80">Please read before using StockGyan</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6">
                  <p className="text-text-primary text-lg leading-relaxed">
                    StockGyan is an experimental AI-powered financial research tool. The insights, scores, and verdicts provided are for <strong>educational and informational purposes only</strong>.
                  </p>
                  
                  <ul className="space-y-4 text-text-secondary">
                    <li className="flex gap-3">
                      <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-accent"></div>
                      <div>This is <strong>not financial advice</strong>. Always consult a SEBI-registered advisor before investing.</div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-accent"></div>
                      <div>Historical performance does not guarantee future results.</div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-accent"></div>
                      <div>Data is provided "as is" and may occasionally be delayed or inaccurate due to API limitations.</div>
                    </li>
                  </ul>
                </div>

                {/* Footer */}
                <div className="p-6 md:p-8 bg-bg2 border-t border-bd flex justify-end">
                  <button 
                    onClick={handleNext}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-text-primary text-surface rounded-xl hover:bg-text-secondary transition-colors font-bold text-lg shadow-sm"
                  >
                    Next <CheckCircle2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="page2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Header Area */}
                <div className="bg-neu-bg border-b border-neu-bd p-6 flex items-center gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-neu/10 flex items-center justify-center text-2xl">
                    🥺
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-neu">One More Thing...</h2>
                    <p className="text-sm font-medium text-neu/80">A message from the developer</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6">
                  <p className="text-text-primary text-lg leading-relaxed text-center font-medium italic">
                    "Look, the developer of this website is completely broke right now. Like, eating-instant-noodles-for-dinner broke."
                  </p>
                  <p className="text-text-secondary text-center">
                    Every time you search a stock, it costs him real API credits. So please, use this tool wisely. Don't go searching for 500 stocks in a row just for fun, or you might actually bankrupt him. 💸
                  </p>
                </div>

                {/* Footer */}
                <div className="p-6 md:p-8 bg-bg2 border-t border-bd flex justify-end">
                  <button 
                    onClick={handleAccept}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-surface rounded-xl hover:bg-accent-hover transition-colors font-bold text-lg shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5" /> I Promise Not to Bankrupt You
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
