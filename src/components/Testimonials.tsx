import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Plus, Award, Check, Filter, Trash2, HelpCircle } from 'lucide-react';

interface TooltipState {
  rating: number;
  count: number;
  percentage: number;
  x: number;
  y: number;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  avatarColor: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Sarah Jenkins',
    rating: 5,
    comment: 'The Classic White Essential is absolute perfection. It has correct fabric density, does not shrink, and has incredibly clean stitching details. Holds its architectural drape perfectly through washes.',
    date: '2026-05-18',
    verified: true,
    avatarColor: 'bg-indigo-100 text-indigo-700'
  },
  {
    id: 'rev-2',
    name: 'Marcus Vance',
    rating: 5,
    comment: 'Midnight Black Crew has a wonderful heavy weight and organic drape. A masterpiece in simple streetwear. Will definitely replace my entire wardrobe with these.',
    date: '2026-05-30',
    verified: true,
    avatarColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 'rev-3',
    name: 'Elena Rostova',
    rating: 4,
    comment: 'Exceptional texture on the Earth Tone Brown. Feels breathable but premium. The custom cotton weave feels robust. Wish shipping was a tiny bit faster to Europe, but worth the wait.',
    date: '2026-06-02',
    verified: true,
    avatarColor: 'bg-amber-105 text-amber-700'
  },
  {
    id: 'rev-4',
    name: 'Chloe DuPont',
    rating: 4,
    comment: 'Ultra minimal and sophisticated. Very high-grade double stitch collar that doesn\'t sag. Bought two graphic tees and they are beautiful art pieces.',
    date: '2026-06-04',
    verified: true,
    avatarColor: 'bg-rose-100 text-rose-700'
  },
  {
    id: 'rev-5',
    name: 'Oliver Finch',
    rating: 3,
    comment: 'Structure is amazing, but it fits a bit longer and boxier than expected. Order a size down if you prefer a classic, slim-fit silhouette.',
    date: '2026-06-08',
    verified: false,
    avatarColor: 'bg-slate-100 text-slate-700'
  },
  {
    id: 'rev-6',
    name: 'David Kim',
    rating: 5,
    comment: 'Vintage Heather Gray has beautiful fleck texture and extreme softness. Perfect luxury heavyweight option. The customer support was top tier!',
    date: '2026-06-11',
    verified: true,
    avatarColor: 'bg-blue-100 text-blue-700'
  }
];

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  
  // Submit Review Form States
  const [formOpen, setFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formComment, setFormComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Compute stats on current reviews
  const stats = useMemo(() => {
    const total = reviews.length;
    const initialCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const counts = reviews.reduce((acc, curr) => {
      const r = curr.rating as 1 | 2 | 3 | 4 | 5;
      if (acc[r] !== undefined) acc[r]++;
      return acc;
    }, initialCounts as Record<1 | 2 | 3 | 4 | 5, number>);

    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = total > 0 ? sum / total : 0;

    return {
      total,
      average,
      counts
    };
  }, [reviews]);

  // Handle Form Submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-105 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-purple-100 text-purple-700',
      'bg-sky-100 text-sky-700'
    ];
    const borderRandomColor = colors[Math.floor(Math.random() * colors.length)];

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: formName.trim(),
      rating: formRating,
      comment: formComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true,
      avatarColor: borderRandomColor
    };

    setReviews([newReview, ...reviews]);
    setFormSuccess(true);
    setFormName('');
    setFormComment('');
    setFormRating(5);
    
    setTimeout(() => {
      setFormSuccess(false);
      setFormOpen(false);
    }, 1800);
  };

  // Filtered reviews to display
  const displayedReviews = useMemo(() => {
    if (selectedRatingFilter === null) return reviews;
    return reviews.filter(r => r.rating === selectedRatingFilter);
  }, [reviews, selectedRatingFilter]);

  // Max value of any rating bar to draw proportionally in the chart
  const maxCount = useMemo(() => {
    const values = Object.values(stats.counts);
    return Math.max(...values, 1);
  }, [stats]);

  // Click on bar handler to toggle filter
  const handleBarClick = (rating: number) => {
    if (selectedRatingFilter === rating) {
      setSelectedRatingFilter(null); // Toggle off
    } else {
      setSelectedRatingFilter(rating); // Filter by this
    }
  };

  return (
    <section id="reviews-section" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-16 border-t border-slate-100">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1px] w-6 bg-slate-400"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tested & Approved</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">
            Customer Journal & Ratings
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Real feedback from our worldwide community on structure, drape, wash endurance, and overall wearability of Lumina cotton cuts.
          </p>
        </div>

        {/* Call to action for adding a review */}
        <button
          onClick={() => setFormOpen(!formOpen)}
          id="add-journal-review-btn"
          className="flex items-center gap-2 px-5 py-3 border border-slate-205 text-xs font-bold uppercase tracking-widest bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 cursor-pointer transition-all shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Write a Review Drawer/Form */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-12 border border-slate-150 bg-slate-50/50 p-6 md:p-8 rounded-sm"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">
                Share Wear Experience
              </h3>

              {formSuccess ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold uppercase text-slate-800">Review Submitted</h4>
                  <p className="text-xs text-slate-500 mt-2">Thank you! Your experience has been added to our global ratings journal.</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Liam Taylor"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-2 text-sm bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Rating</label>
                      <div className="flex items-center h-10 gap-1 bg-white border border-slate-200 px-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 cursor-pointer hover:scale-110 transition-transform"
                            aria-label={`Rate ${star} Stars`}
                          >
                            <Star
                              className={`w-5 h-5 transition-all ${
                                star <= (hoverRating ?? formRating)
                                  ? 'fill-amber-400 text-amber-400 scale-105'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Review Comment</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Comment on fit, fabric weight, stitch details, or color depth..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full px-4 py-2 text-sm bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all rounded-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-sm"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel grid: Left side has Summary & Bar charts, right side has filtered testimonials list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Score & Interactive Rating Bar Chart (Data Visualization) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              Ratings Summary
            </h3>

            {/* Absolute Score Display */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-extrabold text-slate-900 font-mono tracking-tighter">
                {stats.average === 0 ? '0.0' : stats.average.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5 items-center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= Math.round(stats.average);
                    return (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          filled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-450 mt-1">
                  Based on {stats.total} Community Reviews
                </p>
              </div>
            </div>

            {/* Custom Interactive Ratings Bar Chart Data Visualization */}
            <p className="text-[10px] text-slate-400 font-medium mb-3">
              * Click any bar to isolate ratings and read matching feedback.
            </p>

            <div className="space-y-3.5 relative">
              {/* Tooltip implementation */}
              <AnimatePresence>
                {tooltip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      left: `${tooltip.x}%`,
                      top: `${tooltip.y - 35}px`,
                      transform: 'translateX(-50%)',
                    }}
                    className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm z-20 pointer-events-none shadow-md border border-slate-700/50 flex flex-col text-center"
                  >
                    <span>{tooltip.count} {tooltip.count === 1 ? 'review' : 'reviews'}</span>
                    <span className="text-[8px] opacity-75 font-mono">({tooltip.percentage.toFixed(0)}%)</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Draw bars from 5 stars down to 1 star */}
              {([5, 4, 3, 2, 1] as const).map((rating) => {
                const count = stats.counts[rating];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const isFilteredActive = selectedRatingFilter === rating;

                return (
                  <div
                    key={rating}
                    onClick={() => handleBarClick(rating)}
                    className="group flex items-center gap-3 cursor-pointer select-none"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      // Place tooltip above the bar center
                      setTooltip({
                        rating,
                        count,
                        percentage,
                        x: Math.min(Math.max(percentage * 0.7, 15), 85),
                        y: (5 - rating) * 44 + 20
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {/* Star Label */}
                    <div className="w-12 text-[10px] font-bold uppercase tracking-wider font-mono text-slate-455 flex items-center justify-between shrink-0">
                      <span>{rating}</span>
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />
                    </div>

                    {/* Bar visualization container */}
                    <div className="flex-1 h-6 bg-slate-50 border border-slate-100 hover:border-slate-205 transition-colors relative flex items-center overflow-hidden">
                      {/* Animated rating bar */}
                      <motion.div
                        className={`h-full opacity-90 transition-all ${
                          isFilteredActive
                            ? 'bg-slate-905 ring-1 ring-inset ring-slate-950'
                            : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                      
                      {/* Subdued text indicator for values inside the bar */}
                      {count > 0 && (
                        <span className="absolute right-2 text-[9px] font-bold font-mono text-slate-500">
                          {count}
                        </span>
                      )}
                    </div>

                    {/* Percentage label */}
                    <div className="w-10 text-right text-[10px] font-semibold font-mono text-slate-400">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-105 pt-6 mt-8 space-y-3">
            <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <Award className="w-4 h-4 text-slate-900" />
              <span>Tested by certified fabric auditors</span>
            </div>
            <p className="text-xs text-slate-400">
              Every garment piece has been examined for shrinkage tolerances, warp-and-weft bias distortion, and washfastness endurance.
            </p>
          </div>
        </div>

        {/* Right Side: Segmented / Filtered Customer Testimonials Display */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Community Journal Entry Logs</span>
              </h3>
              
              {/* Show Active Rating Filters & Clear control */}
              {selectedRatingFilter !== null && (
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-700">
                  <Filter className="w-3 h-3 text-slate-500" />
                  <span>Isolating: {selectedRatingFilter} Stars</span>
                  <button
                    onClick={() => setSelectedRatingFilter(null)}
                    className="ml-1 text-slate-400 hover:text-slate-900 focus:outline-none cursor-pointer"
                    title="Remove filter"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Feedback items panel */}
            <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {displayedReviews.length > 0 ? (
                  displayedReviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="border-b border-slate-100/60 pb-6 last:border-0 relative group"
                    >
                      {/* Post Header */}
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex items-center gap-3">
                          {/* Colored Initial Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold uppercase shrink-0 font-sans shadow-xs ${review.avatarColor}`}>
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900 uppercase">
                                {review.name}
                              </h4>
                              {review.verified && (
                                <span className="bg-slate-100 text-slate-500 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-none">
                                  Verified Wearer
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
                              {review.date}
                            </span>
                          </div>
                        </div>

                        {/* Star Value */}
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Content text */}
                      <p className="text-xs text-slate-500 leading-relaxed font-sans pl-11">
                        "{review.comment}"
                      </p>

                      {/* Subtle custom log delete to allow users to clean up custom submitted reviews (craft enhancement) */}
                      {review.id.startsWith('rev-1') === false && 
                        review.id.startsWith('rev-2') === false && 
                        review.id.startsWith('rev-3') === false && 
                        review.id.startsWith('rev-4') === false && 
                        review.id.startsWith('rev-5') === false && 
                        review.id.startsWith('rev-6') === false && (
                          <button
                            onClick={() => {
                              setReviews(reviews.filter(r => r.id !== review.id));
                            }}
                            className="absolute right-0 bottom-4 opacity-0 group-hover:opacity-100 text-slate-350 hover:text-rose-500 cursor-pointer p-1 transition-all"
                            title="Delete custom review entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center text-slate-450 flex flex-col items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-8 h-8 text-slate-200" />
                    <p className="text-xs font-bold uppercase tracking-wider">No matching logs found</p>
                    <button
                      onClick={() => setSelectedRatingFilter(null)}
                      className="text-xs text-slate-900 border-b border-slate-900 pb-0.5 font-bold uppercase tracking-wider mt-2 hover:opacity-75"
                    >
                      Reset Filter
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-slate-50 p-4 border border-slate-150 inline-flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center mt-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Wear Guarantee Guarantee Program
            </span>
            <span className="text-[10px] text-slate-950 font-mono font-bold">
              365-DAY COLLAR REINFORCEMENT COVERAGE
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}
