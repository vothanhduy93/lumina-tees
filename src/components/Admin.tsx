import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import { Plus, Edit2, Trash2, Box, ShoppingCart, LayoutDashboard, ArrowLeft, Package, AlertCircle, Check, Clock, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Admin({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState({ revenue: 0, orders: 0, products: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  
  // Product Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({ sizes: ["S", "M", "L", "XL"], status: 'published' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await fetch('/api/analytics');
        setAnalytics(await res.json());
      } else if (activeTab === 'products') {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentProduct.id ? 'PUT' : 'POST';
    const url = currentProduct.id ? `/api/products/${currentProduct.id}` : '/api/products';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentProduct)
    });
    
    setIsEditing(false);
    setCurrentProduct({ sizes: ["S", "M", "L", "XL"], status: 'published' });
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'published': return 'bg-slate-900 text-white';
      case 'draft': return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1d2327] text-white flex flex-col shrink-0 min-h-screen">
        <div className="p-4 sm:p-6 mb-4">
          <button onClick={onBack} className="text-[#c3c4c7] hover:text-white flex items-center gap-2 mb-6 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Exit Store
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">WooCommerce</h1>
              <span className="text-[10px] text-[#c3c4c7]">Lumina.Tees Dashboard</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded ${activeTab === 'dashboard' ? 'bg-[#2c3338] text-white' : 'text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded ${activeTab === 'orders' ? 'bg-[#2c3338] text-white' : 'text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white'}`}
          >
            <Package className="w-4 h-4" /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded ${activeTab === 'products' ? 'bg-[#2c3338] text-white' : 'text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white'}`}
          >
            <Box className="w-4 h-4" /> Products
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 text-slate-800">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-light text-slate-900 border-b border-slate-200 pb-4">Store Performance</h2>
              
              {loading ? (
                <div className="h-40 flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Revenue Card */}
                  <div className="bg-white p-6 shadow-sm border border-slate-200 rounded-sm">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Net Sales</h3>
                    <p className="text-3xl font-light text-slate-900 mt-2">${(analytics?.revenue ?? 0).toFixed(2)}</p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">+12% from last month</p>
                  </div>
                  {/* Orders Card */}
                  <div className="bg-white p-6 shadow-sm border border-slate-200 rounded-sm">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Orders</h3>
                    <p className="text-3xl font-light text-slate-900 mt-2">{analytics.orders}</p>
                    <p className="text-xs text-slate-400 mt-2">Active & Completed</p>
                  </div>
                  {/* Products Card */}
                  <div className="bg-white p-6 shadow-sm border border-slate-200 rounded-sm">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Products</h3>
                    <p className="text-3xl font-light text-slate-900 mt-2">{analytics.products}</p>
                    <p className="text-xs text-slate-400 mt-2">In Catalog</p>
                  </div>
                  {/* Low Stock Alert Card */}
                  <div className="bg-white p-6 shadow-sm border border-red-200 bg-red-50/30 rounded-sm">
                    <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Low Stock
                    </h3>
                    <p className="text-3xl font-light text-slate-900 mt-2">{analytics.lowStock}</p>
                    <p className="text-xs text-red-600 mt-2">Items need reordering</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-light text-slate-900">Products</h2>
                <button 
                  onClick={() => {
                    setCurrentProduct({ sizes: ["S", "M", "L", "XL"], status: 'published' });
                    setIsEditing(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 rounded-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                  Add New
                </button>
              </div>

              {loading ? (
                <div className="h-64 flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="bg-white shadow-sm border border-slate-200 rounded-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f6f7f7] border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">SKU</th>
                        <th className="px-4 py-3 font-medium">Stock</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50 group">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-10 h-10 object-cover border border-slate-200 rounded-sm bg-slate-50" />
                              <div className="flex flex-col">
                                <span className="font-medium text-blue-600 cursor-pointer group-hover:underline" onClick={() => { setCurrentProduct(product); setIsEditing(true); }}>
                                  {product.name}
                                </span>
                                <div className="invisible group-hover:visible flex gap-2 text-[10px] uppercase text-slate-400 mt-1">
                                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => { setCurrentProduct(product); setIsEditing(true); }}>Edit</span>
                                  <span>|</span>
                                  <span className="hover:text-red-600 cursor-pointer text-red-500" onClick={() => handleDeleteProduct(product.id)}>Trash</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-mono text-xs">{product.sku || 'N/A'}</td>
                          <td className="px-4 py-3">
                            {product.stock !== undefined ? (
                              <span className={product.stock < 15 ? "text-red-600 font-medium" : "text-green-600"}>
                                {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-900">${(typeof product.price === 'number' ? product.price : parseFloat(product.price as any) || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-slate-500">{product.category || 'Uncategorized'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-sm ${getStatusColor(product.status || 'draft')}`}>
                              {product.status || 'Draft'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-light text-slate-900">Orders</h2>
              </div>

              {loading ? (
                <div className="h-64 flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white border text-center border-slate-200 py-16 text-slate-500">
                  No orders found.
                </div>
              ) : (
                <div className="bg-white shadow-sm border border-slate-200 rounded-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f6f7f7] border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 font-medium">Order</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Total</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <div className="font-medium text-blue-600">#{order.id} {order.customer?.name}</div>
                            <div className="text-xs text-slate-500 mt-1">{order.items.length} items</div>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-4">
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`text-xs font-semibold px-2 py-1 outline-none border rounded-sm ${getStatusColor(order.status)}`}
                            >
                              <option value="pending" className="bg-white text-slate-800">Pending</option>
                              <option value="processing" className="bg-white text-slate-800">Processing</option>
                              <option value="completed" className="bg-white text-slate-800">Completed</option>
                              <option value="cancelled" className="bg-white text-slate-800">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-900">${(typeof order.total === 'number' ? order.total : parseFloat(order.total as any) || 0).toFixed(2)}</td>
                          <td className="px-4 py-4">
                             <button 
                               onClick={() => setSelectedOrder(order)}
                               className="text-xs text-slate-500 hover:text-blue-600 hover:underline"
                             >
                                View details
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Product Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-2xl w-full shadow-2xl rounded-sm block overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-200 bg-[#f6f7f7] flex justify-between items-center">
                <h2 className="text-lg font-medium text-slate-900">
                  {currentProduct.id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2 sm:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                     <input required type="text" value={currentProduct.name || ''} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                   </div>
                   <div className="col-span-2 sm:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                     <input type="text" value={currentProduct.sku || ''} onChange={e => setCurrentProduct({...currentProduct, sku: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-mono" />
                   </div>
                   <div className="col-span-2 sm:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                     <input required type="number" step="0.01" value={currentProduct.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                   </div>
                   <div className="col-span-2 sm:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                     <input required type="number" value={currentProduct.stock || 0} onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                   </div>
                   <div className="col-span-2 sm:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                     <input type="text" value={currentProduct.category || ''} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                   </div>
                   <div className="col-span-2 sm:col-span-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                     <select 
                       value={currentProduct.status || 'draft'} 
                       onChange={e => setCurrentProduct({...currentProduct, status: e.target.value as 'published' | 'draft'})} 
                       className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                     >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                     </select>
                   </div>
                   <div className="col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                     <input required type="url" value={currentProduct.image || ''} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                   </div>
                   <div className="col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                     <textarea required rows={4} value={currentProduct.description || ''} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none"></textarea>
                   </div>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 rounded-sm transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 rounded-sm transition-colors shadow-sm">
                    {currentProduct.id ? 'Update' : 'Publish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-3xl w-full shadow-2xl rounded-sm block overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-200 bg-[#f6f7f7] flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Purchase Order</span>
                  <h2 className="text-lg font-medium text-slate-900 font-mono">
                    {selectedOrder.id}
                  </h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6 overflow-y-auto max-h-[70vh]">
                {/* Left Column: Items */}
                <div className="md:col-span-3 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Ordered Items</h3>
                    <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 divide-y divide-slate-100">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={item.cartItemId || idx} className="flex gap-4 pt-3 first:pt-0">
                          <div className="w-16 h-20 bg-slate-50 border border-slate-200 shrink-0 overflow-hidden rounded-sm">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h4>
                            <p className="text-xs text-slate-500 font-mono mt-1">Size {item.size} • Qty {item.quantity}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-slate-900">${((parseFloat(item.price as any) || 0) * (item.quantity ?? 1)).toFixed(2)}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">${(parseFloat(item.price as any) || 0).toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Order Status Settings</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-700">Set Stage:</span>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => {
                          handleUpdateOrderStatus(selectedOrder.id, e.target.value);
                          setSelectedOrder({ ...selectedOrder, status: e.target.value as any });
                        }}
                        className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-sm bg-white text-slate-800 outline-none focus:border-slate-900 transition-colors"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column: Customer & Delivery details */}
                <div className="md:col-span-2 space-y-6 md:border-l md:border-slate-100 md:pl-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Customer Information</h3>
                    <div className="text-sm space-y-2">
                      <p className="font-semibold text-slate-900">{selectedOrder.customer?.name || "Anonymous User"}</p>
                      {selectedOrder.customer?.email && (
                        <p className="text-slate-500 text-xs font-mono break-all">{selectedOrder.customer.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Shipping Address</h3>
                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-sm border border-slate-100 whitespace-pre-wrap">
                      {selectedOrder.customer?.address || "No shipping details entered (Local Pick-up)"}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Order Date</span>
                      <span>{new Date(selectedOrder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Item Quantity</span>
                      <span>{selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-slate-900 text-white rounded-sm mt-2">
                      <span className="text-xs font-bold uppercase tracking-widest">Grand Total</span>
                      <span className="font-mono font-bold text-base">${(typeof selectedOrder.total === 'number' ? selectedOrder.total : parseFloat(selectedOrder.total as any) || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-[#f6f7f7] flex justify-end">
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

