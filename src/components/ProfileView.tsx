import React, { useState, useEffect } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Package, 
  History, 
  MapPin, 
  Mail, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  ShoppingBag, 
  Clock, 
  Calendar, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  AlertCircle,
  Leaf,
  Settings,
  ArrowLeft
} from 'lucide-react';

interface ProfileViewProps {
  onBack: () => void;
  onQuickView: (product: Product) => void;
}

interface ProfileFields {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export function ProfileView({ onBack, onQuickView }: ProfileViewProps) {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'history' | 'profile'>('history');
  
  // Profile settings state (loaded/saved via localStorage)
  const [profile, setProfile] = useState<ProfileFields>(() => {
    const saved = localStorage.getItem('lumina_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default to the user's email matching metadata, or dummy standard
    return {
      name: 'Duy Vo',
      email: 'hcmc.duyvo@gmail.com',
      address: '128 Swiss Minimalist Boulevard, Suite B, San Francisco, CA 94103',
      phone: '+1 (415) 555-0192'
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<ProfileFields>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Transit journey animation simulator state
  const [isSimulating, setIsSimulating] = useState(false);
  const [trackerMode, setTrackerMode] = useState<'standard' | 'milestones'>('standard');

  // Fetch orders from server on mount & when profile email changes
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError('');
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to download orders data from backend.');
      }
      const allOrders: Order[] = await response.json();
      
      // Filter orders by the profile email
      const userOrders = allOrders.filter(
        order => order.customer?.email?.toLowerCase().trim() === profile.email.toLowerCase().trim()
      );
      
      setOrders(userOrders);
      
      // If there's a selected order, try to update it as well
      if (selectedOrder) {
        const updatedSelected = userOrders.find(o => o.id === selectedOrder.id);
        if (updatedSelected) {
          setSelectedOrder(updatedSelected);
        }
      } else if (userOrders.length > 0) {
        // Default select the latest order
        setSelectedOrder(userOrders[0]);
      } else {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError('Failed to load order listings from Firestore. Displaying offline demo items instead.');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [profile.email]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editFields);
    localStorage.setItem('lumina_user_profile', JSON.stringify(editFields));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Simulate progress of transit journey securely
  const simulateJourneyStep = async () => {
    if (!selectedOrder || isSimulating) return;
    setIsSimulating(true);

    const statuses: OrderStatus[] = ['pending', 'processing', 'completed'];
    const currentIndex = statuses.indexOf(selectedOrder.status);
    
    if (currentIndex === -1 || currentIndex === statuses.length - 1) {
      // If already completed or not found, let's reset to pending
      await updateOrderStatusOnServer(selectedOrder.id, 'pending');
    } else {
      // Progress to next status
      const nextStatus = statuses[currentIndex + 1];
      await updateOrderStatusOnServer(selectedOrder.id, nextStatus);
    }
    
    setIsSimulating(false);
  };

  const updateOrderStatusOnServer = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        // Refetch orders list
        await fetchOrders();
      }
    } catch (e) {
      console.error('Failed to update status on server:', e);
    }
  };

  // Define steps for the timeline visualization
  const getTimelineSteps = (status: OrderStatus, orderDate: string) => {
    const d = new Date(orderDate);
    const formatDate = (daysToAdd: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + daysToAdd);
      return copy.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isPending = status === 'pending';
    const isProcessing = status === 'processing';
    const isCompleted = status === 'completed';
    const isCancelled = status === 'cancelled';

    if (isCancelled) {
      return [
        {
          title: 'Order Received',
          description: 'Payment processed and verified.',
          date: formatDate(0),
          status: 'completed',
          icon: ShieldCheck,
        },
        {
          title: 'Transaction Terminated',
          description: 'This transaction was cancelled by the customer or support team.',
          date: formatDate(0),
          status: 'cancelled',
          icon: AlertCircle,
        }
      ];
    }

    return [
      {
        title: 'Order Transmitted',
        description: 'Payment authorized. Digital confirmation receipt dispatched.',
        date: formatDate(0),
        status: 'completed', // always complete if order exists
        icon: ShieldCheck,
      },
      {
        title: 'Crafted & Wrapped',
        description: 'Organic fibers selected, spun, and placed in biodegradable tissue wrapping.',
        date: formatDate(1),
        status: (isProcessing || isCompleted) ? 'completed' : 'current',
        icon: Leaf,
      },
      {
        title: 'Dispatched Hub',
        description: 'Zero carbon-emission parcel transferred to logistics freight terminal.',
        date: formatDate(2),
        status: isCompleted ? 'completed' : (isProcessing ? 'current' : 'upcoming'),
        icon: Truck,
      },
      {
        title: 'Neutral Transit Out',
        description: 'Placed onto electric final-mile distribution vehicle for local community route.',
        date: formatDate(4),
        status: isCompleted ? 'completed' : 'upcoming',
        icon: Sparkles,
      },
      {
        title: 'Safely Delivered',
        description: 'Secured on premise. Physical verification and carbon offset certified.',
        date: formatDate(5),
        status: isCompleted ? 'completed' : 'upcoming',
        icon: Check,
      }
    ];
  };

