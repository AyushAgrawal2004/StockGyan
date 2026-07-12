import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Search, GraduationCap, Shield, Zap, FileText, ArrowRight, MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const tutorialSteps = [
  {
    id: "tut-1",
    title: "1. Search & Analyze",
    icon: <Search className="h-8 w-8 text-blue-500" />,
    color: "bg-blue-500 text-surface",
    border: "border-blue-500",
    text: "Enter any Indian stock ticker or company name into the search bar. Our multi-agent system instantly wakes up, pulls live market data from Yahoo Finance, and begins calculating a fundamental score.",
  },
  {
    id: "tut-2",
    title: "2. Choose Your Mode",
    icon: <div className="flex gap-2"><GraduationCap className="h-8 w-8 text-green-500" /><Shield className="h-8 w-8 text-purple-500" /></div>,
    color: "bg-green-500 text-surface",
    border: "border-green-500",
    text: "Use the toggle in the header to switch between 'Learning' and 'Pro' modes. Learning mode translates complex financial metrics into simple analogies. Pro mode gives you the raw, unfiltered data and exact ratios.",
  },
  {
    id: "tut-3",
    title: "3. Read the Report",
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    color: "bg-orange-500 text-surface",
    border: "border-orange-500",
    text: "First, look at the Verdict badge (Strong Buy to Strong Avoid). Next, check the 'Wealth Journey' to see real-world historical returns. Finally, dive into the 'Financial Metrics' and let the AI explain exactly why the company scored the way it did.",
  },
  {
    id: "tut-4",
    title: "4. Mind Your Tokens",
    icon: <Zap className="h-8 w-8 text-yellow-500" />,
    color: "bg-yellow-500 text-surface",
    border: "border-yellow-500",
    text: "To keep our AI inference lightning fast and free, you are granted 5 analysis tokens per session. You can see your remaining tokens in the top right corner. Make them count!",
  }
];

export default function HowToUse() {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-text-tut", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      // Tutorial Cards Animation
      const cards = gsap.utils.toArray('.tut-card');
      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          x: i % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });
      
    }, comp);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full pb-32">
      
      {/* 1. Hero Section */}
      <section className="pt-24 pb-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full bg-accent-dim text-accent border border-accent/20 text-xs font-bold tracking-wider mb-6 hero-text-tut shadow-sm uppercase">
          Masterclass
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tighter mb-6 hero-text-tut">
          How to use <span className="text-accent italic">StockGyan</span>.
        </h1>
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed hero-text-tut max-w-2xl mx-auto">
          Get the most out of your AI financial analyst. A quick guide to analyzing stocks, toggling modes, and reading your reports.
        </p>
      </section>

      <div className="overflow-x-hidden w-full">
        {/* 2. Tutorial Steps */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="relative">
            {/* Central spine line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-bd hidden md:block rounded-full"></div>
            
            <div className="space-y-12 md:space-y-24">
              {tutorialSteps.map((step, index) => (
                <div key={step.id} className={`tut-card relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Visual Connector Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-surface border-4 border-bd z-10 transform -translate-x-1/2 hidden md:block"></div>

                  <div className={`w-full md:w-1/2 text-left ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-surface border border-bd shadow-sm mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-text-primary mb-4 flex items-center gap-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-text-secondary leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                      className={`w-64 h-64 rounded-3xl border-2 ${step.border} border-opacity-30 bg-surface shadow-xl flex items-center justify-center relative overflow-hidden`}
                    >
                      {/* Decorative abstract background shape */}
                      <div className={`absolute inset-0 opacity-10 ${step.color}`} style={{ clipPath: index % 2 === 0 ? 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' : 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }}></div>
                      <div className="text-center z-10 p-6">
                        <MousePointerClick className={`h-20 w-20 mx-auto opacity-80 ${step.color.replace('bg-', 'text-').split(' ')[0]}`} />
                      </div>
                    </motion.div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 3. Call to Action */}
      <section className="py-24 px-4 text-center mt-12 border-t border-bd border-opacity-50">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-text-primary mb-6">Ready to find your next investment?</h2>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-surface rounded-full text-lg font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 whitespace-nowrap mb-12"
          >
            Start Analyzing <ArrowRight className="h-5 w-5 flex-shrink-0" />
          </Link>
        </motion.div>
      </section>

      {/* Spacer to fix scroll clipping */}
      <div className="h-32 w-full flex-shrink-0"></div>
    </div>
  );
}
