import React, { useState, useRef, useEffect } from 'react';

export default function VerseDisplay({ data }) {
  const [openTafsirId, setOpenTafsirId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  
  // Audio state engine: 'idle' | 'loading' | 'playing' | 'error'
  const [playbackState, setPlaybackState] = useState('idle');
  const [playingVerseId, setPlayingVerseId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const audioRef = useRef(null);

  // Clean up streaming instances if the user switches the active emotion card
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlaybackState('idle');
      setPlayingVerseId(null);
    };
  }, [data]);

  const toggleTafsir = (id) => {
    setOpenTafsirId(openTafsirId === id ? null : id);
  };

  const handleCopy = (verseText, ref, id) => {
    const textToCopy = `"${verseText}" - Surah ${ref} | Contextualized via Bayan`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generates clean, zero-padded endpoints dynamically for Cloudflare
  const playCloudflareAudio = (verse) => {
    setErrorMessage('');

    // Toggle stop if clicking the currently playing track
    if (playbackState === 'playing' && playingVerseId === verse.id) {
      audioRef.current.pause();
      setPlaybackState('idle');
      setPlayingVerseId(null);
      return;
    }

    // Terminate any existing audio instances safely
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlaybackState('loading');
    setPlayingVerseId(verse.id);

    try {
      // Safely split "13:28" into ["13", "28"]
      const [surahNum, ayahNum] = verse.ayahNumber.split(':');
      const paddedSurah = surahNum.padStart(3, '0');
      const paddedAyah = ayahNum.padStart(3, '0');
      
      // TARGET CHANGED TO SUDAIS HERE 👇
      const targetUrl = `https://verses.quran.com/Sudais/mp3/${paddedSurah}${paddedAyah}.mp3`;

      const audio = new Audio();
      audio.crossOrigin = "anonymous"; // Prevents CORS request blocks
      audio.src = targetUrl;
      audio.volume = 1.0;

      audio.oncanplaythrough = () => {
        audio.play()
          .then(() => {
            setPlaybackState('playing');
          })
          .catch((err) => {
            setPlaybackState('error');
            setErrorMessage("Browser blocked auto-stream. Click once more to play.");
            console.error(err);
          });
      };

      audio.onended = () => {
        setPlaybackState('idle');
        setPlayingVerseId(null);
      };

      audio.onerror = () => {
        setPlaybackState('error');
        setErrorMessage("Cloudflare link handshake failed. Verify device sound output.");
      };

      audioRef.current = audio;

    } catch (err) {
      setPlaybackState('error');
      setErrorMessage("Could not parse chapter numbers correctly.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-y-1 md:space-y-0 flex-col md:flex-row justify-between border-b border-slate-800/80 pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-200">
          Selected Wisdom for: <span className="text-indigo-400 font-medium">{data.mood}</span>
        </h2>
        <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${playbackState === 'playing' ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`}></span>
          Sheikh Al-Sudais Recitation Active
        </span>
      </div>

      {data.verses.map((verse) => (
        <div key={verse.id} className="glass-card rounded-2xl overflow-hidden shadow-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md">
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Audio Control Elements */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/40 pb-3">
              <button
                onClick={() => playCloudflareAudio(verse)}
                className={`text-xs px-4 py-2 rounded-lg border font-semibold transition-all duration-300 ${
                  playbackState === 'playing' && playingVerseId === verse.id
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
                    : playbackState === 'loading' && playingVerseId === verse.id
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/40 animate-pulse cursor-wait'
                    : 'bg-emerald-500 text-slate-950 border-emerald-600 font-bold hover:bg-emerald-400'
                }`}
                disabled={playbackState === 'loading' && playingVerseId === verse.id}
              >
                {playbackState === 'playing' && playingVerseId === verse.id && '🛑 Stop Recitation'}
                {playbackState === 'loading' && playingVerseId === verse.id && '⏳ Buffering Audio...'}
                {playbackState === 'idle' && '▶ Listen to Ayah'}
                {playbackState === 'error' && playingVerseId === verse.id && '🔄 Retry Playback'}
                {playbackState !== 'idle' && playingVerseId !== verse.id && '▶ Listen to Ayah'}
              </button>
              
              <span className="text-xs font-semibold tracking-wider text-slate-500 font-sans">
                Surah {verse.surah} • {verse.ayahNumber}
              </span>
            </div>

            {/* Error Message Diagnostic Box */}
            {playbackState === 'error' && playingVerseId === verse.id && (
              <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl text-left">
                <p className="text-xs text-rose-400 font-mono">
                  <span className="font-bold">System Status:</span> {errorMessage}
                </p>
              </div>
            )}

            {/* Arabic Script Layout */}
            <div className="text-right py-2">
              <p className="font-arabic text-3xl md:text-4xl text-emerald-100 leading-loose tracking-wide select-all antialiased">
                {verse.arabic}
              </p>
            </div>

            {/* English Translation View */}
            <div className="border-l-2 border-indigo-500/40 pl-4 py-1">
              <p className="text-slate-300 text-sm md:text-base italic leading-relaxed font-light">
                "{verse.translation}"
              </p>
            </div>

            {/* Interactive Tafsir Toggle Accordion Container */}
            <div className="border-t border-slate-800/60 pt-4">
              <button
                onClick={() => toggleTafsir(verse.id)}
                className="w-full flex items-center justify-between text-left text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors duration-150 py-1"
              >
                <span className="flex items-center gap-2">
                  📖 {openTafsirId === verse.id ? 'Hide Context & Tafsir' : 'Reveal Deep Context & Tafsir'}
                </span>
                <span>{openTafsirId === verse.id ? '▲' : '▼'}</span>
              </button>

              {openTafsirId === verse.id && (
                <div className="mt-3 text-slate-400 text-sm bg-slate-900/40 border border-slate-800 p-4 rounded-xl leading-relaxed">
                  {verse.context}
                </div>
              )}
            </div>

            {/* Practical Action Execution Protocol Maps */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                ⚡ Real-Life Practical Application Plan
              </h4>
              <ul className="space-y-2.5">
                {verse.actionPlan.map((step, idx) => (
                  <li key={idx} className="flex items-start text-xs md:text-sm text-slate-300">
                    <span className="text-emerald-500 mr-2 font-bold select-none">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Utilities Tag Filters */}
            <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
              <div className="flex flex-wrap gap-1.5">
                {verse.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] bg-slate-800 text-slate-400 font-medium px-2.5 py-0.5 rounded-md border border-slate-700/30">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleCopy(verse.translation, verse.ayahNumber, verse.id)}
                className={`text-xs px-4 py-2 rounded-xl border font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  copiedId === verse.id
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-800/40 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {copiedId === verse.id ? '✓ Copied' : '📋 Copy Text'}
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}