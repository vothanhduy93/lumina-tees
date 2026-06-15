import React, { useState, useEffect } from 'react';
import { Product, Size } from '../types';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ShoppingBag, Minus, Plus, ShieldCheck, Truck, Star } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

const getPreSeededReviews = (productId: string, productName: string): Review[] => {
  const name = productName.toLowerCase();
  
  if (name.includes('white') || name.includes('essential')) {
    return [
      {
        id: `${productId}-r1`,
        author: 'Arnaud L.',
        rating: 5,
        title: 'Minimalist perfection',
        comment: 'This white tee has an incredibly luxurious, heavy yet breathable feel. The crew neck stitch doesn\'t stretch out. Exquisite craftsmanship!',
        date: 'June 10, 2026',
        verified: true,
      },
      {
        id: `${productId}-r2`,
        author: 'Svenja K.',
        rating: 5,
        title: 'True organic quality',
        comment: 'Softest long-staple cotton I have found. The alabaster shade is warm and pairs wonderfully under unstructured linen blazers.',
        date: 'June 03, 2026',
        verified: true,
      },
      {
        id: `${productId}-r3`,
        author: 'Marcus Vance',
        rating: 4,
        title: 'Exceptional fit',
        comment: 'Great drape and length. Love the clean flat-felled shoulder seams. Took stars off only because S runs slightly looser than expected, but fits the premium casual vibe perfectly.',
        date: 'May 28, 2026',
        verified: true,
      }
    ];
  }

  if (name.includes('black') || name.includes('midnight')) {
    return [
      {
        id: `${productId}-r1`,
        author: 'Charlotte Dumont',
        rating: 5,
        title: 'Stays pitch black after months',
        comment: 'Standard black shirts fade so quickly, but this Core Onyx organic dye holds up flawlessly. Fitted look that frames the shoulders.',
        date: 'June 12, 2026',
        verified: true,
      },
      {
        id: `${productId}-r2`,
        author: 'Kenji T.',
        rating: 5,
        title: 'Sartorial daily driver',
        comment: 'An absolute luxury staple. The cotton premium loopback design holds shape without clinging. Ordering two more in XXL.',
        date: 'May 30, 2026',
        verified: true,
      },
      {
        id: `${productId}-r3`,
        author: 'Chloe G.',
        rating: 4,
        title: 'Extremely soft fibers',
        comment: 'Feels incredibly gentle against sensitive skin. Sustainable logistics is a huge plus - arrived in zero-plastic starch bag.',
        date: 'May 15, 2026',
        verified: true,
      }
    ];
  }

  if (name.includes('gray') || name.includes('grey') || name.includes('heather')) {
    return [
      {
        id: `${productId}-r1`,
        author: 'Oliver H.',
        rating: 5,
        title: 'The vintage look I wanted',
        comment: 'Gorgeously pre-washed so there is absolutely no post-drying shrinkage. It has that lived-in texture that drapes gracefully.',
        date: 'June 08, 2026',
        verified: true,
      },
      {
        id: `${productId}-r2`,
        author: 'Elena R.',
        rating: 5,
        title: 'Divine softness',
        comment: 'Wonderful heather texture. It breathes amazingly during warm SF afternoons. 10/10.',
        date: 'May 24, 2026',
        verified: true,
      }
    ];
  }

  if (name.includes('navy')) {
    return [
      {
        id: `${productId}-r1`,
        author: 'David Wu',
        rating: 5,
        title: 'Beautiful dark depth',
        comment: 'Matches perfectly with raw indigo denim. Sophisticated seam borders and sturdy neck ribbing.',
        date: 'June 11, 2026',
        verified: true,
      }
    ];
  }

  if (name.includes('brown') || name.includes('earth')) {
    return [
      {
        id: `${productId}-r1`,
        author: 'Frederik S.',
        rating: 5,
        title: 'Superb structured drape',
        comment: 'Heavyweight organic fabric at its absolute best. Truly premium feel that doesn\'t lose structure. The earth clay tint is very artistic.',
        date: 'June 13, 2026',
        verified: true,
      },
      {
        id: `${productId}-r2`,
        author: 'Amara G.',
        rating: 5,
        title: 'Premium packaging & item',
        comment: 'Feels incredibly substantial. You can tell they put meticulous care into spinning the organic thread. Bio-dye smells clean.',
        date: 'June 05, 2026',
        verified: true,
      }
    ];
  }

  // Fallback reviews
  return [
    {
      id: `${productId}-r1`,
      author: 'Aesthetic Buyer',
      rating: 5,
      title: 'Flawless minimalist finish',
      comment: 'An outstanding tee with high quality stitching and exceptional organic draping.',
      date: 'June 14, 2026',
      verified: true,
    }
  ];
};

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

