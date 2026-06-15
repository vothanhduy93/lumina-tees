import React from 'react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { motion } from 'motion/react';
import { X, ShoppingBag, Trash2, Eye, Info, Check, Sparkles } from 'lucide-react';
import { Size } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickView?: (product: any) => void;
}

export function CompareModal({ isOpen, onClose, onQuickView }: CompareModalProps) {
  const { comparedItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [addedItemIds, setAddedItemIds] = React.useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Helper to extract styled attributes from the product item
  const getProductSpecs = (product: any) => {
    const nameLower = product.name.toLowerCase();
    const descLower = product.description.toLowerCase();

    // 1. Material
    let material = "100% GOTS Organic Cotton";
    if (descLower.includes("tri-blend") || descLower.includes("blend")) {
      material = "Super-solf Organic Tri-blend (50% Cotton, 38% Polyester, 12% Rayon)";
    } else if (descLower.includes("300gsm") || nameLower.includes("heavy")) {
      material = "Ultra-Dense 300GSM GOTS Organic Cotton";
    } else if (descLower.includes("slub")) {
      material = "Premium Organic Slub Cotton";
    }

    // 2. Color / Finish
    let color = "Natural Untreated";
    if (nameLower.includes("white")) color = "Classic Studio White";
    else if (nameLower.includes("black")) color = "Midnight Charcoal Black";
    else if (nameLower.includes("sage") || descLower.includes("sage")) color = "Desert Dusty Sage";
    else if (nameLower.includes("gray") || nameLower.includes("grey") || descLower.includes("gray")) color = "Heather Slate Gray";
    else if (nameLower.includes("navy")) color = "Deep Marine Navy";
    else if (nameLower.includes("olive")) color = "Warm Olive/Khaki";
    else if (nameLower.includes("sand") || descLower.includes("sand")) color = "Warm Mojave Sand";
    else {
      // Extract first capitalized word or default
      const colors = ["Sage", "Black", "White", "Gray", "Rose", "Teal", "Sand", "Navy"];
      const matched = colors.find(c => nameLower.includes(c.toLowerCase()));
      color = matched ? `${matched} Dyed` : "Custom Organic Pigment";
    }

    // 3. Weight & Fit
    let fitWeight = "Regular Daily Wear (180GSM)";
    if (descLower.includes("300gsm") || nameLower.includes("heavy") || descLower.includes("dense")) {
      fitWeight = "Structured Heavier-Knit Fit (300GSM)";
    } else if (descLower.includes("loose") || descLower.includes("oversized") || descLower.includes("relaxed")) {
      fitWeight = "Relaxed Organic Fit (200GSM)";
    }

    // 4. Traceability/Sustainability
    let ecoRating = "Standard Carbon-Neutral Logistics";
    if (descLower.includes("sustainable") || descLower.includes("pre-washed")) {
      ecoRating = "Pre-Washed & Water-Conserving Finish";
    } else if (nameLower.includes("sage") || descLower.includes("desert")) {
      ecoRating = "Closed-loop Water-recycled Plant Eco-dye";
    } else {
      ecoRating = "100% Non-toxic Organic Process";
    }

    return { material, color, fitWeight, ecoRating };
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    // Use first available size to make quick purchase simple from comparison modal
    const defaultSize: Size = product.sizes[0] || 'M';
    addToCart(product, defaultSize);
    
    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      id="compare-modal-backdrop"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 shadow-2xl rounded-none w-full max-w-6xl overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        id="compare-modal-container"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-slate-800" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Premium Evaluation Matrix</span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-slate-950 flex items-center gap-2">
              Compare Selected Products <span className="text-xs bg-slate-200 border text-slate-900 px-2 py-0.5 font-mono">{comparedItems.length}/3</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {comparedItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                id="compare-clear-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Close Comparison modal"
              id="compare-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-auto flex-1 p-6">
          {comparedItems.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 mb-4 rounded-full">
                <Info className="w-6 h-6 text-slate-450" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">No items selected for comparison</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
                Add t-shirts first from our product list to compare weave density, organic dyes, measurements, and sustainability records side-by-side.
              </p>
              <button 
                onClick={onClose}
                className="bg-slate-900 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
                id="compare-return-to-shop"
              >
                Back to product gallery
              </button>
            </div>
          ) : (
            <div className="min-w-[650px] lg:min-w-0">
              {/* Product Comparison side-by-side grid */}
              <div className="grid grid-cols-12 gap-4 border-b border-slate-100 pb-6 mb-6">
                {/* Labels Column (Span 3) */}
                <div className="col-span-3 flex flex-col justify-end pb-4 font-sans text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  <span>Product Specs</span>
                </div>

                {/* Items Columns */}
                {comparedItems.map((product) => (
                  <div key={product.id} className={`${comparedItems.length === 1 ? 'col-span-9' : comparedItems.length === 2 ? 'col-span-4.5' : 'col-span-3'} group relative border border-slate-100 bg-slate-50/20 p-3`}>
                    
                    {/* Tiny Absolute Trash Action */}
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-white border border-slate-100 text-slate-450 hover:text-rose-600 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      title="Remove from comparison list"
                      id={`compare-remove-${product.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Image Viewport */}
                    <div className="aspect-[3/4] overflow-hidden mb-4 bg-slate-100 relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/60 to-transparent p-3 flex flex-wrap gap-1">
                        {product.isNew && (
                          <span className="bg-slate-900 text-white border border-white/20 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">New</span>
                        )}
                        {product.isBestseller && (
                          <span className="bg-amber-600 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">Bestseller</span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold uppercase text-slate-900 line-clamp-1 mb-1">{product.name}</h4>
                    <p className="text-xs font-bold text-slate-900 mb-3">{formatPrice(product.price || 0)}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        id={`compare-add-cart-${product.id}`}
                        className={`flex-1 ${
                          addedItemIds[product.id] ? 'bg-green-600' : 'bg-slate-905 hover:bg-slate-800'
                        } text-white py-2 px-3 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5`}
                      >
                        {addedItemIds[product.id] ? (
                          <>
                            <Check className="w-3 h-3" />
                            Added (Size M)
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            Add Standard (M)
                          </>
                        )}
                      </button>
                      
                      {onQuickView && (
                        <button
                          onClick={() => { onClose(); onQuickView(product); }}
                          id={`compare-quickview-${product.id}`}
                          className="bg-white border border-slate-200 hover:border-slate-800 text-slate-800 p-2 cursor-pointer transition-colors"
                          title="View entire detailed product summary"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Fill remainder space if less than 3 for dynamic visually pleasing layout */}
                {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="col-span-3 border border-dashed border-slate-100 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Slot Available</p>
                    <p className="text-[9px] text-slate-400 leading-normal max-w-[150px]">Choose an additional product from the gallery to compare side-by-side.</p>
                  </div>
                ))}
              </div>

              {/* Rows of specs */}
              <div className="space-y-4 font-sans text-xs">
                
                {/* SKU */}
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 items-center">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">SKU Reference</div>
                  {comparedItems.map((product) => (
                    <div key={product.id} className="col-span-3 font-mono text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                      {product.sku || `TEE-00${product.id}-ORG`}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div key={`empty-sku-${idx}`} className="col-span-3 text-slate-350 font-mono text-[10px] italic">-</div>
                  ))}
                </div>

                {/* GOTS Organic Fabric Material */}
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 items-baseline">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Material Composition</div>
                  {comparedItems.map((product) => {
                    const specs = getProductSpecs(product);
                    return (
                      <div key={product.id} className="col-span-3 text-slate-800 leading-relaxed font-medium">
                        {specs.material}
                      </div>
                    );
                  })}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div key={`empty-material-${idx}`} className="col-span-3 text-slate-350 italic">-</div>
                  ))}
                </div>

                {/* Color Palette Option */}
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 items-center">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Organic Color Name</div>
                  {comparedItems.map((product) => {
                    const specs = getProductSpecs(product);
                    return (
                      <div key={product.id} className="col-span-3 text-slate-800 font-semibold flex items-center gap-2">
                        {/* Fake circular textile swatch */}
                        <span 
                          className={`w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs shrink-0`}
                          style={{ 
                            backgroundColor: 
                              product.name.toLowerCase().includes("white") ? "#ffffff" :
                              product.name.toLowerCase().includes("black") ? "#111827" :
                              product.name.toLowerCase().includes("sage") ? "#8fa890" :
                              product.name.toLowerCase().includes("gray") ? "#94a3b8" :
                              product.name.toLowerCase().includes("navy") ? "#1e3a8a" :
                              product.name.toLowerCase().includes("sand") ? "#f5e6d3" :
                              "#cbd5e1"
                          }}
                        />
                        <span>{specs.color}</span>
                      </div>
                    );
                  })}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div key={`empty-color-${idx}`} className="col-span-3 text-slate-350 italic">-</div>
                  ))}
                </div>

                {/* Fitting density and Weight */}
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 items-baseline">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Weave & Weight</div>
                  {comparedItems.map((product) => {
                    const specs = getProductSpecs(product);
                    return (
                      <div key={product.id} className="col-span-3 text-slate-800 font-medium">
                        {specs.fitWeight}
                      </div>
                    );
                  })}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div key={`empty-fit-${idx}`} className="col-span-3 text-slate-350 italic">-</div>
                  ))}
                </div>

                {/* Organic GOTS/OEKO-Tex Ecosphere Rating */}
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 items-baseline">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Eco-dye Technique</div>
                  {comparedItems.map((product) => {
                    const specs = getProductSpecs(product);
                    return (
                      <div key={product.id} className="col-span-3 text-slate-800 font-medium">
                        {specs.ecoRating}
                      </div>
                    );
                  })}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div key={`empty-eco-${idx}`} className="col-span-3 text-slate-350 italic">-</div>
                  ))}
                </div>

                {/* Sizes Available */}
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 items-center">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Available Sizes</div>
                  {comparedItems.map((product) => (
                    <div key={product.id} className="col-span-3 flex flex-wrap gap-1.5">
                      {product.sizes.map((s: string) => (
                        <span key={s} className="bg-slate-100 text-slate-800 text-[9px] font-bold font-sans px-2 py-0.5 rounded-none border border-slate-150">
                          {s}
                        </span>
                      ))}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div key={`empty-sizes-${idx}`} className="col-span-3 text-slate-350 italic">-</div>
                  ))}
                </div>

                {/* Stock Level Availability */}
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 items-center">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Inventory Status</div>
                  {comparedItems.map((product) => {
                    const stock = product.stock ?? 100;
                    return (
                      <div key={product.id} className="col-span-3 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${stock > 20 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                        <span className={`text-xs ${stock > 20 ? 'text-slate-700' : 'text-rose-600 font-bold'}`}>
                          {stock > 20 ? `In Stock (${stock} units left)` : `Low Stock (${stock} units left!)`}
                        </span>
                      </div>
                    );
                  })}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div key={`empty-stock-${idx}`} className="col-span-3 text-slate-350 italic">-</div>
                  ))}
                </div>

                {/* Description Text */}
                <div className="grid grid-cols-12 gap-4 py-3 items-baseline">
                  <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Sustainability Narrative</div>
                  {comparedItems.map((product) => (
                    <div key={product.id} className="col-span-3 text-slate-500 text-xs italic leading-relaxed">
                      "{product.description}"
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, idx) => (
                    <div key={`empty-desc-${idx}`} className="col-span-3 text-slate-350 italic">-</div>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Bottom Bar containing actions) */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Comparison limits set to max 3 items to preserve view integrity.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              id="compare-modal-footer-close"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
            >
              Close Assessment View
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
