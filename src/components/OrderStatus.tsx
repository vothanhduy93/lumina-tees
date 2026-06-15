import React, { useState, useEffect } from 'react';
import { Order, OrderStatus as OrderStatusType } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Tag, 
  CreditCard, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Loader2,
  Mail,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface OrderStatusProps {
  onBack: () => void;
  initialOrderId?: string;
}

export function OrderStatus({ onBack, initialOrderId = '' }: OrderStatusProps) {
  const { formatPrice } = useCurrency();
  const [orderId, setOrderId] = useState(initialOrderId);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  
  // Suggested demo order IDs for easier testing
  const [demoOrders, setDemoOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch recent orders to show as quick click suggestion templates for testing
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDemoOrders(data.slice(0, 3));
        }
      })
      .catch(err => console.warn('Could not fetch demo orders:', err));
  }, []);

  // Handle URL or initial parameters
  useEffect(() => {
    if (initialOrderId) {
      handleLookup(null, initialOrderId);
    }
  }, [initialOrderId]);

  const handleLookup = async (e: React.FormEvent | null, idToUse?: string) => {
    if (e) e.preventDefault();
    const activeId = (idToUse || orderId).trim().toUpperCase();
    if (!activeId) {
      setError('Please enter a valid Order ID.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/${activeId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Order ${activeId} could not be found. Please double check the ID.`);
        }
        throw new Error('An error occurred while looking up your order. Please try again.');
      }
      
      const data: Order = await response.json();
      
      // If user entered an email, securely verify it matches the order's customer email
      if (email.trim() && data.customer?.email) {
        if (email.trim().toLowerCase() !== data.customer.email.toLowerCase()) {
          throw new Error('The email provided does not match the email associated with this Order ID.');
        }
      }

      setOrder(data);
      if (!idToUse) {
        setOrderId(activeId); // normalize display
      }
    } catch (err: any) {
      setError(err.message || 'Failed to locate order.');
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    {
      key: 'pending',
      title: 'Order Confirmed',
      desc: 'We have received your order and payment authorization.',
      icon: CheckCircle2,
      timeText: 'Within 2 hours of checkout',
    },
    {
      key: 'processing',
      title: 'Ethical Production',
      desc: 'Your premium organic cotton apparel is being hand-selected, verified, and eco-wrapped.',
      icon: Package,
      timeText: 'Usually ships in 1-2 business days',
    },
    {
      key: 'completed',
      title: 'Arrived & Delivered',
      desc: 'Your shipment has reached its destination via carbon-neutral logistics.',
      icon: Truck,
      timeText: 'Delivered in premium craft boxes',
    }
  ];

  const getStageIndex = (status: OrderStatusType) => {
    if (status === 'cancelled') return -1;
    if (status === 'pending') return 0;
    if (status === 'processing') return 1;
    if (status === 'completed') return 2;
    return 0;
  };

  const currentIndex = order ? getStageIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12" id="order-status-view">
      {/* Upper Navigation Path */}
      <button 
        onClick={onBack}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        id="back-to-collection-btn"
      >
        <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
        Return to Collection
      </button>

      {/* Hero Banner Header */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-[1px] w-6 bg-slate-400"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order Shipment Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 uppercase">
          Track Your Delivery
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl">
          Enter your unique order tracking reference ID below to monitor manufacturing, ecological packaging, and carbon-neutral transit timelines.
        </p>
      </div>

      {/* Main Grid Card Structure */}
      <div className="space-y-8">
        
        {/* Lookup Query Form */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-sm">
          <form onSubmit={(e) => handleLookup(e)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="order-id-input" className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                  Order ID Reference <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="order-id-input"
                    type="text"
                    required
                    placeholder="e.g. ORD-JKW9F8A2D"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm font-mono border border-slate-200 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 uppercase transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="order-email-input" className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                  Associated Email Address <span className="text-slate-400 font-normal">(Optional Secure Match)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="order-email-input"
                    type="email"
                    placeholder="e.g. yourname@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-slate-350" />
                Find your ID inside the email receipt received post checkout.
              </span>
              <button
                type="submit"
                id="lookup-submit-btn"
                disabled={loading}
                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 disabled:bg-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Locating Order...
                  </>
                ) : (
                  'Track Order status'
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Assist Links (Convenient for testers in AI Studio) */}
          {demoOrders.length > 0 && !order && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                Recent Store Checkout Receipts (Click to Quick Auto-fill)
              </span>
              <div className="flex flex-wrap gap-2">
                {demoOrders.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      setOrderId(demo.id);
                      if (demo.customer?.email) {
                        setEmail(demo.customer.email);
                      }
                      handleLookup(null, demo.id);
                    }}
                    id={`demo-btn-${demo.id}`}
                    className="bg-slate-50 hover:bg-slate-100 hover:border-slate-400 text-[10px] font-mono border border-slate-200 px-3.5 py-1.5 transition-all text-slate-700 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{demo.id}</span>
                    <span className="text-slate-400">({demo.customer?.name})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Feedbacks */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 border border-rose-150 bg-rose-50 text-rose-700 text-xs flex gap-2.5 items-start"
                id="lookup-error-box"
              >
                <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold underline uppercase tracking-wider block mb-0.5">Tracking Failure</span>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loaded Order Information Segment */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
              id="order-details-card"
            >
              {/* Stepper Timeline Progress Container */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-8">
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Live Pipeline Status</span>
                    <div className="flex items-center gap-2.5 mt-1">
                      <h2 className="text-lg font-bold font-mono text-slate-900 tracking-wider">
                        {order.id}
                      </h2>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs text-slate-500">
                        Placed on {new Date(order.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                    order.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                    order.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-750' :
                    'bg-amber-50 border-amber-200 text-amber-700'
                  }`} id="current-status-badge">
                    {order.status === 'completed' ? 'Completed & Delivered' : order.status}
                  </span>
                </div>

                {order.status === 'cancelled' ? (
                  <div className="py-6 flex flex-col items-center justify-center text-center border border-dashed border-red-150 bg-red-50/40 px-4">
                    <XCircle className="w-12 h-12 text-red-500 mb-3" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-red-800">Order Voided / Cancelled</h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      This order transactions has been cancelled. For refunds, please allow 3-5 business days to post to your financial statement.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Horizontal Visual Rail Bar */}
                    <div className="relative hidden md:block select-none mb-10 h-1 bg-slate-100 w-[78%] mx-auto top-2.5">
                      <div 
                        className="absolute h-full bg-slate-900 left-0 transition-all duration-1000 ease-out"
                        style={{ width: `${currentIndex === 0 ? '0%' : currentIndex === 1 ? '50%' : '100%'}` }}
                      />
                    </div>

                    {/* Timeline Stages List */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                      {stages.map((stage, sIdx) => {
                        const IconComponent = stage.icon;
                        const isDone = sIdx <= currentIndex;
                        const isCurrent = sIdx === currentIndex;
                        
                        return (
                          <div 
                            key={stage.key} 
                            className={`flex flex-row md:flex-col items-start gap-4 md:text-center md:items-center transition-all duration-300 ${
                              isDone ? 'opacity-100' : 'opacity-40'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                              isCurrent ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-4 ring-slate-100 scale-105' :
                              isDone ? 'bg-slate-900 border-slate-900 text-white' :
                              'bg-white border-slate-200 text-slate-400'
                            }`}>
                              {isDone && !isCurrent ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <IconComponent className="w-4 h-4" />
                              )}
                            </div>

                            <div className="md:max-w-[200px]">
                              <p className={`text-[11px] font-bold uppercase tracking-widest ${
                                isCurrent ? 'text-slate-900' : isDone ? 'text-slate-700' : 'text-slate-400'
                              }`}>
                                {stage.title}
                              </p>
                              <p className="text-[11px] text-slate-450 mt-1 md:line-clamp-3 leading-relaxed">
                                {stage.desc}
                              </p>
                              <span className="inline-block text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 mt-2 rounded-xs border border-slate-100">
                                {stage.timeText}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Specifications Information Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Dispatched Item List */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-sm h-full flex flex-col">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    Shipment Parcel Items ({order.items?.length || 0})
                  </h3>

                  <div className="divide-y divide-slate-100 flex-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                        <img 
                          referrerPolicy="no-referrer"
                          src={item.image} 
                          alt={item.name} 
                          className="w-14 h-18 bg-slate-50 object-cover border border-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-405 mt-0.5 flex gap-2 items-center">
                            <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                              Size {item.size}
                            </span>
                            <span>&times; {item.quantity}</span>
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Financial Total Summary */}
                  <div className="bg-slate-50 p-4 border border-slate-100/80 mt-6 space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Standard Packaging & Shipping</span>
                      <span className="font-bold text-green-600 uppercase tracking-wider text-[10px]">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Carbon-offsetting levy</span>
                      <span className="text-[10px] bg-slate-150 px-1.5 py-0.5 text-slate-700 font-mono rounded-sm">Included</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200/60">
                      <span>Total Amount Settled</span>
                      <span>{formatPrice(order.total || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Shipping coordinates & dates */}
                <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-sm space-y-6">
                  
                  {/* Delivery Coordinates Section */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Delivery Coordinates
                    </h3>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-900">
                        {order.customer?.name}
                      </p>
                      <p className="text-xs text-slate-525 leading-relaxed bg-slate-50/60 border border-slate-100/50 p-3 rounded-none">
                        {order.customer?.address || 'No shipping coordinate registered'}
                      </p>
                      {order.customer?.email && (
                        <p className="text-xs text-slate-450 font-mono flex items-center gap-1.5 pt-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {order.customer.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Transaction Invoices */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      Invoice Particulars
                    </h3>
                    <div className="space-y-3 font-sans text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Method</span>
                        <span className="font-bold text-slate-800">Stripe Secure Pay</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Settled On</span>
                        <span className="text-slate-800">
                          {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Status</span>
                        <span className="text-xs uppercase bg-green-100/80 text-green-800 font-bold px-2 py-0.5 rounded-sm">Paid</span>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Impact Notice */}
                  <div className="bg-emerald-50/60 border border-emerald-100/80 p-4 rounded-none">
                    <h4 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      🌱 Organic Promise Verified
                    </h4>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      Lumina Tees orders are shipped in biodegradable, water-soluble starch wrap and FSC-recycled craft packaging boxes to eliminate plastic.
                    </p>
                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
