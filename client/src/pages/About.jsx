import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Database, Code2, Network, Cpu, Info, ArrowRight, Calculator, BarChart3, TrendingUp, Newspaper, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  {
    id: "tech-1",
    name: "Yahoo Finance API",
    role: "The Data Pipeline",
    icon: <Database className="h-8 w-8 text-blue-500" />,
    color: "bg-blue-500 text-surface",
    border: "border-blue-500",
    description: "Every analysis starts with hard facts. We use the yahoo-finance2 API to pull real-time market data, price history, and deep fundamental metrics directly from the markets."
  },
  {
    id: "tech-2",
    name: "Custom Node.js Engine",
    role: "The Deterministic Brain",
    icon: <Code2 className="h-8 w-8 text-green-500" />,
    color: "bg-green-500 text-surface",
    border: "border-green-500",
    description: "Before AI ever touches your request, our proprietary Node.js backend calculates a rigid 100-point StockGyan Score using strict mathematical formulas. No hallucinating allowed."
  },
  {
    id: "tech-3",
    name: "LangGraph Orchestration",
    role: "The Workflow Manager",
    icon: <Network className="h-8 w-8 text-purple-500" />,
    color: "bg-purple-500 text-surface",
    border: "border-purple-500",
    description: "Financial analysis isn't a single prompt. We use LangGraph to orchestrate a complex, multi-step pipeline where agents gather data, calculate risk, and formulate reports systematically."
  },
  {
    id: "tech-4",
    name: "Groq & Llama 3",
    role: "The Explainer",
    icon: <Cpu className="h-8 w-8 text-orange-500" />,
    color: "bg-orange-500 text-surface",
    border: "border-orange-500",
    description: "We use Groq's lightning-fast inference engine to power open-source LLMs. Their only job? Take the hard math and translate it into a beautiful, easy-to-read report for you."
  }
];

const methodologySteps = [
  {
    id: "step-1",
    title: "Financial Health",
    weight: "35%",
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    color: "bg-accent text-surface",
    border: "border-accent",
    text: "If a company can't make money, we don't make excuses. We mathematically evaluate Revenue Growth (>15%), Net Profit Margins, Debt-to-Equity ratios (<30% ideal), and Return on Equity (ROE). A company losing money or drowning in debt is immediately penalized.",
  },
  {
    id: "step-2",
    title: "Valuation",
    weight: "20%",
    icon: <Calculator className="h-8 w-8 text-pos" />,
    color: "bg-pos text-surface",
    border: "border-pos",
    text: "We don't pay for hype. Price is what you pay, value is what you get. We clamp the P/E Ratio between 10-25 for maximum points, heavily penalizing companies trading at astronomical valuations (P/E > 80) while rewarding solid, reasonable pricing.",
  },
  {
    id: "step-3",
    title: "Historical Growth",
    weight: "20%",
    icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
    color: "bg-purple-500 text-surface",
    border: "border-purple-500",
    text: "Numbers speak louder than promises. We pull live market data for the past 1, 3, and 5 years. Companies with consistent, multi-year compounding growth are awarded maximum points, while those with negative or stagnant returns are mathematically filtered out.",
  },
  {
    id: "step-4",
    title: "News Sentiment",
    weight: "15%",
    icon: <Newspaper className="h-8 w-8 text-blue-500" />,
    color: "bg-blue-500 text-surface",
    border: "border-blue-500",
    text: "The heartbeat of the market mood. A lightning-fast heuristic scanner scrapes recent headlines for bullish and bearish keywords (e.g., 'surges', 'profit', 'fraud', 'downgrade'). If the market is turning against a stock, we detect it instantly.",
  },
  {
    id: "step-5",
    title: "Risk & Volatility",
    weight: "10%",
    icon: <ShieldAlert className="h-8 w-8 text-orange-500" />,
    color: "bg-orange-500 text-surface",
    border: "border-orange-500",
    text: "Sleep peacefully at night. Using the stock's Beta (volatility compared to the NIFTY 50), we penalize highly erratic, unstable equities. A smooth, predictable ride is rewarded over a wild rollercoaster.",
  }
];

