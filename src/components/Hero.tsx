import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 mb-6">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">New Arrivals Just Landed</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 uppercase">
            Create Your <br />
            <span className="text-cyan-600 italic font-serif lowercase">aquatic</span> <br />
            Masterpiece.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            From rare exotic fish to meticulously curated hardscapes, AquaVibe provides everything you need to build a thriving underwater ecosystem.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold flex items-center gap-2 hover:bg-slate-800 transition-all group">
              Shop Collections
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-full font-bold hover:bg-slate-50 transition-all">
              Learn about Care
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative px-4"
        >
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl skew-y-1">
            <img 
              src="https://images.unsplash.com/photo-1544255562-f254e43f5540?auto=format&fit=crop&q=80&w=1200" 
              alt="Beautiful Aquarium Fish"
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
          </div>
          
          {/* Floating Stats */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[180px]">
            <p className="text-3xl font-bold text-slate-900 leading-none mb-1">200+</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Rare Species</p>
          </div>
          <div className="absolute -top-6 -right-6 bg-cyan-600 text-white p-6 rounded-2xl shadow-xl max-w-[180px]">
            <p className="text-sm font-medium uppercase tracking-widest mb-1">Global Shipping</p>
            <p className="text-xl font-bold leading-tight">Live Arrival Guaranteed</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
