'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Mic, Play, Calendar, ExternalLink, Activity, Award, TrendingUp, Clock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentRecordings, setRecentRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, recentRes] = await Promise.all([
          api.get('/speakers/stats'),
          api.get('/recordings/my-last-five'),
        ]);
        setStats(statsRes.data);
        setRecentRecordings(recentRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
        <div className="max-w-6xl mx-auto p-8 flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4 text-gray-400 animate-pulse">
                <Activity size={32} />
                <span className="text-sm font-medium">Loading your studio...</span>
            </div>
        </div>
    );
  }

  const completionPercentage = stats 
    ? Math.round((stats.recordedCount / (stats.totalSentences || 1)) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-lg text-gray-500 mt-2">Here is your studio overview and progress.</p>
        </div>
        <Link 
            href="/studio/record" 
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
        >
            <Mic size={20} />
            Start Recording
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Card */}
        <section className="col-span-1 lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition duration-700"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Award className="text-yellow-500" />
                            Recording Progress
                        </h2>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-4xl font-extrabold text-gray-900">{stats?.recordedCount}</span>
                            <span className="text-lg text-gray-400 font-medium">/ {stats?.totalSentences} sentences</span>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-xl">
                        {completionPercentage}%
                    </div>
                </div>
                
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-0.5">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden" 
                        style={{ width: `${completionPercentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition hover:bg-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Recorded</div>
                        <div className="text-2xl font-bold text-gray-800">{stats?.recordedCount}</div>
                    </div>
                    <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 transition hover:bg-purple-100">
                        <div className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-1">Pending</div>
                        <div className="text-2xl font-bold text-purple-900">
                            {(stats?.totalSentences || 0) - (stats?.recordedCount || 0)}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Stats Summary */}
        <section className="col-span-1 space-y-6">
             {/* Neutral Stats */}
             <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center gap-4 hover:scale-[1.02] transition duration-300">
                <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                    <Activity size={24} />
                </div>
                <div>
                   <div className="text-sm font-medium text-gray-500">Neutral Style</div>
                   <div className="text-2xl font-bold text-gray-900">{stats?.styleBreakdown?.NEUTRAL || 0}</div>
                </div>
             </div>
             
             {/* Ad-Hype Stats */}
             <div className="bg-white p-6 rounded-3xl shadow-lg shadow-purple-200/50 border border-purple-50 flex items-center gap-4 hover:scale-[1.02] transition duration-300">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                    <TrendingUp size={24} />
                </div>
                <div>
                   <div className="text-sm font-medium text-gray-500">Ad-Hype Style</div>
                   <div className="text-2xl font-bold text-purple-900">{stats?.styleBreakdown?.AD_HYPE || 0}</div>
                </div>
             </div>
        </section>

        {/* Recent Activity */}
        <section className="col-span-1 lg:col-span-3">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="text-gray-400" size={20} />
                Recent Recordings
            </h3>
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {recentRecordings.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
                        <Mic size={32} className="opacity-20" />
                        <p>No activity yet. Start recording to see your history.</p>
                    </div>
                ) : (
                    recentRecordings.map((rec) => (
                        <div key={rec.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition group">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="font-semibold text-gray-900 mb-1.5 truncate text-lg group-hover:text-blue-700 transition">
                                    {rec.sentence.textArabizi}
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                    <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                                        <Calendar size={12} />
                                        {new Date(rec.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide border
                                        ${rec.style === 'AD_HYPE' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-600 border-gray-100'}
                                    `}>
                                        {rec.style}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-4 sm:mt-0 flex items-center gap-4">
                                <audio controls src={rec.url} className="h-9 w-full sm:w-56" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
      </div>
    </div>
  );
}
