import React, { useState } from 'react';
import { useBeginnerMode } from '../context/BeginnerModeContext';
import { GraduationCap, Shield, Search, Zap, Calculator, Info, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ onAnalyze, tokensRemaining = 5 }) {
  const { isBeginnerMode, setIsBeginnerMode } = useBeginnerMode();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onAnalyze) {
      onAnalyze(query);
      setQuery(''); // Clear after search
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-bg/80 border-b border-bd">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer mr-6 flex-shrink-0" 
          onClick={() => {
            navigate('/');
            // Also reset query if needed, handled by navigate
          }}
        >
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-surface font-bold text-xl shadow-sm">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary hidden sm:block">StockGyan</span>
        </div>

        {/* Mini Search */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-6">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-text-tertiary group-focus-within:text-accent transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-1.5 rounded-full bg-surface border border-bd hover:border-bd2 focus:border-accent outline-none transition-all shadow-sm text-sm text-text-primary"
              placeholder="Search ticker..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          
          {/* Token Counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-bd text-xs font-semibold text-text-secondary">
            <Zap className="h-3.5 w-3.5 text-accent" />
            <span>{tokensRemaining} / 5</span>
          </div>

          {/* How to Use Link */}
          <Link 
            to="/how-to-use" 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-bd text-xs font-semibold text-text-secondary hover:text-accent hover:border-accent transition-colors group"
          >
            <BookOpen className="h-3.5 w-3.5 group-hover:text-accent transition-colors" />
            <span>How To Use</span>
          </Link>

          {/* About Us Link */}
          <Link 
            to="/about" 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-bd text-xs font-semibold text-text-secondary hover:text-accent hover:border-accent transition-colors group"
          >
            <Info className="h-3.5 w-3.5 group-hover:text-accent transition-colors" />
            <span>About Us</span>
          </Link>

          {/* Beginner Mode Toggle */}
          <button
            onClick={() => setIsBeginnerMode(!isBeginnerMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              isBeginnerMode 
                ? 'bg-accent-dim text-accent border-accent-dim' 
                : 'bg-surface text-text-secondary border-bd hover:bg-bg2'
            }`}
          >
            {isBeginnerMode ? <GraduationCap className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
            <span className="hidden sm:block">{isBeginnerMode ? 'Learning' : 'Pro'}</span>
          </button>

        </div>
      </div>
    </header>
  );
}
