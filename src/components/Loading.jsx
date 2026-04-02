import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-transparent animate-in fade-in duration-700">
      
      {/* 3D Core Loader Container */}
      <div className="relative perspective-1000">
        
        {/* Bola Inti (The Core) */}
        <div className="w-14 h-14 bg-gradient-to-tr from-red-600 to-rose-500 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.4)] animate-bounce-slow z-20 relative flex items-center justify-center">
          {/* Efek Kilau / Highlight */}
          <div className="absolute top-2 left-3 w-4 h-4 bg-white/30 rounded-full blur-[1px]"></div>
          
          {/* Inner Pulse Effect */}
          <div className="w-8 h-8 border-2 border-white/20 rounded-full animate-ping"></div>
        </div>

        {/* Ring Orbit 1 - Horizontal */}
        <div className="absolute inset-[-12px] border-[2px] border-red-500/30 rounded-full animate-[spin_2.5s_linear_infinite] [transform:rotateX(75deg)_rotateY(15deg)]"></div>
        
        {/* Ring Orbit 2 - Vertical */}
        <div className="absolute inset-[-12px] border-[2px] border-slate-900/10 rounded-full animate-[spin_3.5s_linear_infinite_reverse] [transform:rotateY(75deg)_rotateX(15deg)] shadow-inner"></div>

        {/* Shadow Dynamic */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-900/10 rounded-[100%] blur-md animate-shadow-pulse"></div>
      </div>

      {/* Text Branding & Progress */}
      <div className="mt-20 flex flex-col items-center gap-3">
        <div className="text-center">
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-800 leading-none">
            Sinkronisasi Data
          </h2>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 italic">
            Mohon tunggu sebentar
          </p>
        </div>

        {/* Triple Dot Animation */}
        <div className="flex gap-2 mt-1">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        
        .animate-bounce-slow {
          animation: bounce-custom 2s ease-in-out infinite;
        }

        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-25px) scale(1.05); }
        }

        .animate-shadow-pulse {
          animation: shadow-pulse 2s ease-in-out infinite;
        }

        @keyframes shadow-pulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
          50% { transform: translateX(-50%) scale(2); opacity: 0.1; }
        }
      `}} />
    </div>
  );
};

export default Loading;