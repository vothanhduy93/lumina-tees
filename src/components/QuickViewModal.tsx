import React, { useState, useEffect } from 'react';
import { Product, Size } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { X, Check, ShoppingBag, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
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

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, setIsOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  // Auto-detect and pre-select the correct color swatch based on product details
  useEffect(() => {
    if (!product) return;
    
    // Reset states
    setSelectedSize(product.sizes[0] || null);
    setQuantity(1);
    setIsAdded(false);

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
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
    setIsOpen(true);
    onClose();
  };

  const formattedPrice = (typeof product.price === 'number' ? product.price : parseFloat(product.price as any) || 0).toFixed(2);

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
        className="relative bg-white w-full max-w-4xl shadow-2xl rounded-xs overflow-hidden flex flex-col md:flex-row border border-slate-100 z-10"
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
            <div className="mb-4">
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
              <p className="text-xl font-bold text-slate-950 font-mono mt-1">
                ${formattedPrice}
              </p>
            </div>

            {/* Paragraph Description */}
            <p className="text-xs text-slate-500 leading-relaxed border-t border-b border-slate-100 py-4 mb-4">
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
          </div>          {/* Purchasing Controls */}
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
            <button
              onClick={handleQuickBuy}
              disabled={!selectedSize}
              id="quick-buy-btn"
              className={`w-full h-11 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs mb-5 border ${
                !selectedSize
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
            >
              ⚡ Quick Buy
            </button>

            {/* Dynamic Shipping/Guarantee Notices */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
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
        </div>
      </motion.div>
    </div>
  );
}
