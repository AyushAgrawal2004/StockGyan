import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Simple animated number counter
const NumberCounter = ({ value, prefix = "₹" }) => {
  const [displayValue, setDisplayValue] = useState(10000); // Start at 10k

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500; // 1.5s
    const startValue = 10000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (value - startValue) * ease);
      
      setDisplayValue(current);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString('en-IN')}</span>;
};

const JourneyCard = ({ years, companyReturn, marketReturn, delay }) => {
  const startAmount = 10000;
  const cRet = companyReturn || 0;
  const mRet = marketReturn || 0;
  const endAmount = startAmount * (1 + (cRet / 100));
  
  const isPositive = cRet > 5;
  const isNegative = cRet < -5;
  const isNeutral = !isPositive && !isNegative;

  const getLesson = () => {
    if (isPositive) return "Long-term investing rewarded patient shareholders.";
    if (isNegative) return "Short-term declines are common even for fundamentally strong companies.";
    return "Steady returns often indicate a stable business.";
  };

  const getTheme = () => {
    if (isPositive) return { color: 'text-pos', bg: 'bg-pos-bg', border: 'border-pos-bd', bar: 'bg-pos', icon: <TrendingUp className="h-4 w-4" /> };
    if (isNegative) return { color: 'text-neg', bg: 'bg-neg-bg', border: 'border-neg-bd', bar: 'bg-neg', icon: <TrendingDown className="h-4 w-4" /> };
    return { color: 'text-neu', bg: 'bg-neu-bg', border: 'border-neu-bd', bar: 'bg-neu', icon: <Minus className="h-4 w-4" /> };
  };

  const theme = getTheme();
  const diff = cRet - mRet;
  const marketPerfText = diff >= 0 ? 'Outperformed Market' : 'Underperformed Market';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative p-6 rounded-3xl border ${theme.border} ${theme.bg} overflow-hidden shadow-sm flex flex-col`}
    >
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-xs uppercase tracking-wider text-text-tertiary">{years} {years === 1 ? 'Year' : 'Years'}</span>
        <div className={`flex items-center gap-1 font-bold ${theme.color}`}>
          {theme.icon}
          {cRet > 0 ? '+' : ''}{cRet.toFixed(1)}%
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <span className="block text-xs font-semibold text-text-tertiary mb-1 uppercase">Invested</span>
          <span className="text-lg font-bold text-text-secondary">₹10,000</span>
        </div>
        <div className="w-8 h-px bg-bd mx-2"></div>
        <div className="text-right">
          <span className="block text-xs font-semibold text-text-tertiary mb-1 uppercase">Today</span>
          <span className="text-2xl font-bold text-text-primary">
            <NumberCounter value={endAmount} />
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden mb-6 border border-bd">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isNegative ? '20%' : isNeutral ? '50%' : '85%' }}
          transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
          className={`h-full ${theme.bar}`}
        />
      </div>

      {/* Educational Insight */}
      <div className="mt-auto bg-surface bg-opacity-50 p-4 rounded-2xl border border-bd border-opacity-50 mb-4">
        <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-text-tertiary tracking-wider mb-1.5">
          📘 Investor Lesson
        </span>
        <p className="text-sm font-medium text-text-secondary leading-snug">
          {getLesson()}
        </p>
      </div>

      {/* Market Comparison */}
      <div className="flex items-center justify-between pt-4 border-t border-bd border-opacity-50">
        <div className="text-xs">
          <span className="text-text-tertiary">Company </span>
          <span className={`font-bold ${cRet >= 0 ? 'text-pos' : 'text-neg'}`}>{cRet > 0 ? '+' : ''}{cRet.toFixed(1)}%</span>
        </div>
        <div className="text-xs">
          <span className="text-text-tertiary">NIFTY </span>
          <span className={`font-bold ${mRet >= 0 ? 'text-pos' : 'text-neg'}`}>{mRet > 0 ? '+' : ''}{mRet.toFixed(1)}%</span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${diff >= 0 ? 'bg-pos-bg text-pos border-pos-bd' : 'bg-neg-bg text-neg border-neg-bd'}`}>
          {diff >= 0 ? '✅ Outperformed' : '⚠ Underperformed'}
        </span>
      </div>
    </motion.div>
  );
};

export default function WealthJourney({ historicalReturns, marketReturns, insight }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // If no data, don't render (fallback)
  if (!historicalReturns || Object.keys(historicalReturns).length === 0 || historicalReturns['1Y'] === null) return null;

  return (
    <div className="mb-12">
      <div className="flex flex-col mb-6 relative">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold text-text-primary">Wealth Journey</h3>
          <button 
            onClick={() => setShowTooltip(!showTooltip)}
            className="p-1 hover:bg-bd rounded-full transition-colors text-text-tertiary hover:text-text-primary"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
        <p className="text-text-secondary mt-1">See how a ₹10,000 investment would have grown over time.</p>
        
        {/* Beginner Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 top-full mt-2 z-10 w-[320px] bg-bg2 border border-bd rounded-2xl p-5 shadow-xl"
            >
              <h4 className="font-bold text-sm text-text-primary mb-2">Why are historical returns useful?</h4>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                Past performance does not guarantee future returns. However, it helps you understand how consistently the company has created wealth for long-term investors.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                Always combine this with financial analysis and company fundamentals.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <JourneyCard years={1} companyReturn={historicalReturns['1Y']} marketReturn={marketReturns['1Y']} delay={0.1} />
        <JourneyCard years={3} companyReturn={historicalReturns['3Y']} marketReturn={marketReturns['3Y']} delay={0.2} />
        <JourneyCard years={5} companyReturn={historicalReturns['5Y']} marketReturn={marketReturns['5Y']} delay={0.3} />
      </div>

      {insight && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-surface rounded-2xl p-6 border border-bd flex flex-col md:flex-row gap-4 items-start shadow-sm"
        >
          <div className="flex-shrink-0 p-3 bg-bg2 rounded-xl border border-bd">
            <Info className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-tertiary uppercase tracking-wider mb-2">What does this tell us?</h4>
            <p className="text-text-secondary leading-relaxed">{insight}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
