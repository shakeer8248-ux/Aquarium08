import React from 'react';
import { ShoppingCart, Fish, Search, Menu } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white">
            <Fish size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">AquaVibe</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">Fish</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">Plants</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">Tanks</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">Support</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <Search size={20} />
          </button>
          <button 
            onClick={onCartClick}
            className="group relative p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
