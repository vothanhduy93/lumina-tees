import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Sparkles, Truck, Gift } from 'lucide-react';

export function PromoBanner() {
  const { formatPrice } = useCurrency();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const messages = [
    {
      text: `Complimentary carbon-neutral shipping on orders over ${formatPrice(100)}`,
      icon: Truck,
    },
    {
      text: "Lumina premium organic membership: Enter code LUMINA10 for 10% off",
      icon: Gift,
    },
    {
      text: "Crafted with 100% certified organic long-staple fibers & bio-dyes",
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    if (isPaused || !isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, isVisible, messages.length]);

  if (!isVisible) return null;

  const currentPromo = messages[currentIndex];
  const PromoIcon = currentPromo.icon;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <div 
      id="promo-banner-container"
      className="bg-slate-950 text-white border-b border-white/5 relative z-50 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto h-9 px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-medium font-sans">
        
        {/* Left Arrow Controls */}
        <button 
          onClick={handlePrev}
          className="p-1 hover:text-slate-350 transition-colors cursor-pointer hidden sm:flex items-center"
          aria-label="Previous promotional message"
          id="promo-banner-prev"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Message Container with CSS transitions & motion */}
        <div className="flex-1 flex justify-center items-center overflow-hidden h-full relative px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="flex items-center gap-2 text-center"
              id={`promo-banner-message-${currentIndex}`}
            >
              <PromoIcon className="w-3.5 h-3.5 text-slate-350 shrink-0" />
              <span className="text-slate-200">
                {currentPromo.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow + Close Control */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleNext}
            className="p-1 hover:text-slate-350 transition-colors cursor-pointer hidden sm:flex items-center"
            aria-label="Next promotional message"
            id="promo-banner-next"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <span className="h-3 w-px bg-white/10 hidden sm:block" />

          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:text-slate-350 transition-colors cursor-pointer flex items-center"
            aria-label="Dismiss banner"
            id="promo-banner-close"
          >
            <X className="w-3 h-3 text-slate-400 hover:text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}
