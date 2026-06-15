import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface CheckoutProps {
  onBack: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export function Checkout({ onBack, onTrackOrder }: CheckoutProps) {
  const { items, subtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ orderId: string } | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zip, setZip] = useState('');

  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          customer: {
            name: `${firstName} ${lastName}`.trim(),
            email,
            address: `${address}, ${city}, ${stateVal} ${zip}`
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessData({ orderId: data.orderId });
        clearCart();
      }
    } catch (error) {
      console.error('Checkout failed', error);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-24 px-4 text-center"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-4xl font-medium tracking-tight mb-4 text-slate-900">Order Confirmed!</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Thank you for your purchase. We've received your order and will send you an email confirmation shortly.
        </p>
        <div className="bg-white p-6 border border-slate-100 max-w-sm mx-auto mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Order Number</p>
          <p className="font-mono font-medium text-lg text-slate-900">{successData.orderId}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onTrackOrder && (
            <button 
              onClick={() => onTrackOrder(successData.orderId)}
              id="checkout-success-track-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Track Delivery Progress <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onBack}
            id="checkout-success-continue-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to store
      </button>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-medium tracking-tight mb-8 text-slate-900">Express Checkout</h1>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 sm:p-8 border border-slate-100 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all" placeholder="Doe" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all" placeholder="jane@example.com" />
                </div>
              </div>

              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 pt-6 border-t border-slate-100">Shipping Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Street Address</label>
                  <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all" placeholder="123 Main St" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1 space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all" placeholder="New York" />
                  </div>
                  <div className="sm:col-span-1 space-y-2">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <input required type="text" value={stateVal} onChange={e => setStateVal(e.target.value)} className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all" placeholder="NY" />
                  </div>
                  <div className="sm:col-span-1 space-y-2">
                    <label className="text-sm font-medium text-slate-700">ZIP</label>
                    <input required type="text" value={zip} onChange={e => setZip(e.target.value)} className="w-full px-4 py-3 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all" placeholder="10001" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-slate-50 p-6 sm:p-8 border border-slate-100 sticky top-24">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.cartItemId} className="flex gap-4">
                  <div className="w-16 h-20 bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-medium text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 mt-1">Size {item.size} × {item.quantity}</p>
                  </div>
                  <div className="font-bold text-sm text-slate-900 pt-1">
                    {formatPrice((parseFloat(item.price as any) || 0) * (item.quantity ?? 1))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-3 mb-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(tax || 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping || 0)}</span>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-6 mb-8">
              <div className="flex justify-between items-center p-4 border border-slate-200 bg-white">
                <span className="font-medium text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">{formatPrice(total || 0)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full bg-slate-900 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Place Order'
              )}
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">
              Secure checkout. Payments are processed securely.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
