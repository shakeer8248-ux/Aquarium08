import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Product, Order } from '../types';
import { 
  Plus, 
  Trash2, 
  LogOut, 
  Package, 
  ShoppingBag, 
  ChevronRight, 
  CircleCheck, 
  Clock,
  LayoutGrid,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../lib/FirebaseProvider';
import { PRODUCTS } from '../constants';

export default function AdminPanel() {
  const { logout } = useFirebase();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const handleSeed = async () => {
    if (confirm('Seed database with initial products?')) {
      for (const product of PRODUCTS) {
        const { id, ...data } = product;
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: new Date().toISOString()
        });
      }
      alert('Seeding complete.');
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'fish',
    difficulty: 'Easy'
  });

  useEffect(() => {
    const productsQuery = query(collection(db, 'products'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    }, (err) => handleFirestoreError(err, 'list', 'products'));

    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    }, (err) => handleFirestoreError(err, 'list', 'orders'));

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: new Date().toISOString()
      });
      setIsAddingProduct(false);
      setNewProduct({ category: 'fish', difficulty: 'Easy' });
    } catch (err) {
      handleFirestoreError(err, 'create', 'products');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        handleFirestoreError(err, 'delete', `products/${id}`);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (err) {
      handleFirestoreError(err, 'update', `orders/${orderId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-8 fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
            <LayoutGrid size={24} />
          </div>
          <span className="text-xl font-bold uppercase tracking-tight">Admin Console</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'products' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <Package size={20} />
            Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <ShoppingBag size={20} />
            Orders
          </button>
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all mt-auto"
        >
          <LogOut size={20} />
          Exit Admin
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              {activeTab === 'products' ? 'Product Fleet' : 'Command Center (Orders)'}
            </h1>
            <p className="text-slate-500 font-medium tracking-wide border-l-2 border-cyan-600 pl-4 uppercase text-xs">
              AquaVibe Systems v1.0
            </p>
          </div>
          
          {activeTab === 'products' && (
            <div className="flex gap-4">
              <button 
                onClick={handleSeed}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
              >
                <Database size={20} />
                Seed Data
              </button>
              <button 
                onClick={() => setIsAddingProduct(true)}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>
          )}
        </header>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex gap-6 group hover:shadow-xl transition-all duration-300">
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 py-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{p.name}</h3>
                      <p className="text-sm text-slate-400 italic">{p.scientificName}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <span className="text-xl font-black text-slate-900">${p.price.toFixed(2)}</span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase rounded-md border border-slate-100">
                      {p.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o: any) => (
              <div key={o.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 overflow-hidden">
                       <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID: #{o.id.slice(-6)}</p>
                      <h3 className="text-xl font-bold text-slate-900">{o.customerEmail}</h3>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
                      <Clock size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <select 
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      className="px-4 py-2 bg-cyan-50 border border-cyan-100 rounded-full text-xs font-bold text-cyan-700 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Manifest</h4>
                    <div className="space-y-4">
                      {o.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-900">
                            {item.quantity}x <span className="text-slate-500 ml-1">{item.name}</span>
                          </span>
                          <span className="text-slate-900 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-end h-full">
                      <span className="text-4xl font-black text-slate-900">${o.total.toFixed(2)}</span>
                      <div className="flex items-center gap-2 text-green-600">
                        <CircleCheck size={18} />
                        <span className="text-[10px] uppercase font-black tracking-widest leading-none">Paid in Full</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingProduct(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl z-[201] p-12"
            >
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8">Add New Asset</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Name</label>
                  <input 
                    required
                    value={newProduct.name || ''}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Scientific Name</label>
                  <input 
                    value={newProduct.scientificName || ''}
                    onChange={e => setNewProduct({...newProduct, scientificName: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Price ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price || ''}
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-cyan-500 uppercase font-bold text-sm tracking-wide"
                  >
                    <option value="fish">Fish</option>
                    <option value="plants">Plants</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Difficulty</label>
                  <select 
                    value={newProduct.difficulty}
                    onChange={e => setNewProduct({...newProduct, difficulty: e.target.value as any})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-cyan-500 uppercase font-bold text-sm tracking-wide"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Image URL (Unsplash/CDN)</label>
                  <input 
                    required
                    value={newProduct.image || ''}
                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Description</label>
                  <textarea 
                    rows={3}
                    value={newProduct.description || ''}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
                <div className="col-span-2 flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-bold hover:bg-cyan-500 transition-all uppercase tracking-widest"
                  >
                    Enlist Asset
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
