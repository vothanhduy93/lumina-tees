import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, ArrowRight, Truck, ShieldCheck, HeartPulse } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'shipping' | 'materials' | 'returns';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  // Shipping & Delivery
  {
    id: 'faq-ship-1',
    category: 'shipping',
    question: 'What shipping options do you offer and how long does it take?',
    answer: 'We offer complimentary standard shipping on all orders over $75. Standard shipping typically takes 3 to 7 business days. Express shipping is available at checkout for guaranteed 1-3 business day delivery.'
  },
  {
    id: 'faq-ship-2',
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship globally to over 50 countries. International transit times vary from 7 to 14 business days depending on customs clearance. Import duties and taxes are dynamically calculated at checkout.'
  },
  {
    id: 'faq-ship-3',
    category: 'shipping',
    question: 'How can I track my shipment?',
    answer: 'Once your shipping label is generated, you will automatically receive a tracking link via email to monitor your package\'s transit journey in real-time, from our organic textile facility straight to your door.'
  },
  // Materials & Care
  {
    id: 'faq-mat-1',
    category: 'materials',
    question: 'What materials are your t-shirts crafted from?',
    answer: 'All our tees are made of 100% GOTS-certified organic cotton. Our heavier products feature a structured 300GSM heavy-knit weave, while our daily essentials are made of a hyper-breathable, silky-soft 180GSM cotton.'
  },
  {
    id: 'faq-mat-2',
    category: 'materials',
    question: 'How should I wash and care for my shirts to maintain drape and fit?',
    answer: 'We recommend carding or machine washing cold with similar colors and mild detergent, turned inside out. Flat air drying or tumble dry on low is recommended. Our fabrics are pre-shrunk, but proper wash care preserves premium drape longevity.'
  },
  {
    id: 'faq-mat-3',
    category: 'materials',
    question: 'Are your dyes and production processes safe and ethical?',
    answer: 'Absolutely. We partner exclusively with OEKO-TEX certified millers using non-toxic, eco-friendly low-impact dyes. Our manufacturing facilities are audited regularly to guarantee fair liveable wages, safe workplaces, and clean recycling of wastewater.'
  },
  // Returns & Exchanges
  {
    id: 'faq-ret-1',
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We accept returns of unworn, unaltered, and unwashed items with original packaging and tags attached within 30 days of delivery. Returns are completely free for all domestic orders. Original shipping fees are non-refundable.'
  },
  {
    id: 'faq-ret-2',
    category: 'returns',
    question: 'Do you offer direct size exchanges?',
    answer: 'Yes. If you need a different size or color of an item you ordered, you can easily initiate a direct replacement exchange through our online checkout and order look-up screen, or simply contact our support email.'
  },
  {
    id: 'faq-ret-3',
    category: 'returns',
    question: 'How long does it take to process my refund?',
    answer: 'Once your returned package is received and inspected at our fulfillment hub, refunds are issued back to the original payment method within 5 to 10 business days.'
  }
];

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'shipping' | 'materials' | 'returns'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredItems = FAQ_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq-section" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-16 border-t border-slate-100">
      {/* Accordion Layout Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1px] w-6 bg-slate-400"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Support & Guidance</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Detailed information about standard shipping timelines, transparent material tracing, organic certifications, and return procedures.
          </p>
        </div>

        {/* Dynamic Live Filter Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none transition-all uppercase tracking-wider placeholder:text-slate-400"
            id="faq-search-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Category Navigation Pills & Quick Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none border-b border-slate-100 lg:border-none">
            <button
              onClick={() => { setActiveCategory('all'); setExpandedId(null); }}
              id="faq-cat-all"
              className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-3 ${
                activeCategory === 'all'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>All Questions</span>
            </button>
            <button
              onClick={() => { setActiveCategory('shipping'); setExpandedId(null); }}
              id="faq-cat-shipping"
              className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-3 ${
                activeCategory === 'shipping'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipping & Delivery</span>
            </button>
            <button
              onClick={() => { setActiveCategory('materials'); setExpandedId(null); }}
              id="faq-cat-materials"
              className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-3 ${
                activeCategory === 'materials'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Materials & Care</span>
            </button>
            <button
              onClick={() => { setActiveCategory('returns'); setExpandedId(null); }}
              id="faq-cat-returns"
              className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-3 ${
                activeCategory === 'returns'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Returns & Exchanges</span>
            </button>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-slate-50 border border-slate-100 p-5 hidden lg:block rounded-none">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-2">Need Direct Support?</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Can't find your specific question? Reach out to our dedicated client services team.
            </p>
            <a 
              href="mailto:support@luminatees.com"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:translate-x-1 transition-transform"
            >
              Email Customer Care <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Column: Expandable Accordion List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`border ${
                      isExpanded ? 'border-slate-900 bg-slate-50/50' : 'border-slate-200 bg-white hover:border-slate-400'
                    } transition-colors duration-200`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full text-left px-5 sm:px-6 py-4 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                      aria-expanded={isExpanded}
                      id={`faq-btn-${faq.id}`}
                    >
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-900">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="text-slate-400 shrink-0 select-none"
                      >
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-5 pt-1 text-xs text-slate-650 leading-relaxed border-t border-slate-100/80">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border border-dashed border-slate-200"
              >
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">No matching FAQs found</p>
                <button
                  type="button"
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  className="text-xs font-bold uppercase tracking-widest text-slate-900 hover:underline"
                >
                  Clear search & filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
