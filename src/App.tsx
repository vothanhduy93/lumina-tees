import React, { useState, useEffect } from 'react';
import { Product } from './types';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { QuickViewModal } from './components/QuickViewModal';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { OrderStatus } from './components/OrderStatus';
import { CompareTray } from './components/CompareTray';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { Checkout } from './components/Checkout';
import { SavedView } from './components/SavedView';
import { Admin } from './components/Admin';
import { ProfileView } from './components/ProfileView';
import { PromoBanner } from './components/PromoBanner';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Instagram, Twitter, Pin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

function StoreLayout() {
  const [view, setView] = useState<'home' | 'checkout' | 'admin' | 'saved' | 'track' | 'profile'>('home');
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [subscribedEmails, setSubscribedEmails] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (view === 'home' || view === 'admin' || view === 'saved') {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            console.error('Failed to load products: API returned an error:', data);
            setProducts([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load products', err);
          setLoading(false);
        });
    }
  }, [view]);

  if (view === 'admin') {
    return <Admin onBack={() => setView('home')} />;
  }

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                            p.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const displayedProducts = [...filteredProducts];
  if (sortBy === 'price-asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else {
    displayedProducts.reverse();
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Helmet>
        {view === 'home' && (
          <>
            <title>Lumina Tees | Elevated Everyday Essentials & Sustainable Organic T-Shirts</title>
            <meta name="description" content="Discover Lumina Tees, a premium collection of sustainably sourced, 100% organic cotton t-shirts built for lasting comfort and elevated modern design." />
            <meta name="keywords" content="organic cotton, premium t-shirts, sustainable apparel, minimal design, elevated essentials, Lumina Tees" />
            <meta property="og:title" content="Lumina Tees | Elevated Everyday Essentials" />
            <meta property="og:description" content="Sustainably sourced, 100% organic cotton t-shirts built for comfort and longevity." />
            <meta property="og:type" content="website" />
          </>
        )}
        {view === 'checkout' && (
          <>
            <title>Secure Checkout | Lumina Tees</title>
            <meta name="description" content="Complete your premium sustainable fashion order securely and smoothly." />
          </>
        )}
        {view === 'saved' && (
          <>
            <title>My Saved Collection | Lumina Tees</title>
            <meta name="description" content="Your curated collection of premium organic tees from Lumina Tees." />
          </>
        )}
        {view === 'track' && (
          <>
            <title>Track Order Delivery Progress | Lumina Tees</title>
            <meta name="description" content="Track your premium organic tees transit journey and ecological package delivery status." />
          </>
        )}
      </Helmet>

      <PromoBanner />
      <Navbar 
        onNavigate={setView} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        activeView={view} 
        products={products}
        onSelectProduct={(p) => {
          setQuickViewProduct(p);
          setView('home');
        }}
      />
      <CartDrawer onCheckout={() => setView('checkout')} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section className="bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col text-left">
                  <div className="max-w-xl z-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">New Season / {new Date().getFullYear()}</span>
                    <motion.h1 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[0.95] text-slate-900 mb-6"
                    >
                      Everyday Essentials,<br /> Elevated by Design.
                    </motion.h1>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg sm:text-xl text-slate-500 max-w-sm mb-8"
                    >
                      Discover our collection of premium, sustainably sourced t-shirts built for comfort and longevity.
                    </motion.p>
                    <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} className="bg-slate-900 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                      Shop Now
                    </button>
                  </div>
                </div>
              </section>

              {/* Product Grid */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">The Core Collection</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-xs font-bold uppercase tracking-widest transition-all pb-3 relative -mb-[22px] border-b-2 z-10 ${
                            selectedCategory === cat
                              ? 'border-slate-900 text-slate-900 font-extrabold'
                              : 'border-transparent text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {cat === 'all' ? 'All Products' : cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 pb-1 w-full md:w-auto justify-between md:justify-end">
                    <div className="relative flex items-center">
                      <select 
                        title="Sort products"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-xs font-bold uppercase tracking-widest text-slate-900 bg-transparent border-none outline-none cursor-pointer focus:ring-0 appearance-none pr-6 w-full"
                      >
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-0 pointer-events-none text-slate-400" />
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }} 
                      className="text-[10px] sm:text-xs font-bold uppercase tracking-widest border-b border-slate-900 pb-1 text-slate-900 cursor-pointer hover:opacity-72 transition-opacity"
                    >
                      Reset View
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12" id="product-grid-loading-skeleton">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex flex-col w-full">
                        {/* Shimmer Image Wrapper */}
                        <div className="relative aspect-[3/4] bg-slate-100 w-full mb-4 overflow-hidden rounded-xs border border-slate-100/50">
                          {/* Sliding shimmer light background */}
                          <div className="absolute inset-0 bg-skeleton-shimmer animate-shimmer" />
                          
                          {/* Mock top overlay badges */}
                          <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                            <div className="w-12 h-5 bg-white/70 backdrop-blur-xs rounded-xs" />
                          </div>
                          
                          {/* Mock top overlay wishlist button */}
                          <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/70 backdrop-blur-xs" />
                        </div>

                        {/* Metas structure */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0 flex flex-col gap-2">
                            {/* Title mock */}
                            <div className="relative h-4 bg-slate-200 w-4/5 overflow-hidden rounded-xs">
                              <div className="absolute inset-0 bg-skeleton-shimmer animate-shimmer opacity-60" />
                            </div>
                            {/* Description mock */}
                            <div className="relative h-3 bg-slate-150 w-3/5 overflow-hidden rounded-xs">
                              <div className="absolute inset-0 bg-skeleton-shimmer animate-shimmer opacity-40" />
                            </div>
                          </div>
                          {/* Price mock */}
                          <div className="relative h-4 bg-slate-200 w-14 shrink-0 overflow-hidden rounded-xs">
                            <div className="absolute inset-0 bg-skeleton-shimmer animate-shimmer opacity-60" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {displayedProducts.length > 0 ? (
                      displayedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center flex flex-col items-center">
                        <p className="text-slate-500 font-medium mb-2">No products found matching "{searchQuery}"</p>
                        <button onClick={() => setSearchQuery('')} className="text-blue-600 text-sm hover:underline">Clear search</button>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Customer Testimonials & Ratings Chart visualization */}
              <Testimonials />

              {/* Frequently Asked Questions Accordion section */}
              <FAQ />
            </motion.div>
          )}

          {view === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Checkout 
                onBack={() => setView('home')} 
                onTrackOrder={(orderId) => {
                  setSelectedTrackingOrderId(orderId);
                  setView('track');
                }}
              />
            </motion.div>
          )}

          {view === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <SavedView onBack={() => setView('home')} onQuickView={setQuickViewProduct} />
            </motion.div>
          )}

          {view === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <OrderStatus 
                initialOrderId={selectedTrackingOrderId} 
                onBack={() => {
                  setView('home');
                  setSelectedTrackingOrderId('');
                }} 
              />
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <ProfileView 
                onBack={() => setView('home')} 
                onQuickView={setQuickViewProduct} 
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Detailed Footer with Newsletter Section */}
      <footer className="border-t border-slate-100 bg-[#fbfbfb] py-14 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="max-w-7xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 pb-12 border-b border-slate-200/60">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-2 uppercase">Join our Journal</h2>
            <p className="text-sm text-slate-500 max-w-md">
              Receive standard drop notifications, curated design collections, sustainable material stories, and journal articles.
            </p>
            
            {/* Visual Social Links Section */}
            <div className="mt-6 flex items-center gap-4" id="footer-social-links-container">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Follow Lumina
              </span>
              <div className="h-[1px] w-6 bg-slate-200"></div>
              <div className="flex gap-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-sm border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white flex items-center justify-center text-slate-600 transition-all duration-300 cursor-pointer"
                  title="Instagram"
                  id="social-instagram-link"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-sm border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white flex items-center justify-center text-slate-600 transition-all duration-300 cursor-pointer"
                  title="Twitter"
                  id="social-twitter-link"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="https://pinterest.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-sm border border-slate-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white flex items-center justify-center text-slate-600 transition-all duration-300 cursor-pointer"
                  title="Pinterest"
                  id="social-pinterest-link"
                >
                  <Pin className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const trimmedEmail = newsletterEmail.trim();
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                
                if (!trimmedEmail) {
                  setNewsletterError("Email address is required.");
                  setNewsletterSuccess(false);
                  return;
                }
                
                if (!emailRegex.test(trimmedEmail)) {
                  setNewsletterError("Please enter a valid email address.");
                  setNewsletterSuccess(false);
                  return;
                }
                
                if (subscribedEmails.includes(trimmedEmail)) {
                  setNewsletterError("This email is already subscribed in this session.");
                  setNewsletterSuccess(false);
                  return;
                }

                setNewsletterError('');
                const updatedEmails = [...subscribedEmails, trimmedEmail];
                setSubscribedEmails(updatedEmails);
                console.log("Newsletter subscribers update in state:", updatedEmails);
                setNewsletterSuccess(true);
                setNewsletterEmail('');
                setTimeout(() => setNewsletterSuccess(false), 5000);
              }} 
              className="flex flex-col sm:flex-row gap-2 max-w-md md:ml-auto w-full"
            >
              <input
                required
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterError) setNewsletterError('');
                }}
                className="flex-1 px-4 py-3 border border-slate-200 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm transition-all"
                aria-label="Newsletter email address"
                id="newsletter-email-input"
              />
              <button
                type="submit"
                id="newsletter-subscribe-btn"
                className="bg-slate-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap font-semibold"
              >
                Subscribe
              </button>
            </form>
            <AnimatePresence mode="wait">
              {newsletterSuccess && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-600 font-semibold mt-3 md:text-right"
                  id="newsletter-success-msg"
                >
                  Subscription successful! Welcome to Lumina Journal.
                </motion.p>
              )}
              {newsletterError && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-rose-600 font-semibold mt-3 md:text-right"
                  id="newsletter-error-msg"
                >
                  {newsletterError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">
          <div className="flex gap-4 sm:gap-8">
            <span>&copy; {new Date().getFullYear()} LUMINA TEES</span>
            <span className="hidden sm:inline hover:text-slate-900 transition-colors cursor-pointer">Terms</span>
            <span className="hidden sm:inline hover:text-slate-900 transition-colors cursor-pointer">Privacy</span>
          </div>
          <div className="flex gap-8 items-center">
            <span onClick={() => setView('admin')} className="hover:text-slate-900 transition-colors cursor-pointer border-b border-transparent hover:border-slate-900">Admin Panel</span>
            <span className="cursor-pointer text-slate-400">Global Shipping Available</span>
          </div>
        </div>

        {subscribedEmails.length > 0 && (
          <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-100 flex justify-between items-center flex-wrap gap-2">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Current Session Subscribers ({subscribedEmails.length}):
            </span>
            <div className="flex flex-wrap gap-2 max-w-[70%] justify-end">
              {subscribedEmails.map((email, idx) => (
                <span key={idx} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-mono px-2.5 py-1 rounded-sm transition-all">
                  {email}
                </span>
              ))}
            </div>
          </div>
        )}
      </footer>

      {/* Elegant Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: [1, 1.05, 1]
            }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ 
              opacity: { duration: 0.2, ease: "easeOut" },
              y: { duration: 0.2, ease: "easeOut" },
              scale: {
                repeat: Infinity,
                duration: 3.0,
                ease: "easeInOut"
              }
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 bg-slate-950 text-white border border-slate-800 p-3.5 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-900 hover:border-slate-700 transition-all flex items-center justify-center group"
            title="Scroll back to top"
            aria-label="Scroll to top"
            id="scroll-to-top-button"
            whileHover={{ 
              scale: 1.12,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:-translate-y-0.5 transition-transform stroke-[1.75]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Elegant Quick View Modal Popup */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal 
            product={quickViewProduct} 
            onClose={() => setQuickViewProduct(null)} 
            products={products}
            onSelectProduct={setQuickViewProduct}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Product Specification Comparison overlays */}
      <CompareTray onOpenCompare={() => setIsCompareOpen(true)} />
      <AnimatePresence>
        {isCompareOpen && (
          <CompareModal 
            isOpen={isCompareOpen} 
            onClose={() => setIsCompareOpen(false)}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <StoreLayout />
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}

