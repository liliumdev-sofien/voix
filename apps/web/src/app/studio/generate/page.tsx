'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Mic, Play, Download, Loader2, Wand2, Sparkles, Volume2 } from 'lucide-react';

export default function Generate() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await api.post('/generation', { text }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
      setAudioUrl(url);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.message || 'Failed to generate audio. Ensure backend is running and model is loaded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Input */}
        <div className="space-y-8">
            <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
                    <Sparkles size={12} />
                    F5-TTS Generation
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Turn text into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">lifelike speech</span>.
                </h1>
                <p className="text-lg text-gray-500 mt-4 leading-relaxed">
                    Generate high-quality Tounsi audio from text inputs. Perfect for content creation, testing, and demos.
                </p>
            </header>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-2 focus-within:ring-4 focus-within:ring-blue-500/10 transition-shadow duration-300">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type something in Tounsi or Arabizi..."
                    rows={6}
                    className="w-full p-6 bg-transparent border-none focus:ring-0 resize-none text-xl text-gray-800 placeholder:text-gray-300 leading-relaxed"
                />
                <div className="px-6 pb-4 flex justify-between items-center border-t border-gray-50 pt-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {text.length} Characters
                    </span>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !text.trim()}
                        className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-black hover:scale-105 transition-all font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
            
             {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-3">
                    <div className="p-1 bg-red-100 rounded-full shrink-0">
                        <Volume2 size={14} />
                    </div>
                    {error}
                </div>
            )}
        </div>

        {/* Right Column: Output / Visualization */}
        <div className="relative h-full min-h-[400px] bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {audioUrl ? (
                <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg mb-6 ring-4 ring-blue-50">
                        <Play size={32} className="fill-current ml-1" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Generation Complete!</h3>
                    <p className="text-sm text-gray-500 mb-6">Your audio is ready to play.</p>
                    
                    <audio controls src={audioUrl} className="w-full mb-4" />
                    
                    <a 
                        href={audioUrl} 
                        download="generated_tounsi.wav"
                        className="block w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold transition border border-gray-200 text-sm"
                    >
                        Download WAV
                    </a>
                </div>
            ) : (
                <div className="relative z-10 text-center opacity-40">
                    <div className="w-32 h-32 mx-auto bg-gray-200/50 rounded-full flex items-center justify-center mb-6">
                         <Volume2 size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Ready to Create</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">Enter text on the left to synthesize speech using the neural model.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
