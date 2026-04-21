import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-cyan-600" />
                <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-bold">
                  {items.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-slate-500 font-medium">Your sanctuary is empty</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 text-cyan-600 font-bold text-sm uppercase tracking-widest hover:underline"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-bold text-slate-900">{item.name}</h3>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">${item.price.toFixed(2)} / unit</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded transition-colors text-slate-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded transition-colors text-slate-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                <div className="flex justify-between mb-6">
                  <p className="text-slate-500 font-medium">Subtotal</p>
                  <p className="text-2xl font-black text-slate-900">${subtotal.toFixed(2)}</p>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-[0.2em]">
                  Secure encrypted checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
