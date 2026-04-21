import React from 'react';
import { motion } from 'motion/react';
import { Plus, BadgeCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-500"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${difficultyColors[product.difficulty]}`}>
            {product.difficulty}
          </span>
          {product.category === 'fish' && (
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-wider border border-slate-100">
              Freshwater
            </span>
          )}
        </div>
        <button 
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cyan-600 hover:text-white"
        >
          <Plus size={24} />
        </button>
      </div>
      <div className="p-8">
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em] mb-1">{product.category}</p>
          <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
          <p className="text-sm italic text-slate-500 serif">{product.scientificName}</p>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 mb-6 min-h-[40px]">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <p className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-1 text-cyan-600">
            <BadgeCheck size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Health Guaranteed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
