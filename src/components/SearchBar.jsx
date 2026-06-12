import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="max-w-md mx-auto relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg transition-colors group-focus-within:text-indigo-400">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search themes (e.g., Peace, Grief, Abundance)..."
        className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-200 placeholder-slate-500 text-sm font-medium glass-input outline-none transition-all duration-300"
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-300 bg-slate-800 px-2 py-0.5 rounded"
        >
          CLEAR
        </button>
      )}
    </div>
  );
}