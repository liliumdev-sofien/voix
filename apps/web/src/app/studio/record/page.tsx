'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import Recorder from '@/components/Recorder';
import { Loader2, CheckCircle2, ChevronRight, Mic, Sparkles } from 'lucide-react';

export default function RecordPage() {
  const [sentence, setSentence] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [nextRes, statsRes] = await Promise.all([
        api.get('/sentences/next'),
        api.get('/speakers/stats'),
      ]);

      if (nextRes.data) {
        setSentence(nextRes.data);
      } else {
        setSentence(null);
        setFinished(true);
      }
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !sentence) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-600 gap-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="font-medium animate-pulse">Loading studio...</span>
      </div>
    );
  }

  if (finished && !sentence) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 max-w-lg mx-auto">
        <div className="p-6 bg-green-50 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <CheckCircle2 className="w-16 h-16 text-green-600 relative z-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">All Caught Up!</h2>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            There are no more sentences assigned to you at the moment. Great work today!
        </p>
        <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Session Total</span>
            <span className="text-3xl font-bold text-gray-900">{stats?.recordedCount} <span className="text-lg text-gray-400 font-normal">/ {stats?.totalSentences}</span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center min-h-[80vh] font-sans">
      
      {/* Progress Header */}
      <div className="w-full mb-12 flex items-center justify-between">
         <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Recording Studio
         </div>
         <div className="text-sm font-medium text-gray-400 tabular-nums">
            {stats ? stats.recordedCount + 1 : '-'} / {stats?.totalSentences || '-'}
         </div>
      </div>

      {/* Sentence Card */}
      <div className="w-full relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-700"></div>
        <div className="relative w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-12 md:p-16 mb-12 text-center min-h-[300px] flex flex-col items-center justify-center border border-gray-50">
            
            <div className={`mb-6 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase inline-flex items-center gap-1.5
                ${sentence?.tags?.style === 'AD_HYPE' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}
            `}>
                {sentence?.tags?.style === 'AD_HYPE' && <Sparkles size={10} />}
                {sentence?.tags?.style || 'NEUTRAL'}
            </div>

            <p className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight tracking-tight font-serif">
                {sentence?.textArabizi}
            </p>
            
            <p className="mt-8 text-sm text-gray-400 font-mono opacity-50 select-text">
                ID: {sentence?.id}
            </p>
        </div>
      </div>

      {/* Recorder Interface */}
      <div className="w-full max-w-xl">
          <Recorder 
            sentenceId={sentence?.id} 
            onRecordingComplete={() => {
                fetchData();
            }} 
          />
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-400 opacity-60 hover:opacity-100 transition">
        <p>Press <kbd className="font-mono bg-gray-100 px-1 rounded text-gray-600">Space</kbd> to start/stop recording</p>
      </div>
    </div>
  );
}