  // Calculate percentage for timeline bar fills
  const getTimelinePercentage = (status: OrderStatus) => {
    if (status === 'pending') return 12;
    if (status === 'processing') return 50;
    if (status === 'completed') return 100;
    return 0; // Cancelled
  };

  // Define 4-stage tracking stages requested by user: 'Order Placed', 'Processing', 'In Transit', 'Delivered'
  const getTrackingStages = (status: OrderStatus, orderDate: string) => {
    const d = new Date(orderDate);
    const formatDate = (daysToAdd: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + daysToAdd);
      return copy.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isPending = status === 'pending';
    const isProcessing = status === 'processing';
    const isCompleted = status === 'completed';
    const isCancelled = status === 'cancelled';

    return [
      {
        title: 'Order Placed',
        description: 'Order details received and verified by customer service.',
        date: formatDate(0),
        status: isCancelled ? 'cancelled' : 'completed',
        icon: ShieldCheck,
      },
      {
        title: 'Processing',
        description: 'Eco-threads curated, assembled, and packed in biodegradable materials.',
        date: formatDate(1),
        status: isCancelled ? 'upcoming' : ((isProcessing || isCompleted) ? 'completed' : 'current'),
        icon: Settings,
      },
      {
        title: 'In Transit',
        description: 'Parcel routed from local warehouse to zero-offset cargo shipper.',
        date: formatDate(3),
        status: isCancelled ? 'upcoming' : (isCompleted ? 'completed' : (isProcessing ? 'current' : 'upcoming')),
        icon: Truck,
      },
      {
        title: 'Delivered',
        description: 'Carrier dropped package off at user profile coordinates.',
        date: formatDate(5),
        status: isCancelled ? 'upcoming' : (isCompleted ? 'completed' : 'upcoming'),
        icon: Check,
      }
    ];
  };

