import React, { useState } from 'react';
import { ShoppingBag, Menu, Search, X, Loader2, ArrowRight, Package, XCircle, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'checkout' | 'admin' | 'saved') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeView?: 'home' | 'checkout' | 'admin' | 'saved';
}

export function Navbar({ onNavigate, searchQuery, onSearchChange, activeView = 'home' }: NavbarProps) {
  const { totalItems, setIsOpen } = useCart();
  const { totalSaved } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Tracking states
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackId, setTrackId] = useState('');
  const [trackOrderResult, setTrackOrderResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    setIsTrackLoading(true);
    setTrackError('');
    setTrackOrderResult(null);

    try {
      const response = await fetch(`/api/orders/${trackId.trim().toUpperCase()}`);
      if (!response.ok) {
        throw new Error("Invalid order ID. Please double check.");
      }
      const data = await response.json();
      setTrackOrderResult(data);
    } catch (err) {
      setTrackError("No order found with that ID number. Please verify.");
    } finally {
      setIsTrackLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6 lg:gap-12">
            <button className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="text-xl font-bold tracking-tighter uppercase"
            >
              Lumina.Tees
            </button>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
              <button 
                onClick={() => onNavigate('home')} 
                className={`pb-0.5 border-b-2 transition-all cursor-pointer ${
                  activeView === 'home' 
                    ? 'text-slate-900 border-slate-900 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Collection
              </button>
              <button 
                onClick={() => onNavigate('saved')} 
                className={`pb-0.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'saved' 
                    ? 'text-slate-900 border-slate-900 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${totalSaved > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                Saved ({totalSaved})
              </button>
              <button onClick={() => setIsTrackOpen(true)} className="hover:text-slate-900 transition-all font-medium border-b border-transparent hover:border-slate-400 cursor-pointer">Track Order</button>
              <button className="hover:text-slate-900 transition-colors cursor-pointer">Materials</button>
              <button className="hover:text-slate-900 transition-colors cursor-pointer">Journal</button>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-slate-200 bg-white rounded-full text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 w-36 sm:w-64 transition-all"
                  />
                  <button 
                    onClick={() => {
                       setIsSearchOpen(false);
                       onSearchChange('');
                    }}
                    className="absolute right-3 text-slate-400 hover:text-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            <button onClick={() => setIsTrackOpen(true)} className="hidden sm:inline-block hover:opacity-70 transition-opacity font-medium cursor-pointer">Track Order</button>
            
            <button 
              onClick={() => onNavigate('saved')}
              className={`px-3 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 ${
                activeView === 'saved'
                  ? 'bg-slate-50 border-slate-300 text-rose-600 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:border-slate-350'
              }`}
              title="View Wishlist"
              id="nav-wishlist-button"
            >
              <Heart className={`w-4 h-4 ${totalSaved > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span className="hidden min-[450px]:inline">Saved ({totalSaved})</span>
            </button>

            <button 
              onClick={() => setIsOpen(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
              aria-label="Open cart"
              id="nav-cart-button"
            >
              Bag ({totalItems})
            </button>
          </div>
        </div>
      </div>

      {/* TRACK ORDER MODAL */}
      <AnimatePresence>
        {isTrackOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full shadow-2xl rounded-sm block overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-200 bg-[#f6f7f7] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-500" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-905">Track Your Order</h2>
                </div>
                <button 
                  onClick={() => {
                    setIsTrackOpen(false);
                    setTrackId('');
                    setTrackOrderResult(null);
                    setTrackError('');
                  }} 
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleTrackOrder} className="mb-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Order ID Number</label>
                  <div className="flex gap-2">
                    <input 
                      required
                      type="text" 
                      placeholder="e.g., ORD-A1B2C3D4" 
                      value={trackId}
                      onChange={e => setTrackId(e.target.value)}
                      className="flex-1 px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm font-mono uppercase transition-all rounded-sm"
                    />
                    <button 
                      type="submit"
                      disabled={isTrackLoading}
                      className="bg-slate-900 text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors rounded-sm flex items-center justify-center min-w-[90px]"
                    >
                      {isTrackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Status'}
                    </button>
                  </div>
                </form>

                {trackError && (
                  <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-xs rounded-sm mb-4">
                    {trackError}
                  </div>
                )}

                {trackOrderResult && (
                  <div className="border border-slate-100 rounded-sm p-4 bg-slate-50/50">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Order Stage</p>
                        <p className="text-xs font-semibold text-slate-900 font-mono mt-0.5">{trackOrderResult.id}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm ${
                        trackOrderResult.status === 'completed' ? 'bg-green-100 text-green-800' :
                        trackOrderResult.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        trackOrderResult.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {trackOrderResult.status}
                      </span>
                    </div>

                    {/* Timeline stage display */}
                    <div className="grid grid-cols-3 gap-1 mb-5 text-center bg-white border border-slate-100 py-2.5 rounded-sm">
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          ['pending', 'processing', 'completed'].includes(trackOrderResult.status) 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          1
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-1">Pending</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          ['processing', 'completed'].includes(trackOrderResult.status) 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          2
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-1">Processing</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          trackOrderResult.status === 'completed' 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          3
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-1">Completed</span>
                      </div>
                    </div>

                    {/* Ordered Items summary list */}
                    <div className="space-y-2 mb-4 max-h-[16vh] overflow-y-auto pr-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Products</p>
                      {trackOrderResult.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-2 text-xs justify-between items-center text-slate-700 bg-white p-2 border border-slate-100 rounded-sm">
                          <span className="font-medium truncate max-w-[180px]">{item.name} <span className="text-[10px] text-slate-400">({item.size})</span></span>
                          <span className="font-semibold text-slate-900 shrink-0">Qty {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recipient details */}
                    <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Recipient</span>
                        <span className="font-semibold text-slate-900">{trackOrderResult.customer?.name}</span>
                      </div>
                      {trackOrderResult.customer?.address && (
                        <div className="flex justify-between">
                          <span>Ship To</span>
                          <span className="text-right truncate max-w-[200px]" title={trackOrderResult.customer.address}>{trackOrderResult.customer.address}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1 text-slate-950 font-medium font-mono">
                        <span className="font-bold uppercase tracking-widest text-[9px] text-slate-400 font-sans">Total Charged</span>
                        <span className="font-mono text-sm font-bold">${(typeof trackOrderResult.total === 'number' ? trackOrderResult.total : parseFloat(trackOrderResult.total) || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-[#f6f7f7] flex justify-end">
                <button 
                  onClick={() => {
                    setIsTrackOpen(false);
                    setTrackId('');
                    setTrackOrderResult(null);
                    setTrackError('');
                  }} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors"
                >
                  Close Tracker
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