export default function About() {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-text-about", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      // API Stack Animation
      const cards = gsap.utils.toArray('.tech-card');
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
      
      // Methodology Cards Animation
      const methodCards = gsap.utils.toArray('.method-card');
      methodCards.forEach((card, i) => {
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

      // Pros and Cons pop in
      gsap.from(".pro-con-item", {
        scrollTrigger: {
          trigger: ".pro-con-section",
          start: "top 75%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
      
    }, comp);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full pb-32">
      
      {/* 1. Hero Section */}
      <section className="pt-24 pb-20 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full bg-accent-dim text-accent border border-accent/20 text-xs font-bold tracking-wider mb-6 hero-text-about shadow-sm uppercase">
          Why StockGyan is Different
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tighter mb-8 hero-text-about leading-tight">
          Chatbots <span className="text-text-tertiary line-through">guess</span>.<br/>We <span className="text-accent italic">calculate</span>.
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary leading-relaxed hero-text-about max-w-3xl mx-auto font-medium">
          If you ask ChatGPT for stock advice in a single prompt, it hallucinates numbers. 
          StockGyan pulls <strong className="text-text-primary">real market data</strong> first, calculates the math, and only then uses AI to explain it.
        </p>
      </section>

      <div className="overflow-x-hidden w-full">
        
        {/* 2. API Transparency & Stack */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 tracking-tight flex items-center justify-center gap-3">
              <Info className="h-8 w-8 text-accent" /> The Engine Room
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              We believe in total transparency. Here is the exact technology stack that powers your research reports. A huge thank you to the open-source community and these platforms.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-bd hidden md:block rounded-full"></div>
            
            <div className="space-y-12 md:space-y-24">
              {techStack.map((tech, index) => (
                <div key={tech.id} className={`tech-card relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-surface border-4 border-bd z-10 transform -translate-x-1/2 hidden md:block"></div>

                  <div className={`w-full md:w-1/2 text-left ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-surface border border-bd shadow-sm mb-6">
                      {tech.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
                      {tech.name}
                    </h3>
                    <div className={`inline-block px-3 py-1 text-sm rounded-full font-black ${tech.color} mb-4`}>
                      {tech.role}
                    </div>
                    <p className="text-lg text-text-secondary leading-relaxed">
                      <span className="font-semibold text-text-primary block mb-1">{tech.description.split('. ')[0]}.</span>
                      {tech.description.split('. ').slice(1).join('. ')}
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                      className={`w-64 h-64 rounded-3xl border-2 ${tech.border} border-opacity-30 bg-surface shadow-xl flex items-center justify-center relative overflow-hidden`}
                    >
                      <div className={`absolute inset-0 opacity-10 ${tech.color}`} style={{ clipPath: index % 2 === 0 ? 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' : 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }}></div>
                      <div className="text-center z-10 p-6">
                        {React.cloneElement(tech.icon, { className: `h-20 w-20 mx-auto opacity-80 ${tech.icon.props.className}` })}
                      </div>
                    </motion.div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Methodology Steps */}
        <section className="max-w-5xl mx-auto px-4 py-24 mt-12 border-t border-bd border-opacity-50">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 tracking-tight">How We Score</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              StockGyan runs on a strict, transparent, 100-point algorithm. The AI is only here to explain it to you.
            </p>
          </div>
          
          <div className="relative">
            {/* Central spine line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-bd hidden md:block rounded-full"></div>
            
            <div className="space-y-12 md:space-y-24">
              {methodologySteps.map((step, index) => (
                <div key={step.id} className={`method-card relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Visual Connector Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-surface border-4 border-bd z-10 transform -translate-x-1/2 hidden md:block"></div>

                  <div className={`w-full md:w-1/2 text-left ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-surface border border-bd shadow-sm mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-text-primary mb-4 flex items-center gap-3">
                      {step.title}
                      <span className={`px-3 py-1 text-sm rounded-full font-black ${step.color}`}>{step.weight}</span>
                    </h3>
                    <p className="text-lg text-text-secondary leading-relaxed">
                      <span className="font-semibold text-text-primary block mb-1">{step.text.split('. ')[0]}.</span>
                      {step.text.split('. ').slice(1).join('. ')}
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
                        <div className="text-6xl font-black text-text-primary opacity-80 mb-2">{step.weight}</div>
                        <div className="text-sm font-bold uppercase tracking-wider text-text-tertiary">Max Impact</div>
                      </div>
                    </motion.div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Pros and Cons */}
        <section className="pro-con-section max-w-6xl mx-auto px-4 py-24 mt-12 border-t border-bd border-opacity-50">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 tracking-tight">The Reality Check</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">No system is perfect. We believe in total transparency regarding what our engine can and cannot do.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Advantages */}
            <div className="bg-pos-bg border border-pos-bd p-8 rounded-3xl shadow-sm h-full">
              <h3 className="text-2xl font-bold text-pos mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-7 w-7" /> The Advantages
              </h3>
              <ul className="space-y-5">
                <li className="pro-con-item flex gap-3 text-text-primary text-lg">
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-pos"></div>
                  <div><strong>Zero Hallucinations.</strong> The AI cannot invent a verdict. It is forced to explain the hard math.</div>
                </li>
                <li className="pro-con-item flex gap-3 text-text-primary text-lg">
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-pos"></div>
                  <div><strong>Pure Transparency.</strong> You see the exact breakdown of the 100 points, rather than a black-box AI output.</div>
                </li>
                <li className="pro-con-item flex gap-3 text-text-primary text-lg">
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-pos"></div>
                  <div><strong>Instant Consistency.</strong> If two companies have the same financial profile, they get the exact same score, every single time.</div>
                </li>
              </ul>
            </div>

            {/* Disadvantages */}
            <div className="bg-neg-bg border border-neg-bd p-8 rounded-3xl shadow-sm h-full">
              <h3 className="text-2xl font-bold text-neg mb-6 flex items-center gap-2">
                <XCircle className="h-7 w-7" /> The Limitations
              </h3>
              <ul className="space-y-5">
                <li className="pro-con-item flex gap-3 text-text-primary text-lg">
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-neg"></div>
                  <div><strong>Historical Bias.</strong> The engine rewards past growth (1-5 yrs), but past performance does not guarantee future results.</div>
                </li>
                <li className="pro-con-item flex gap-3 text-text-primary text-lg">
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-neg"></div>
                  <div><strong>Blind to Macro Shocks.</strong> The math cannot quantify qualitative shocks (like abrupt CEO resignations or sudden geopolitical wars).</div>
                </li>
                <li className="pro-con-item flex gap-3 text-text-primary text-lg">
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-neg"></div>
                  <div><strong>Delayed Data.</strong> Financials are updated quarterly. A company might have deteriorated significantly before the engine sees the new Q4 report.</div>
                </li>
              </ul>
            </div>

          </div>
        </section>
      </div>

      {/* 5. The Mission */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center mt-12 border-t border-bd border-opacity-50">
        <h2 className="text-4xl font-bold text-text-primary mb-6 tracking-tight">Our Mission</h2>
        <p className="text-xl text-text-secondary leading-relaxed mb-12">
          StockGyan was built by the StockGyan Team to democratize institutional-grade financial analysis. 
          We want to give every retail investor in India the ability to sit down with a professional AI analyst 
          who relies on hard facts, not hallucinations.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
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