interface ColorOption {
  name: string;
  bgClass: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  { name: 'Alabaster White', bgClass: 'bg-slate-50 border border-slate-300' },
  { name: 'Core Onyx', bgClass: 'bg-slate-900 border border-slate-800' },
  { name: 'Vintage Grey', bgClass: 'bg-slate-400 border border-slate-500' },
  { name: 'Deep Navy', bgClass: 'bg-[#1e293b] border border-slate-900' },
  { name: 'Earth Clay', bgClass: 'bg-[#78350f] border border-amber-900' }
];

export function QuickViewModal({ product, onClose, products = [], onSelectProduct }: QuickViewModalProps) {
  const { addToCart, setIsOpen } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isQuickBuyAdded, setIsQuickBuyAdded] = useState(false);

  const [activeTab, setActiveTab] = useState<'buy' | 'reviews'>('buy');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Update related products on product change
  useEffect(() => {
    if (!product || !products || products.length === 0) {
      setRelatedProducts([]);
      return;
    }

    const currentCat = product.category || '';
    const sameCategory = products.filter(
      (p) => p.category?.toLowerCase() === currentCat.toLowerCase() && p.id !== product.id && p.status === 'published'
    );
    const otherProducts = products.filter(
      (p) => p.category?.toLowerCase() !== currentCat.toLowerCase() && p.id !== product.id && p.status === 'published'
    );

    const shuffle = (arr: Product[]) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const shuffledSame = shuffle(sameCategory);
    const shuffledOthers = shuffle(otherProducts);

    // Combine same-category first, fallback to others if we have fewer than 3 related products
    const combined = [...shuffledSame, ...shuffledOthers].slice(0, 3);
    setRelatedProducts(combined);
  }, [product, products]);

  // Load reviews on product change
  useEffect(() => {
    if (!product) return;
    const key = `lumina_reviews_${product.id}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        setReviews(JSON.parse(cached));
      } catch (e) {
        setReviews(getPreSeededReviews(product.id, product.name));
      }
    } else {
      const initial = getPreSeededReviews(product.id, product.name);
      localStorage.setItem(key, JSON.stringify(initial));
      setReviews(initial);
    }
  }, [product]);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 5.0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newAuthor.trim() || !newTitle.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `${product.id}-user-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verified: true
    };

    const updated = [...reviews, newRev];
    setReviews(updated);
    localStorage.setItem(`lumina_reviews_${product.id}`, JSON.stringify(updated));

    // Reset writing form
    setIsWritingReview(false);
    setNewRating(5);
    setNewAuthor('');
    setNewTitle('');
    setNewComment('');
  };

  // Auto-detect and pre-select the correct color swatch based on product details
  useEffect(() => {
    if (!product) return;
    
    // Reset states
    setSelectedSize(product.sizes[0] || null);
    setQuantity(1);
    setIsAdded(false);
    setIsQuickBuyAdded(false);
    setIsWritingReview(false);
    setActiveTab('buy');
    setNewRating(5);
    setNewAuthor('');
    setNewTitle('');
    setNewComment('');

    const nameLower = product.name.toLowerCase();
    const skuLower = (product.sku || '').toLowerCase();

    if (nameLower.includes('white') || skuLower.includes('wht')) {
      setSelectedColor('Alabaster White');
    } else if (nameLower.includes('black') || skuLower.includes('blk')) {
      setSelectedColor('Core Onyx');
    } else if (nameLower.includes('gray') || nameLower.includes('grey') || skuLower.includes('gry')) {
      setSelectedColor('Vintage Grey');
    } else if (nameLower.includes('navy') || skuLower.includes('nvy')) {
      setSelectedColor('Deep Navy');
    } else if (nameLower.includes('brown') || skuLower.includes('brn')) {
      setSelectedColor('Earth Clay');
    } else {
      setSelectedColor('Core Onyx');
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
  };

  const handleQuickBuy = () => {
    if (!selectedSize || isQuickBuyAdded) return;
    addToCart(product, selectedSize, quantity);
    setIsQuickBuyAdded(true);
    setTimeout(() => {
      setIsQuickBuyAdded(false);
      setIsOpen(true);
      onClose();
    }, 1200);
  };

  const formattedPrice = formatPrice(typeof product.price === 'number' ? product.price : parseFloat(product.price as any) || 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-label="Close modal" />

      {/* Main container */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        id="quick-view-dialog"
        className="relative bg-white w-full max-w-4xl shadow-2xl rounded-xs border border-slate-100 z-10 max-h-[92vh] overflow-y-auto flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-quickview-btn"
          className="absolute right-4 top-4 z-20 text-slate-400 hover:text-slate-900 bg-white/80 backdrop-blur-xs p-1.5 rounded-full border border-slate-100 shadow-xs hover:scale-105 active:scale-95 transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row w-full shrink-0">

        {/* Left Side: Dynamic Media Viewport */}
        <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-auto md:h-[550px] bg-slate-50 relative shrink-0 overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
          {product.category && (
            <span className="absolute top-4 left-4 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-none shadow-sm">
              {product.category}
            </span>
          )}
        </div>

        {/* Right Side: Description, selections, and purchasing */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[550px]">
          <div>
            {/* Header/Title Block */}
            <div className="mb-4 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider font-semibold uppercase">
                  SKU: {product.sku || 'N/A'}
                </span>
                {product.stock !== undefined && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    • {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
              <h2 id="quick-view-title" className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                {product.name}
              </h2>
              <p className="text-xl font-bold text-slate-950 font-mono mt-1 text-left">
                {formattedPrice}
              </p>
            </div>

            {/* View Selection Tabs */}
            <div className="flex border-b border-slate-100 mb-5 text-[10px] font-bold uppercase tracking-widest gap-6">
              <button
                onClick={() => setActiveTab('buy')}
                className={`pb-2.5 transition-all relative cursor-pointer ${
                  activeTab === 'buy'
                    ? 'text-slate-950 border-b-2 border-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-800'
                }`}
                id="quickview-tab-buy"
              >
                Configure & Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 transition-all relative cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'text-slate-950 border-b-2 border-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-800'
                }`}
                id="quickview-tab-reviews"
              >
                Reviews ({reviews.length})
                <span className="flex items-center text-amber-500 gap-0.5 text-[9px] font-mono font-bold">
                  ★ {averageRating.toFixed(1)}
                </span>
              </button>
            </div>

            {activeTab === 'buy' && (
              <>
                {/* Paragraph Description */}
                <p className="text-xs text-slate-500 leading-relaxed border-t border-b border-slate-100 py-4 mb-4 text-left">
                  {product.description}
                </p>

                {/* Interactive Color selector */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Select Shade
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-900 font-mono">
                      {selectedColor}
                    </span>
                  </div>
                  <div className="flex gap-2.5">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-sm flex items-center justify-center relative cursor-pointer outline-none transition-all ${color.bgClass} ${
                          selectedColor === color.name
                            ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                            : 'hover:scale-105 active:scale-95'
                        }`}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                      >
                        {selectedColor === color.name && (
                          <Check className={`w-3.5 h-3.5 ${color.name === 'Alabaster White' ? 'text-slate-900' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Size Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Select Size
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 font-mono">
                      {selectedSize || 'Required'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex-1 py-2 text-xs font-bold uppercase select-none transition-all cursor-pointer border ${
                          selectedSize === size
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-905'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 pb-6" id="quickview-reviews-list-section">
                {/* Ratings and Stats Card */}
                <div className="bg-slate-50/75 border border-slate-100 p-4 flex items-center justify-between rounded-sm">
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xl font-extrabold text-slate-950 font-mono">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                        / 5.0
                      </span>
                    </div>
                    <div className="flex gap-0.5 my-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(averageRating) ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider text-left">
                      Based on {reviews.length} customer reviews
                    </p>
                  </div>

                  {/* Mini Rating bar charts */}
                  <div className="hidden sm:block text-right w-1/2 space-y-1 text-[9px] font-mono text-slate-500">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-6 text-right leading-none">{star} ★</span>
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-5 text-right leading-none">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Write a Review Button and Form Toggle */}
                {!isWritingReview ? (
                  <button
                    onClick={() => setIsWritingReview(true)}
                    className="w-full h-10 border border-dashed border-slate-300 hover:border-slate-800 text-slate-650 hover:text-slate-950 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-xs bg-slate-50/50 hover:bg-slate-50"
                    id="write-review-toggle-btn"
                  >
                    <span>+</span> Share Your Experience
                  </button>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="border border-slate-200 p-4 space-y-4 rounded-sm bg-slate-50/30 text-left" id="quickview-add-review-form">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 pb-1.5 border-b border-slate-100">
                      Submit Your Feedback
                    </h4>
                    
                    {/* Star Selector */}
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="hover:scale-110 active:scale-95 transition-transform cursor-pointer text-slate-200"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              className={`w-5 h-5 ${(hoverRating || newRating) >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name and Title Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Alexandra M."
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 focus:border-slate-900 outline-none text-xs rounded-none bg-white font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Review Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Luxurious drape!"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 focus:border-slate-900 outline-none text-xs rounded-none bg-white font-sans"
                        />
                      </div>
                    </div>

                    {/* Comment field */}
                    <div>
                      <label className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Comments</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Meticulously critique the weight, fit, stitch craftsmanship..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 focus:border-slate-900 outline-none text-xs rounded-none bg-white leading-relaxed font-sans"
                      />
                    </div>

                    {/* Actions buttons */}
                    <div className="flex gap-2.5 pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[9px] cursor-pointer shadow-sm"
                      >
                        Publish Review
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsWritingReview(false);
                          setNewRating(5);
                          setNewAuthor('');
                          setNewTitle('');
                          setNewComment('');
                        }}
                        className="px-4 py-2 border border-slate-200 hover:border-slate-450 text-slate-500 hover:text-slate-950 font-bold uppercase tracking-widest text-[9px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Scrollable Reviews List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 text-left" id="quick-view-reviews-container">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 italic text-[11px]">
                      No reviews submitted yet. Feel welcomed to write the first review!
                    </div>
                  ) : (
                    [...reviews].reverse().map((r) => (
                      <div key={r.id} className="p-4 border border-slate-100 bg-slate-50/40 rounded-sm flex flex-col gap-1 text-left">
                        <div className="flex items-center justify-between font-sans">
                          <span className="text-[11px] font-bold text-slate-800">{r.author}</span>
                          <span className="text-[9px] font-mono text-slate-400">{r.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 my-0.5">
                          <div className="flex gap-0.5 text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < r.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-205 text-slate-100'
                                }`}
                              />
                            ))}
                          </div>
                          {r.verified && (
                            <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-100/50 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold flex items-center">
                              Verified Buyer
                            </span>
                          )}
                        </div>

                        <h5 className="text-[11px] font-bold text-slate-900 mt-1 uppercase tracking-tight">
                          {r.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium mt-0.5">
                          {r.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {activeTab === 'buy' && (
            <div>
              <div className="flex items-center gap-4 mb-3 border-t border-slate-100 pt-5">
                <div className="flex items-center border border-slate-200 h-11 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 h-full hover:bg-slate-100 text-slate-650 transition-colors flex items-center justify-center cursor-pointer"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center font-bold font-mono text-[13px] text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 h-full hover:bg-slate-100 text-slate-650 transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!selectedSize || isAdded}
                  id="add-to-cart-quickview-btn"
                  className={`flex-1 h-11 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                    isAdded
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : !selectedSize
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-900 border border-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add To Bag
                    </>
                  )}
                </button>
              </div>

              {/* Quick Buy Button */}
              <div className="relative overflow-visible w-full mb-5">
                <button
                  onClick={handleQuickBuy}
                  disabled={!selectedSize || isQuickBuyAdded}
                  id="quick-buy-btn"
                  className={`w-full h-11 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs border ${
                    isQuickBuyAdded
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : !selectedSize
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {isQuickBuyAdded ? (
                    <>
                      ⚡ Quick Adding...
                    </>
                  ) : (
                    <>
                      ⚡ Quick Buy
                    </>
                  )}
                </button>

                {/* Floating Feedback Animation */}
                <AnimatePresence>
                  {isQuickBuyAdded && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], 
                        y: [-12, -45, -55, -60], 
                        scale: [0.8, 1.05, 1, 0.9] 
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 1.1, 
                        times: [0, 0.15, 0.8, 1],
                        ease: "easeOut" 
                      }}
                      className="absolute left-1/2 -translate-x-1/2 bottom-full pointer-events-none z-30"
                      id="quick-buy-floating-animation"
                    >
                      <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-500 font-sans font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                        <Check className="w-3.5 h-3.5" /> Added +{quantity}!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dynamic Shipping/Guarantee Notices */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-[10px] text-slate-400 uppercase tracking-wider font-bold text-left">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Complimentary priority worldwide courier dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Uncompromising quality: organic loopback textile finish</span>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-100 p-6 md:p-8 bg-slate-50/50 text-left" id="quickview-related-section">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((related) => {
                const priceFormatted = formatPrice(related.price);
                return (
                  <button
                    key={related.id}
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(related);
                      }
                    }}
                    className="group flex flex-col text-left focus:outline-none focus:ring-1 focus:ring-slate-900 focus:ring-offset-2 rounded-xs overflow-hidden transition-all duration-300 w-full bg-white border border-slate-100 hover:border-slate-300 hover:shadow-xs cursor-pointer"
                    aria-label={`View ${related.name}`}
                  >
                    <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative w-full">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {related.category && (
                        <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5">
                          {related.category}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors">
                        {related.name}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-550 font-mono mt-1">
                        {priceFormatted}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
