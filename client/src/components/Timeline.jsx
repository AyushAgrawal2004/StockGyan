import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  "Finding company profile",
  "Fetching market data",
  "Reading financial statements",
  "Reading latest news",
  "AI analyzing company",
  "Preparing recommendation"
];

export default function Timeline({ step }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        {STEPS.map((text, i) => {
          const isCompleted = step > i;
          const isActive = step === i;
          const isPending = step < i;

          return (
            <div key={i} className="flex items-center gap-4">
              <div className="relative flex items-center justify-center h-6 w-6">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-pos"
                  >
                    <CheckCircle2 className="h-6 w-6" />
                  </motion.div>
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-accent animate-spin" />
                ) : (
                  <Circle className="h-5 w-5 text-text-tertiary opacity-30" />
                )}
              </div>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isActive ? 'text-text-primary' : 
                  isCompleted ? 'text-text-secondary' : 'text-text-tertiary opacity-50'
                }`}
              >
                {text}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
