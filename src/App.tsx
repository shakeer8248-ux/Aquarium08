import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import { db, handleFirestoreError } from './lib/firebase';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { useFirebase } from './lib/FirebaseProvider';
import { Product, CartItem } from './types';
import { ArrowRight, Mail, Instagram, Facebook, Twitter, Anchor, Loader2 } from 'lucide-react';

export default function App() {
  const { user, loading, isAdmin, logout, login } = useFirebase();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    }, (err) => handleFirestoreError(err, 'list', 'products'));
    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in to place an order.');
      return;
    }
    
    setIsOrdering(true);
    try {
      const orderTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await addDoc(collection(db, 'orders'), {
        customerEmail: user.email,
        customerUid: user.uid,
        items: cartItems,
        total: orderTotal,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      alert('Order placed successfully! High-five from the ocean.');
      setCartItems([]);
      setIsCartOpen(false);
    } catch (err) {
      handleFirestoreError(err, 'create', 'orders');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  // Admin routing
  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-100 selection:text-cyan-900">
      <Navbar 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      {/* Auth State Bar */}
      <div className="fixed top-24 left-6 z-40">
        {user ? (
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-slate-100 p-2 pr-6 rounded-full shadow-sm group">
            <img src={user.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Logged In</span>
              <span className="text-xs font-bold text-slate-900">{user.displayName}</span>
            </div>
            <button 
              onClick={logout}
              className="ml-4 text-slate-300 hover:text-slate-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            className="flex items-center gap-3 bg-slate-900 text-white p-2 pr-6 rounded-full shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
              <ArrowRight size={16} />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest">Sign In</span>
          </button>
        )}
      </div>

      <main>
        <Hero />

        {/* Collections Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <p className="text-cyan-600 font-black uppercase tracking-[0.3em] text-sm mb-4">The Collection</p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                Expertly Curated <br />
                <span className="text-slate-300">Aquatics.</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
              {['all', 'fish', 'plants', 'equipment'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Synchronizing Sanctuary Assets...</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))
            )}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900" />
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6">
              Join the underwater <br />
              <span className="text-cyan-500">Revolution.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
              Get exclusive care guides, first access to rare restocks, and 10% off your first aquatic addition.
            </p>
            {!user ? (
               <button 
                 onClick={login}
                 className="px-12 py-5 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all flex items-center justify-center gap-2 mx-auto uppercase tracking-[0.2em]"
               >
                 Register My Sanctuary <ArrowRight size={18} />
               </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
                <button 
                  type="submit"
                  className="px-8 py-4 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
                >
                  Join Now <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white pt-32 pb-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white">
                  <Anchor size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">AquaVibe</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Premium aquatic life and ecosystems delivered to your door with unmatched care and expertise.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-100 transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-100 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-100 transition-all">
                  <Facebook size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Shop</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li><a href="#" className="hover:text-cyan-600 transition-colors">Exotic Fish</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition-colors">Aquatic Plants</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition-colors">Rimless Tanks</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition-colors">Hardscape</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Support</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li><a href="#" className="hover:text-cyan-600 transition-colors">Care Guides</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition-colors">Live Arrival Guarantee</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition-colors">Contact Expert</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Contact</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li className="flex items-center gap-3"><Mail size={16} /> support@aquavibe.com</li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 leading-relaxed">123 Coral Terrace,<br />Undersea Valley, OC 90210</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-50 gap-4">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              © 2026 AquaVibe Labs. All rights reserved.
            </p>
            <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