  const getTrackingPercentage = (status: OrderStatus) => {
    if (status === 'pending') return 16.6; // Done Stage 1, heading to 2
    if (status === 'processing') return 52.5; // Done Stage 1 and 2, heading to 3
    if (status === 'completed') return 100; // Fully Done
    return 0; // Cancelled
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 flex-1 flex flex-col">
      
      {/* Dynamic View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
        <div>
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Collection Showcase
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white border border-slate-800 text-sm font-bold font-mono">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900">Hello, {profile.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border border-slate-200 p-1 bg-slate-50/50 rounded-sm">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xs ${
              activeTab === 'history'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Order History
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              setEditFields({ ...profile });
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xs ${
              activeTab === 'profile'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            My Profile
          </button>
        </div>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'history' && (
            <motion.div
              key="order-history-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              id="profile-order-history-area"
            >
              
              {/* Left Column: Ordered Parcel Lists */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Past Cargo Parcels ({orders.length})</h3>
                  <button 
                    onClick={fetchOrders}
                    title="Reload data from database"
                    className="p-1 text-slate-405 hover:text-slate-900 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin text-slate-950' : ''}`} />
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse bg-slate-50 border border-slate-100 h-24 rounded-sm" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 px-4 border border-dashed border-slate-200 bg-slate-50/20 rounded-sm">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700">No matching orders found</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      There are no orders registered under <span className="font-mono text-slate-700">{profile.email}</span> yet.
                    </p>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="mt-4 px-4 py-2 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-xs"
                    >
                      Update Profile Email
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[610px] overflow-y-auto pr-1">
                    {orders.map((ord) => {
                      const isSelected = selectedOrder?.id === ord.id;
                      const dateObj = new Date(ord.date);
                      const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      const countText = ord.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
                      
                      return (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedOrder(ord)}
                          className={`p-4 border text-left cursor-pointer transition-all hover:bg-slate-55 flex flex-col justify-between ${
                            isSelected 
                              ? 'bg-slate-900 border-slate-950 text-white shadow-md' 
                              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-350'
                          }`}
                          id={`order-history-card-${ord.id}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={`text-[10px] font-mono tracking-wider ${isSelected ? 'text-slate-400' : 'text-slate-405'}`}>
                                {ord.id}
                              </p>
                              <p className="text-xs font-semibold mt-1">{displayDate}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm ${
                              ord.status === 'completed' 
                                ? (isSelected ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-emerald-50 text-emerald-800') 
                                : ord.status === 'processing' 
                                ? (isSelected ? 'bg-sky-950 border border-sky-800 text-sky-300' : 'bg-sky-50 text-sky-800')
                                : ord.status === 'cancelled'
                                ? (isSelected ? 'bg-rose-950 border border-rose-800 text-rose-300' : 'bg-rose-50 text-rose-800')
                                : (isSelected ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-amber-50 text-amber-800')
                            }`}>
                              {ord.status}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-100/10 pt-3">
                            <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {countText} {countText === 1 ? 'item' : 'items'}
                            </span>
                            <span className="font-mono text-xs font-extrabold">
                              {formatPrice(ord.total)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Timeline Fulfillment Visualization Map */}
              <div className="lg:col-span-8">
                {selectedOrder ? (
                  <div className="bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 block relative" id="profile-order-detail-view">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order Shipment Ledger</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <h2 className="text-xl font-bold font-mono text-slate-905">{selectedOrder.id}</h2>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> 
                          Registered: {new Date(selectedOrder.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>

                      {/* Simulator and Actions Container */}
                      <div className="flex flex-wrap items-center gap-2">
                        {selectedOrder.status !== 'cancelled' && (
                          <button
                            onClick={simulateJourneyStep}
                            disabled={isSimulating}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white font-mono text-[9px] uppercase tracking-wider hover:bg-slate-800 transition-colors rounded-sm cursor-pointer disabled:opacity-50 select-none"
                            id="simulate-journey-btn"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                            {isSimulating ? 'Transitioning...' : 'Simulate Next Transit Stage'}
                          </button>
                        )}
                        <span className="text-[10px] text-slate-400 italic block font-mono">
                          (updates database)
                        </span>
                      </div>
                    </div>

                    {/* Timeline visualization layout */}
                    <div className="mb-10 bg-slate-50/50 border border-slate-100 p-6 sm:p-10 rounded-sm">
                      
                      {/* Segmented Controller Tab Headers */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 mb-6">
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-sm">
                          <button
                            onClick={() => setTrackerMode('standard')}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xs ${
                              trackerMode === 'standard'
                                ? 'bg-white text-slate-950 shadow-xs'
                                : 'text-slate-450 hover:text-slate-900 text-slate-500'
                            }`}
                            id="tracker-mode-standard-tab"
                          >
                            Order Tracking Progress
                          </button>
                          <button
                            onClick={() => setTrackerMode('milestones')}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer rounded-xs ${
                              trackerMode === 'milestones'
                                ? 'bg-white text-slate-950 shadow-xs'
                                : 'text-slate-451 hover:text-slate-900 text-slate-500'
                            }`}
                            id="tracker-mode-milestones-tab"
                          >
                            Fulfillment Details
                          </button>
                        </div>

                        <div className="flex items-center gap-1 bg-white px-2.5 py-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full font-mono uppercase">
                          <Leaf className="w-3 h-3 text-emerald-600" />
                          Carbon Neutral Logistics
                        </div>
                      </div>

                      {/* RENDERING TRACKER BASED ON SELECTION */}
                      {trackerMode === 'standard' ? (
                        /* Standard 4-Stage Tracker */
                        <div className="relative mt-8 mb-10 pl-6 sm:pl-0 sm:px-6" id="standard-4-stage-tracker-container">
                          
                          {/* Connecting track line */}
                          <div className="absolute left-[33px] sm:left-10 right-10 top-5 bottom-5 sm:bottom-auto sm:h-1 bg-slate-200/70 -translate-x-[1px] sm:translate-y-0.5 z-0" />
                          
                          {/* Dynamic Filling line */}
                          {selectedOrder.status !== 'cancelled' && (
                            <motion.div 
                              className="absolute left-[33px] sm:left-10 top-5 sm:h-1 bg-emerald-500 origin-left z-0"
                              style={{ width: 'calc(100% - 80px)' }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: getTrackingPercentage(selectedOrder.status) / 100 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          )}

                          {/* Milestones grid layout (flex column on mobile, row on desktop) */}
                          <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-4 md:text-center">
                            {getTrackingStages(selectedOrder.status, selectedOrder.date).map((step, idx) => {
                              const isPast = step.status === 'completed';
                              const isCurrent = step.status === 'current';
                              const isCancel = step.status === 'cancelled';
                              const StepIcon = step.icon;

                              return (
                                <div key={idx} className="flex sm:flex-col items-start sm:items-center flex-1 relative gap-4 sm:gap-2">
                                  
                                  {/* Timeline Bubble Dot */}
                                  <motion.div 
                                    whileHover={{ scale: 1.12 }}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center border z-10 shrink-0 transition-transform ${
                                      isPast 
                                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs' 
                                        : isCurrent 
                                        ? 'bg-amber-500 border-amber-600 text-white shadow-md animate-pulse' 
                                        : isCancel
                                        ? 'bg-rose-600 border-rose-700 text-white'
                                        : 'bg-white border-slate-200 text-slate-400'
                                    }`}
                                  >
                                    <StepIcon className="w-4 h-4" />
                                  </motion.div>

                                  {/* Texts summary */}
                                  <div className="text-left sm:text-center mt-1 sm:mt-2">
                                    <h4 className={`text-xs font-bold uppercase tracking-tight ${
                                      isPast ? 'text-slate-900 font-semibold' : isCurrent ? 'text-amber-600 font-semibold' : isCancel ? 'text-rose-600 font-semibold' : 'text-slate-400'
                                    }`}>
                                      {step.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-medium block mt-0.5">{step.date}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 max-w-[150px] leading-relaxed hidden md:block md:mx-auto">
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* Detailed 5-Stage Milestones Trail */
                        <div className="relative mt-8 mb-10 pl-6 sm:pl-0 sm:px-6" id="detailed-5-stage-milestones-container">
                          
                          {/* Connecting track line */}
                          <div className="absolute left-[33px] sm:left-10 right-10 top-5 bottom-5 sm:bottom-auto sm:h-1 bg-slate-200/70 -translate-x-[1px] sm:translate-y-0.5 z-0" />
                          
                          {/* Dynamic Filling line */}
                          {selectedOrder.status !== 'cancelled' && (
                            <motion.div 
                              className="absolute left-8 sm:left-10 top-5 sm:h-1 bg-slate-900 origin-left z-0"
                              style={{ width: 'calc(100% - 80px)' }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: getTimelinePercentage(selectedOrder.status) / 100 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          )}

                          {/* Milestones grid layout (flex column on mobile, row on desktop) */}
                          <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-4 md:text-center">
                            {getTimelineSteps(selectedOrder.status, selectedOrder.date).map((step, idx) => {
                              const isPast = step.status === 'completed';
                              const isCurrent = step.status === 'current';
                              const isCancel = step.status === 'cancelled';
                              const StepIcon = step.icon;

                              return (
                                <div key={idx} className="flex sm:flex-col items-start sm:items-center flex-1 relative gap-4 sm:gap-2">
                                  
                                  {/* Timeline Bubble Dot */}
                                  <motion.div 
                                    whileHover={{ scale: 1.12 }}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center border z-10 shrink-0 transition-transform ${
                                      isPast 
                                        ? 'bg-slate-900 border-slate-950 text-white' 
                                        : isCurrent 
                                        ? 'bg-amber-500 border-amber-500 text-white shadow-md animate-pulse' 
                                        : isCancel
                                        ? 'bg-rose-600 border-rose-600 text-white'
                                        : 'bg-white border-slate-205 text-slate-400'
                                    }`}
                                  >
                                    <StepIcon className="w-4 h-4" />
                                  </motion.div>

                                  {/* Texts summary */}
                                  <div className="text-left sm:text-center mt-1 sm:mt-2">
                                    <h4 className={`text-xs font-bold uppercase tracking-tight ${
                                      isPast ? 'text-slate-950' : isCurrent ? 'text-amber-600' : isCancel ? 'text-rose-600' : 'text-slate-400'
                                    }`}>
                                      {step.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-medium block mt-0.5">{step.date}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 max-w-[150px] leading-relaxed hidden md:block md:mx-auto">
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Detail log notification footer */}
                      <div className="bg-white p-4 border border-slate-100 rounded-sm flex items-start gap-3">
                        <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-805">Latest Delivery Ledger Note</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {selectedOrder.status === 'completed'
                              ? 'Status Update: Item has cleared local postal routes and was delivered. Thank you for selecting carbon-neutral packaging.'
                              : selectedOrder.status === 'processing'
                              ? 'Status Update: Parcel has departed our organic manufacturing hub and is routing towards local cargo carriers.'
                              : selectedOrder.status === 'cancelled'
                              ? 'Status Update: Transaction was cancelled. No delivery routes established.'
                              : 'Status Update: Order is queued. Awaiting bio-degradable custom manufacturing thread assembly.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Goods Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                      
                      {/* Products ledger list */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Ordered Essentials ({selectedOrder.items?.length})</h4>
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                          {selectedOrder.items?.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="flex gap-3 text-xs items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-sm"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-10 h-12 object-cover bg-white border border-slate-100 rounded-2xs"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900 truncate max-w-[150px]">{item.name}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Size {item.size} × Qty {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-slate-800 shrink-0">
                                {formatPrice((parseFloat(item.price as any) || 0) * (item.quantity ?? 1))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recipient / Delivery Coordinates */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-100">Fulfillment Coordinates</h4>
                        <div className="space-y-3 text-xs text-slate-650 bg-slate-50/80 p-4 border border-slate-100 rounded-sm">
                          
                          <div className="flex justify-between pb-2.5 border-b border-slate-200/40">
                            <span className="text-slate-400">Recipient Name</span>
                            <span className="font-semibold text-slate-900">{selectedOrder.customer?.name}</span>
                          </div>

                          <div className="flex justify-between pb-2.5 border-b border-slate-200/40">
                            <span className="text-slate-400">Registered Email</span>
                            <span className="font-mono text-slate-900">{selectedOrder.customer?.email}</span>
                          </div>

                          <div className="flex flex-col gap-1 pb-2.5">
                            <span className="text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> Ship To Delivery Address
                            </span>
                            <span className="font-medium text-slate-900 mt-0.5 leading-relaxed leading-medium">
                              {selectedOrder.customer?.address || 'No address specified'}
                            </span>
                          </div>

                          <div className="flex justify-between pt-2 border-t border-slate-200/60 font-mono font-bold text-slate-950 text-sm">
                            <span className="uppercase text-[9px] tracking-wider text-slate-400 font-sans">Gross Adjusted Total</span>
                            <span>{formatPrice(selectedOrder.total)}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-24 text-center border border-dashed border-slate-200 rounded-sm bg-slate-50/10">
                    <History className="w-12 h-12 text-slate-300 mb-4 animate-pulse" />
                    <h3 className="text-lg font-medium text-slate-900">No Selected Parcel</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm px-6">
                      Select any order parcel listing on the left panel to review its live estimated transit map timeline details.
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* TAB 2: PROFILE FIELDS SETTINGS */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile-fields-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
              id="profile-settings-area"
            >
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 sm:p-8">
                <div className="flex justify-between items-center pb-5 border-b border-slate-150 mb-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Account Identity</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Manage details and coordinates for your Lumina essentials delivery routes.</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditFields({ ...profile });
                      }}
                      className="px-4 py-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-xs"
                      id="edit-profile-action"
                    >
                      Modify Fields
                    </button>
                  )}
                </div>

                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-sm mb-6 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    User coordinates and identity successfully synchronized with current storage.
                  </motion.div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Full Given Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          disabled={!isEditing}
                          type="text"
                          required
                          value={isEditing ? editFields.name : profile.name}
                          onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm transition-all rounded-sm bg-slate-50/10 disabled:bg-slate-50 disabled:text-slate-405"
                          placeholder="e.g., Jane Done"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Electronic Mail Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          disabled={!isEditing}
                          type="email"
                          required
                          value={isEditing ? editFields.email : profile.email}
                          onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm transition-all rounded-sm bg-slate-50/10 disabled:bg-slate-50 disabled:text-slate-405 font-mono"
                          placeholder="e.g., example@domain.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Telephone Number</label>
                    <input
                      disabled={!isEditing}
                      type="text"
                      value={isEditing ? editFields.phone : profile.phone}
                      onChange={(e) => setEditFields({ ...editFields, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm transition-all rounded-sm bg-slate-50/10 disabled:bg-slate-50 disabled:text-slate-405"
                      placeholder="e.g., +1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Cargo Shipping Address coordinates</label>
                    <textarea
                      disabled={!isEditing}
                      required
                      rows={3}
                      value={isEditing ? editFields.address : profile.address}
                      onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm transition-all rounded-sm bg-slate-50/10 disabled:bg-slate-50 disabled:text-slate-405 leading-relaxed"
                      placeholder="Street name, City, State ZIP Code"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        className="bg-slate-905 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer rounded-xs shadow-sm"
                        id="save-profile-btn"
                      >
                        Synchronize Settings
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="border border-slate-200 hover:border-slate-400 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors cursor-pointer rounded-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>

                {/* Additional Info section */}
                <div className="mt-8 pt-8 border-t border-slate-150 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-sm flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight text-slate-800">Carbon Offset Program</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Every order linked to <span className="font-mono text-slate-850">{profile.email}</span> tracks zero-offset emissions metrics.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-sm flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight text-slate-800">Verified Buyer Status</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-sans">
                        Full access to early design collections, specialized organic fabrics and direct-to-door VIP support lines.
                      </p>
                    </div>
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
