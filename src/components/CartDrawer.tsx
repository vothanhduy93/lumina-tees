import React from 'react';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                Your Cart
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
                  <div className="w-16 h-16 bg-slate-50 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 hover:opacity-70 transition-opacity"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex gap-4">
                      <div className="w-24 h-32 bg-slate-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col pt-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-slate-900">{item.name}</h3>
                            <p className="text-xs text-slate-400 italic mt-1">Size: {item.size}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-slate-200 px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-slate-500 hover:text-slate-900 p-1 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-slate-500 hover:text-slate-900 p-1 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-bold text-sm text-slate-900">
                            {formatPrice((parseFloat(item.price as any) || 0) * (item.quantity ?? 1))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-100 p-6 bg-slate-50">
                <div className="flex justify-between items-center mb-6 text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-lg font-bold">{formatPrice(subtotal || 0)}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onCheckout();
                  }}
                  className="w-full bg-slate-900 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
