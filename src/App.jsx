import React, { useState } from 'react';
import { versesMatrix } from './data/versesMatrix';
import MoodGrid from './components/MoodGrid';
import SearchBar from './components/SearchBar';
import VerseDisplay from './components/VerseDisplay';

function App() {
  const [selectedMoodId, setSelectedMoodId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Search logic filtering through names, internal verses, context, and semantic tags
  const filteredMatrix = versesMatrix.filter((moodItem) => {
    const matchesQuery = (text) => text.toLowerCase().includes(searchQuery.toLowerCase());
    
    const moodMatches = matchesQuery(moodItem.mood);
    const verseMatches = moodItem.verses.some(verse => 
      matchesQuery(verse.translation) || 
      matchesQuery(verse.surah) || 
      verse.tags.some(tag => matchesQuery(tag))
    );

    return searchQuery === '' ? true : (moodMatches || verseMatches);
  });

  // Calculate dynamic source structure
  const activeMoodData = versesMatrix.find(item => item.id === selectedMoodId);

  // Fallback search handling to map direct queries onto view blocks
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query !== '') {
      setSelectedMoodId(null); // Deselect mood cards during manual text queries
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans antialiased relative overflow-x-hidden">
      
      {/* Decorative Radial Backdrop Ambient Glow Filters */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Global Application Header */}
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center space-y-4 relative z-10">
       
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 via-slate-100 to-emerald-200 bg-clip-text text-transparent">
          BAYAN
        </h1>
        <p className="mt-2 text-slate-400 max-w-lg mx-auto text-sm md:text-base font-light leading-relaxed">
          An intuitive emotional mapping framework bridging human mental states directly to contextual Quranic wisdom and practical day-to-day action items.
        </p>
      </header>

      {/* Main Core Layout Grid */}
      <main className="max-w-5xl mx-auto px-6 pb-32 space-y-12 relative z-10">
        
        {/* Step 1: Universal Search Filter Option */}
        <section className="w-full">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </section>

        {/* Step 2: Direct Selector Engine Matrix */}
        {searchQuery === '' && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center md:text-left">
              Select Your Current Disposition
            </h3>
            <MoodGrid 
              matrix={versesMatrix} 
              selectedId={selectedMoodId} 
              onSelect={setSelectedMoodId} 
            />
          </section>
        )}

        {searchQuery !== '' && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Filter Queries Active ({filteredMatrix.length} Mood Profiles Identified)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredMatrix.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedMoodId(item.id); setSearchQuery(''); }}
                  className="glass-card p-4 rounded-xl text-left text-xs font-medium hover:bg-slate-800/30 transition-colors border border-slate-800 text-slate-300"
                >
                  {item.icon} {item.mood}
                </button>
              ))}
            </div>
          </section>
        )}

        <hr className="border-slate-800/40" />

        {/* Step 3: Layout Panel Display */}
        <section className="min-h-[250px]">
          {activeMoodData ? (
            <VerseDisplay data={activeMoodData} />
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-16 text-center glass-card">
              <span className="text-4xl mb-4 p-3 bg-slate-900/60 rounded-full border border-slate-800">📖</span>
              <h3 className="text-sm font-semibold text-slate-300">No Target Active</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Interact with the mood cards or use the global filter query layout above to surface curated diagnostic data.
              </p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default App;