import React, { useEffect } from 'react';
import { useCompare } from '../context/CompareContext';
import { motion, AnimatePresence } from 'motion/react';
import { Columns4, X, AlertCircle } from 'lucide-react';

interface CompareTrayProps {
  onOpenCompare: () => void;
}

export function CompareTray({ onOpenCompare }: CompareTrayProps) {
  const { comparedItems, removeFromCompare, clearCompare, compareError, setCompareError } = useCompare();

  // Auto-dismiss comparison error after 4 seconds
  useEffect(() => {
    if (compareError) {
      const timer = setTimeout(() => {
        setCompareError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [compareError, setCompareError]);

  if (comparedItems.length === 0 && !compareError) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-[92%] sm:max-w-xl pointer-events-none flex flex-col gap-2.5">
      
      {/* Alert Notification above the tray */}
      <AnimatePresence>
        {compareError && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="pointer-events-auto bg-rose-600 border border-rose-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2.5 shadow-xl flex items-center justify-between gap-3 font-sans rounded-none self-center"
            id="compare-limit-toast"
          >
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{compareError}</span>
            </div>
            <button 
              onClick={() => setCompareError(null)}
              className="text-white hover:text-rose-100 transition-colors p-0.5 cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Tray Bar */}
      <AnimatePresence>
        {comparedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="pointer-events-auto bg-slate-950 border border-slate-900 text-white px-4 py-3 sm:py-3.5 shadow-2xl flex items-center justify-between gap-4 rounded-none"
            id="compare-floating-tray"
          >
            {/* Left side: Thumbnails of items */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-slate-400 shrink-0">
                <Columns4 className="w-4 h-4 text-slate-350" />
                <span className="text-[9px] font-extrabold uppercase tracking-widest">Compare</span>
              </div>
              
              <div className="flex items-center gap-2">
                <AnimatePresence mode="popLayout">
                  {comparedItems.map((product) => (
                    <motion.div
                      key={product.id}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-9 h-11 border border-slate-800 bg-slate-900 shrink-0 group"
                      id={`compare-tray-item-${product.id}`}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity" 
                      />
                      {/* Hover action to remove */}
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-500 text-white p-0.5 rounded-full shadow-md z-15 cursor-pointer transition-colors"
                        title={`Remove ${product.name} from comparison`}
                        id={`compare-tray-remove-${product.id}`}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </motion.div>
                  ))}
                  
                  {/* Empty Slot Indicators */}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div 
                      key={`empty-slot-${idx}`} 
                      className="w-9 h-11 border border-dashed border-slate-800 bg-slate-950/20 flex items-center justify-center text-[9px] font-mono text-slate-700 select-none shrink-0"
                    >
                      +
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right side: Compare & Cancel Button actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                id="compare-tray-clear-btn"
                className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                Reset
              </button>
              
              <button
                onClick={onOpenCompare}
                id="compare-tray-submit-btn"
                className="bg-white hover:bg-slate-100 text-slate-950 px-4 py-2 sm:px-5 sm:py-2.5 text-[9px] font-extrabold uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>Assess Specs ({comparedItems.length})</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
