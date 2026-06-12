import React from 'react';

export default function MoodCard({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl text-left transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden ${
        isActive 
          ? 'border-indigo-500/60 ring-1 ring-indigo-500/40 shadow-glow-indigo bg-indigo-950/20' 
          : 'hover:border-slate-700 hover:bg-slate-800/20'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      
      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <span className="text-3xl p-2 bg-slate-800/60 rounded-xl w-max border border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
          {item.icon}
        </span>
        <div>
          <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors duration-200">
            {item.mood}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Explore {item.verses.length} selected guidance maps
          </p>
        </div>
      </div>
    </button>
  );
}