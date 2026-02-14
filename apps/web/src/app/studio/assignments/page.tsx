'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, Plus, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AssignmentsPage() {
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [count, setCount] = useState(50);
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/assignments/stats');
      setSpeakers(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpeaker || count <= 0) return;

    setAssigning(true);
    setMessage(null);

    try {
      const res = await api.post('/assignments', {
        speakerId: selectedSpeaker,
        count: Number(count)
      });
      
      setMessage({ type: 'success', text: `Successfully assigned ${res.data.count} sentences.` });
      await fetchStats();
      setSelectedSpeaker('');
      
      // Auto-clear success message
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      console.error('Failed to assign:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create assignments' });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="text-blue-600 w-6 h-6" />
                </div>
                Assignments
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Manage workload distribution and monitor team progress.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Assignments Form - Sticky Panel */}
        <div className="lg:col-span-4 sticky top-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Plus size={24} className="opacity-80" />
                        Assign Work
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">Distribute available sentences to speakers.</p>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleAssign} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Speaker</label>
                            <div className="relative">
                                <select 
                                    value={selectedSpeaker} 
                                    onChange={e => setSelectedSpeaker(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none text-gray-700"
                                    required
                                >
                                    <option value="">Choose a speaker...</option>
                                    {speakers.map(s => (
                                        <option key={s.id} value={s.id}>{s.displayName}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ArrowRight size={16} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Sentences</label>
                            <input 
                                type="number" 
                                value={count} 
                                onChange={e => setCount(Number(e.target.value))}
                                min="1"
                                max="1000"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-medium text-gray-700"
                            />
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                Randomly selected from unassigned pool.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={assigning || !selectedSpeaker}
                            className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-black transition font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {assigning ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} className="group-hover:scale-110 transition-transform" />}
                            {assigning ? 'Assigning...' : 'Create Assignments'}
                        </button>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                                <span className="font-medium leading-relaxed">{message.text}</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>

        {/* Stats Table */}
        <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Speaker Progress</h2>
                    <span className="text-sm font-medium text-gray-400">{speakers.length} Active Speakers</span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Speaker</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">Assigned</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">Recorded</th>
                                <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">Approved</th>
                                <th className="px-8 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider w-1/4">Completion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-500 animate-pulse">Loading stats...</td></tr>
                            ) : speakers.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-500">No speakers found.</td></tr>
                            ) : (
                                speakers.map((s) => {
                                    const total = s.stats.total || 1;
                                    const done = s.stats.recorded + s.stats.approved;
                                    const percentage = Math.round((done / total) * 100);
                                    
                                    return (
                                        <tr key={s.id} className="hover:bg-blue-50/30 transition group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200 shadow-sm">
                                                        {s.displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition">{s.displayName}</div>
                                                        <div className="text-xs text-gray-500">{s.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold font-mono">
                                                    {s.stats.assigned}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold font-mono">
                                                    {s.stats.recorded}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold font-mono">
                                                    {s.stats.approved}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="font-medium text-gray-700">{percentage}%</span>
                                                        <span className="text-gray-400">{done}/{total}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-full shadow-inner">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-sm" 
                                                            style={{ width: `${percentage}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
