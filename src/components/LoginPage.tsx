import React from 'react';
import { useFirebase } from '../lib/FirebaseProvider';
import { motion } from 'motion/react';
import { Fish, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useFirebase();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white border border-slate-100 p-12 rounded-[3rem] shadow-xl text-center"
      >
        <div className="w-20 h-20 bg-cyan-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-cyan-200">
           <Fish size={40} />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">
          Enter the <br />
          <span className="text-cyan-600 italic font-serif lowercase">sanctuary</span>
        </h1>
        
        <p className="text-slate-500 text-sm mb-12 leading-relaxed px-4">
          Join the community of elite aquarists. Sign in to manage your orders, track shipments, and access rare collections.
        </p>

        <button 
          onClick={login}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all group active:scale-[0.98]"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 invert" />
          Continue with Google
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-widest leading-loose">
          Secure biometric-ready authentication <br />
          By continuing, you agree to our terms
        </p>
      </motion.div>
      
      <div className="mt-12 text-center relative z-10">
         <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
            AquaVibe Labs / Global Distribution
         </p>
      </div>
    </div>
  );
}
