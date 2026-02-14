'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Check, X, User, Filter, MessageSquare, Headphones, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function QAPage() {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSpeaker, setFilterSpeaker] = useState('');
  
  // Review State
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/recordings/pending');
      setRecordings(res.data);
    } catch (error) {
      console.error('Failed to fetch pending recordings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (id: string) => {
    try {
        setRecordings(prev => prev.filter(r => r.id !== id));
        await api.post(`/recordings/${id}/review`, { status: 'APPROVED' });
    } catch (error) {
        console.error('Failed to approve:', error);
        fetchPending();
    }
  };

  const openRejectModal = (id: string) => {
    setReviewingId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!reviewingId) return;
    const id = reviewingId;
    setShowRejectModal(false);
    
    try {
        setRecordings(prev => prev.filter(r => r.id !== id));
        await api.post(`/recordings/${id}/review`, {
            status: 'REJECTED',
            comment: rejectReason,
        });
    } catch (error) {
        console.error('Failed to reject:', error);
        fetchPending();
    }
  };

  const filteredRecordings = recordings.filter(r => {
    if (!filterSpeaker) return true;
    return r.speaker?.displayName?.toLowerCase().includes(filterSpeaker.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                    <ShieldCheck className="text-purple-600 w-6 h-6" />
                </div>
                Quality Assurance
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Review and validate outgoing audio recordings.</p>
        </div>
        <div className="relative group">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input 
                type="text" 
                placeholder="Filter by Speaker..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-sm transition w-64"
                value={filterSpeaker}
                onChange={(e) => setFilterSpeaker(e.target.value)}
            />
        </div>
      </header>

      <div className="space-y-4">
        {loading ? (
             <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3 animate-pulse">
                <Loader2 size={32} className="animate-spin text-purple-200" />
                Loading queue...
             </div>
        ) : filteredRecordings.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="p-4 bg-green-50 rounded-full mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-500 mt-2 max-w-sm">There are no pending recordings to review at this moment.</p>
            </div>
        ) : (
            filteredRecordings.map((rec) => (
                <div key={rec.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition duration-200 group">
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                                <User size={12} className="text-gray-500" />
                                {rec.speaker?.displayName || 'Unknown'}
                            </span>
                            <span className={`text-[10px] uppercase font-bold tracking-wide px-2 py-1 rounded-md border
                                ${rec.style === 'AD_HYPE' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-500 border-gray-100'}
                            `}>
                                {rec.style}
                            </span>
                        </div>
                        <p className="font-medium text-gray-900 text-lg leading-snug line-clamp-2" title={rec.sentence?.textArabizi}>
                            {rec.sentence?.textArabizi}
                        </p>
                    </div>

                    {/* Audio Player */}
                    <div className="flex-shrink-0 bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                            <Headphones size={18} />
                         </div>
                         <audio controls src={rec.url} className="h-8 w-64 md:w-72" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
                        <button 
                            onClick={() => handleApprove(rec.id)}
                            className="p-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition duration-200"
                            title="Approve Recording"
                        >
                            <Check size={20} strokeWidth={3} />
                        </button>
                        <button 
                            onClick={() => openRejectModal(rec.id)}
                            className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 transition duration-200"
                            title="Reject Recording"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className="flex items-center gap-3 mb-6 text-red-600">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Reject Recording</h3>
                </div>
                
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Reason for Rejection <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                </label>
                <textarea 
                    className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-gray-800 placeholder:text-gray-400"
                    placeholder="Describe the issue (noise, mispronunciation, silence)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    autoFocus
                />

                <div className="flex justify-end gap-3 mt-8">
                    <button 
                        onClick={() => setShowRejectModal(false)}
                        className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleReject}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-semibold shadow-lg shadow-red-200 hover:shadow-xl transition transform hover:-translate-y-0.5"
                    >
                        Confirm Rejection
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
