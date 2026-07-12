import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const POPULAR_STOCKS = ["Reliance", "HDFC Bank", "ICICI Bank", "SBI", "Tata Motors", "Infosys", "Bajaj Finance", "TCS", "Adani Power", "ITC"];

export default function Hero({ onAnalyze }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onAnalyze(query);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text-primary">
          Invest with <span className="text-accent">Clarity</span>
        </h1>
        <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
          AI-powered investment research for the Indian stock market.
        </p>
        
        <form onSubmit={handleSubmit} className="relative w-full group mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-tertiary group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-28 py-4 rounded-2xl bg-surface border-2 border-bd hover:border-bd2 focus:border-accent focus:ring-4 focus:ring-accent-dim outline-none transition-all shadow-sm text-lg text-text-primary"
            placeholder="Search company or ticker..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-text-primary text-surface rounded-xl hover:bg-text-secondary transition-colors font-medium shadow-sm"
          >
            Analyze
          </button>
        </form>

        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Popular Indian Stocks</span>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_STOCKS.map(stock => (
              <button
                key={stock}
                onClick={() => onAnalyze(stock)}
                className="px-4 py-1.5 rounded-full bg-surface border border-bd text-sm text-text-secondary hover:text-accent hover:border-accent transition-colors shadow-sm"
              >
                {stock}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
