import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBeginnerMode } from '../context/BeginnerModeContext';
import { 
  ChevronDown, TrendingUp, TrendingDown, Info, ShieldCheck, 
  AlertTriangle, BrainCircuit, ExternalLink, Activity, DollarSign,
  Briefcase, BarChart3, Globe, Zap, Clock, CheckCircle2
} from 'lucide-react';

import educationData from '../data/education.json';
import WealthJourney from './WealthJourney';

// Helper to safely fetch education data
const getEdu = (key) => educationData[key] || { name: key, what_is_it: "", how_to_use: "", importance: 5 };

const ScoreRing = ({ score, colorClass, size = 120 }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <circle className="text-bg stroke-current" strokeWidth="6" cx="50" cy="50" r="44" fill="transparent" />
      <motion.circle
        className={`${colorClass} stroke-current drop-shadow-sm`}
        strokeWidth="6" strokeLinecap="round" cx="50" cy="50" r="44" fill="transparent"
        initial={{ strokeDasharray: "0 276.4" }}
        animate={{ strokeDasharray: `${(score / 100) * 276.4} 276.4` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
    </div>
  </div>
);

const MetricCard = ({ metricKey, value, isBeginnerMode }) => {
  const [isOpen, setIsOpen] = useState(isBeginnerMode);
  const edu = getEdu(metricKey);
  
  // Render importance stars
  const stars = Array(5).fill(0).map((_, i) => (
    <span key={i} className={`text-xs ${i < Math.round(edu.importance/2) ? 'text-accent' : 'text-bd2'}`}>★</span>
  ));

  return (
    <div className="bg-surface border border-bd rounded-2xl overflow-hidden shadow-sm hover:border-bd2 transition-colors">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="font-semibold text-text-secondary">{edu.name}</span>
          <span className="text-xl font-bold text-text-primary">{value}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-bold text-text-tertiary mb-0.5">Importance</span>
            <div className="flex gap-0.5">{stars}</div>
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg hover:bg-bd transition-colors text-xs font-medium text-text-secondary"
          >
            <Info className="h-3.5 w-3.5" />
            Learn Why
            <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-4 bg-bg2 border-t border-bd space-y-4">
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">What is it?</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{edu.what_is_it}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">How beginners use it</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{edu.how_to_use}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Report({ data }) {
  const { isBeginnerMode } = useBeginnerMode();
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!data) return null;

  const { meta, llm } = data;
  const quote = meta.quote.price || {};
  
  // Extract values
  const symbol = meta.ticker;
  const companyName = meta.companyName;
  const price = quote.regularMarketPrice || 0;
  const changePct = quote.regularMarketChangePercent ? quote.regularMarketChangePercent * 100 : 0;
  
  // LLM / Engine parsing
  const score = llm.score || 50;
  const breakdown = llm.score_breakdown || { financial: 0, valuation: 0, growth: 0, news: 0, risk: 0 };
  const verdictData = llm.verdictData || { verdict: "WATCHLIST", color: "text-[#EA580C]", badgeColor: "bg-[#FFEDD5] border-[#FDBA74]", description: "The company requires monitoring." };
  const rec = verdictData.verdict;
  const risk = llm.overall_risk_level || "Medium";
  const summary = llm.conversational_summary || {};
  const risks = llm.risk_analysis || {};
  const reasons = llm.verdict_reasons || [];
  const news = meta.news || [];
  const aiNews = llm.news_sentiments || [];

  const verdictStyleMap = {
    "STRONG BUY": { color: "text-green-800", badgeColor: "bg-green-100 border-green-400" },
    "BUY": { color: "text-green-600", badgeColor: "bg-green-50 border-green-300" },
    "ACCUMULATE": { color: "text-lime-600", badgeColor: "bg-lime-50 border-lime-300" },
    "HOLD": { color: "text-amber-600", badgeColor: "bg-amber-50 border-amber-300" },
    "WATCHLIST": { color: "text-orange-600", badgeColor: "bg-orange-50 border-orange-300" },
    "AVOID": { color: "text-red-600", badgeColor: "bg-red-50 border-red-300" },
    "STRONG AVOID": { color: "text-red-800", badgeColor: "bg-red-100 border-red-400" }
  };
  const vStyle = verdictStyleMap[rec] || { color: "text-gray-800", badgeColor: "bg-gray-100 border-gray-400" };

  // Color logic
  const getRiskColor = (r) => {
    if (r?.toLowerCase() === 'low') return 'text-pos';
    if (r?.toLowerCase() === 'high') return 'text-neg';
    if (r?.toLowerCase() === 'very high') return 'text-neg';
    return 'text-neu';
  };

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="max-w-6xl mx-auto px-4 pb-24 w-full">
      
      {/* 1. Premium Company Header */}
      <motion.div variants={itemVars} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end pb-8 border-b border-bd">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">{symbol}</h1>
            <span className="px-3 py-1 rounded-full bg-surface border border-bd text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {meta.quote.summaryProfile?.sector || 'Equity'}
            </span>
            <span className="px-3 py-1 rounded-full bg-surface border border-bd text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {quote.exchangeName || 'NSE'}
            </span>
          </div>
          <h2 className="text-xl text-text-secondary font-medium mb-6">{companyName}</h2>
          
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold text-text-primary">₹{price.toFixed(2)}</span>
            <span className={`text-xl font-medium flex items-center ${changePct >= 0 ? 'text-pos' : 'text-neg'}`}>
              {changePct >= 0 ? <TrendingUp className="h-6 w-6 mr-1" /> : <TrendingDown className="h-6 w-6 mr-1" />}
              {changePct > 0 ? '+' : ''}{changePct.toFixed(2)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Algorithmic Score Centerpiece */}
      <motion.div variants={itemVars} className="mb-12">
        <div className={`p-8 md:p-12 rounded-3xl border ${vStyle.badgeColor} flex flex-col md:flex-row items-center md:items-stretch gap-10 shadow-sm`}>
          
          <div className="flex-shrink-0 flex flex-col items-center justify-center">
            <ScoreRing score={score} colorClass={vStyle.color} size={160} />
            <span className="mt-4 text-sm font-bold text-text-tertiary uppercase tracking-wider">Overall Score</span>
          </div>

          <div className="flex-1 text-center md:text-left flex flex-col justify-center">
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-2 shadow-sm self-center md:self-start ${vStyle.badgeColor} ${vStyle.color}`}>
              VERDICT: <span>{rec}</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-xl">
              {verdictData.description}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-4 mb-6 text-left">
                  {reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-primary text-base leading-relaxed font-medium">
                      <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${vStyle.color}`} />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-surface bg-opacity-80 p-5 rounded-2xl border border-bd shadow-sm text-left flex flex-col justify-center">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-4 flex items-center gap-2">
                  <BrainCircuit className="h-3.5 w-3.5" /> Engine Breakdown
                </h4>
                <ScoreProgressBar label="Financial Health" score={breakdown.financial} max={35} colorClass="bg-accent" />
                <ScoreProgressBar label="Valuation" score={breakdown.valuation} max={20} colorClass="bg-pos" />
                <ScoreProgressBar label="Growth" score={breakdown.growth} max={20} colorClass="bg-purple-500" />
                <ScoreProgressBar label="News & Sentiment" score={breakdown.news} max={15} colorClass="bg-blue-500" />
                <ScoreProgressBar label="Risk Profile" score={breakdown.risk} max={10} colorClass="bg-orange-500" />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-6 border-t border-bd border-opacity-50 mt-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-text-tertiary block mb-1">Risk Level</span>
                <span className={`font-semibold ${getRiskColor(risk)} flex items-center gap-1.5`}>
                  <AlertTriangle className="h-4 w-4" /> {risk} Risk
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-text-tertiary block mb-1">Market Cap</span>
                <span className="font-semibold text-text-secondary flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> 
                  {quote.marketCap ? `₹${(quote.marketCap / 1e12).toFixed(2)}T` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-text-tertiary block mb-1">Last Updated</span>
                <span className="font-semibold text-text-secondary flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Just now
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Conversational AI Summary */}
      <motion.div variants={itemVars} className="mb-12">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-accent" /> Analyst Notes
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-3xl p-8 border border-bd shadow-sm col-span-1 md:col-span-2">
            <h4 className="text-sm font-bold text-text-tertiary uppercase tracking-wider mb-3">Quick Summary</h4>
            <p className="text-lg text-text-primary leading-relaxed">{summary.quick_summary}</p>
          </div>
          
          {(isBeginnerMode || !isBeginnerMode) && ( // Always show beginner advice
            <div className="bg-surface rounded-3xl p-8 border border-bd shadow-sm">
              <h4 className="text-sm font-bold text-text-tertiary uppercase tracking-wider mb-3">Should beginners invest?</h4>
              <p className="text-text-secondary leading-relaxed">{summary.for_beginners}</p>
            </div>
          )}
          
          <AnimatePresence>
          {!isBeginnerMode && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="col-span-1 md:col-span-2 grid md:grid-cols-2 gap-6 overflow-hidden"
            >
              <div className="bg-surface rounded-3xl p-8 border border-bd shadow-sm col-span-1 md:col-span-2">
                <h4 className="text-sm font-bold text-text-tertiary uppercase tracking-wider mb-3">For Long-Term Investors</h4>
                <p className="text-text-secondary leading-relaxed">{summary.for_long_term}</p>
              </div>
              
              <div className="bg-pos-bg rounded-3xl p-8 border border-pos-bd shadow-sm">
                <h4 className="text-sm font-bold text-pos uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Biggest Opportunity
                </h4>
                <p className="text-text-secondary leading-relaxed">{summary.biggest_opportunity}</p>
              </div>
              
              <div className="bg-neg-bg rounded-3xl p-8 border border-neg-bd shadow-sm">
                <h4 className="text-sm font-bold text-neg uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" /> Biggest Risk
                </h4>
                <p className="text-text-secondary leading-relaxed">{summary.biggest_risk}</p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 3.5 Wealth Journey */}
      <WealthJourney 
        historicalReturns={data.historicalReturns} 
        marketReturns={data.marketReturns} 
        insight={llm.wealth_journey_insight} 
      />

      {/* 4. Financial Metrics (Interactive) */}
      <motion.div variants={itemVars} className="mb-12">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-accent" /> Financial Health
        </h3>
        
        {/* Core Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <MetricCard metricKey="PE_Ratio" value={meta.quote.summaryDetail?.trailingPE?.toFixed(2) || "N/A"} isBeginnerMode={isBeginnerMode} />
          <MetricCard metricKey="Debt_to_Equity" value={meta.quote.financialData?.debtToEquity?.toFixed(2) || "N/A"} isBeginnerMode={isBeginnerMode} />
          <MetricCard metricKey="ROE" value={meta.quote.financialData?.returnOnEquity ? (meta.quote.financialData.returnOnEquity * 100).toFixed(2) + '%' : "N/A"} isBeginnerMode={isBeginnerMode} />
        </div>

        {/* Advanced Metrics (Pro Mode Only) */}
        <AnimatePresence>
        {!isBeginnerMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden"
          >
            <MetricCard metricKey="Current_Ratio" value={meta.quote.financialData?.currentRatio?.toFixed(2) || "N/A"} isBeginnerMode={false} />
            <MetricCard metricKey="Dividend_Yield" value={meta.quote.summaryDetail?.dividendYield ? (meta.quote.summaryDetail.dividendYield * 100).toFixed(2) + '%' : "N/A"} isBeginnerMode={false} />
            <MetricCard metricKey="Beta" value={meta.quote.summaryDetail?.beta?.toFixed(2) || "N/A"} isBeginnerMode={false} />
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>

      {/* 5. Risk Breakdown */}
      <motion.div variants={itemVars} className="mb-12">
        <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-accent" /> Risk Breakdown
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(risks).map(([key, data], i) => (
            <div key={i} className="bg-surface border border-bd p-6 rounded-3xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg capitalize">{key} Risk</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  data.level?.toLowerCase() === 'high' ? 'bg-neg-bg text-neg' :
                  data.level?.toLowerCase() === 'low' ? 'bg-pos-bg text-pos' : 'bg-neu-bg text-neu'
                }`}>
                  {data.level}
                </span>
              </div>
              <p className="text-text-secondary leading-relaxed">{data.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 6. Recent News Context */}
      {news && news.length > 0 && (
        <motion.div variants={itemVars} className="mb-12">
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-accent" /> Market Sentiment
          </h3>
          <div className="grid lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map((item, i) => {
              // Try to find sentiment from LLM
              const aiSentimentData = aiNews.find(n => item.title.includes(n.title) || n.title.includes(item.title.substring(0, 20)));
              const sentiment = aiSentimentData?.sentiment || 'neutral';
              const sColor = sentiment === 'positive' ? 'text-pos border-pos' : sentiment === 'negative' ? 'text-neg border-neg' : 'text-neu border-neu';
              
              return (
                <a 
                  key={i} href={item.url} target="_blank" rel="noreferrer"
                  className="flex flex-col bg-surface border border-bd rounded-3xl p-6 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-text-tertiary uppercase">{item.source || 'News'}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${sColor}`}>
                      {sentiment}
                    </span>
                  </div>
                  <h4 className="font-bold text-text-primary group-hover:text-accent transition-colors mb-3 line-clamp-3">
                    {item.title}
                  </h4>
                  <div className="mt-auto pt-4 flex justify-between items-center border-t border-bd text-xs text-text-tertiary">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              );
            })}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}

const ScoreProgressBar = ({ label, score, max, colorClass }) => {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1 text-text-tertiary">
        <span>{label}</span>
        <span>{score}/{max}</span>
      </div>
      <div className="h-1.5 w-full bg-bg border border-bd border-opacity-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full ${colorClass || 'bg-accent'}`}
        />
      </div>
    </div>
  );
};
