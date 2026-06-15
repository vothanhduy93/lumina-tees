import React, { useState } from 'react';
import { Product, Size } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Heart, GitCompare } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { formatPrice } = useCurrency();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const isSaved = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card or image clicks
    if (!selectedSize) return;
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 50, y: 50 });
      }}
    >
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 50, y: 50 })}
        className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-4 cursor-zoom-in"
      >
        <motion.img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover origin-center"
          animate={{ 
            scale: isHovered ? 1.25 : 1,
            x: isHovered ? `${(50 - mousePos.x) * 0.25}%` : '0%',
            y: isHovered ? `${(50 - mousePos.y) * 0.25}%` : '0%'
          }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        />

        {/* Badge overlays */}
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 items-start">
          {product.isNew && (
            <span 
              className="bg-slate-900 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 shadow-sm font-sans"
              id={`badge-new-${product.id}`}
            >
              New
            </span>
          )}
          {product.isBestseller && (
            <span 
              className="bg-amber-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 shadow-sm font-sans"
              id={`badge-bestseller-${product.id}`}
            >
              Bestseller
            </span>
          )}
        </div>

        {/* Heart Wishlist Overlay Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-slate-100 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          id={`wishlist-btn-${product.id}`}
        >
          <Heart className={`w-4 h-4 transition-colors ${
            isSaved 
              ? 'fill-rose-500 text-rose-500' 
              : 'text-slate-500 hover:text-rose-500'
          }`} />
        </button>

        {/* Compare Specification Overlay Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product);
          }}
          className={`absolute top-14 right-3 z-30 p-2.5 rounded-full shadow-sm border opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center ${
            isCompared
              ? 'bg-slate-905 border-slate-950 text-white hover:bg-slate-800'
              : 'bg-white/95 backdrop-blur-sm border-slate-100 text-slate-500 hover:bg-white hover:text-slate-900'
          }`}
          aria-label={isCompared ? "Remove from comparison matrix" : "Add to comparison matrix"}
          id={`compare-btn-${product.id}`}
          title={isCompared ? "Remove from comparison matrix" : "Add to comparison matrix"}
        >
          <GitCompare className="w-4 h-4" />
        </button>
        
        {/* Modern "Quick View" Center Label on hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/95 text-slate-905 text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 shadow-md border border-slate-100 hover:bg-slate-900 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
            Quick View
          </span>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 inset-x-4 z-10"
              onClick={(e) => e.stopPropagation()} // Stop modal from triggering on inner clicks
            >
              <div className="bg-white p-3 shadow-sm border border-slate-200 flex flex-col gap-3">
                <div className="flex justify-between gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-none transition-colors border ${
                        selectedSize === size 
                          ? 'bg-slate-900 text-white border-slate-900' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!selectedSize}
                  className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${
                    added 
                      ? 'bg-green-600 text-white' 
                      : !selectedSize
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {added ? (
                    <><Check className="w-3 h-3" /> Added</>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-sm font-medium text-slate-900">{product.name}</h4>
          <p className="text-xs text-slate-400 italic mt-0.5 line-clamp-1">{product.description}</p>
        </div>
        <span className="text-sm font-bold text-slate-900 shrink-0">
          {formatPrice(typeof product.price === 'number' ? product.price : parseFloat(product.price as any) || 0)}
        </span>
      </div>
    </motion.div>
  );
}
