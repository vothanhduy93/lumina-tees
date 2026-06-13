import React from 'react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from './ProductCard';
import { motion } from 'motion/react';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';

interface SavedViewProps {
  onBack: () => void;
  onQuickView: (product: Product) => void;
}

export function SavedView({ onBack, onQuickView }: SavedViewProps) {
  const { savedItems, clearWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 flex-1 flex flex-col">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-5 border-b border-slate-100">
        <div>
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Collection
          </button>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-slate-900">Saved Items</h1>
          <p className="text-sm text-slate-400 mt-1">
            {savedItems.length === 0 
              ? 'Keep track of products you love' 
              : `You have saved ${savedItems.length} ${savedItems.length === 1 ? 'item' : 'items'}`
            }
          </p>
        </div>

        {savedItems.length > 0 && (
          <button 
            onClick={clearWishlist}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 hover:text-rose-800 transition-colors border border-rose-100 hover:border-rose-200 px-4 py-2.5 bg-rose-50/20 cursor-pointer"
            id="clear-wishlist-button"
          >
            <Trash2 className="w-4 h-4" />
            Clear Wishlist
          </button>
        )}
      </div>

      {/* Grid or Empty State Container */}
      <div className="flex-1 flex flex-col">
        {savedItems.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          >
            {savedItems.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={onQuickView} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 mb-6">
              <Heart className="w-6 h-6 text-slate-400" />
            </div>
            <h2 className="text-xl font-medium text-slate-900 mb-2">No Saved Items</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-xs">
              Explore our core collection and click the heart icon on any product to save it here for later.
            </p>
            <button 
              onClick={onBack}
              className="bg-slate-900 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              id="wishlist-explore-btn"
            >
              Explore Collection
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
