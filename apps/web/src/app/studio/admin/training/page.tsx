'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { Download, Database, Plus, RefreshCw, Layers, Play, Square, Terminal, Activity, Zap, ChevronRight, Clock } from 'lucide-react';

export default function TrainingPage() {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  // Training State
  const [trainingStatus, setTrainingStatus] = useState<any>(null);
  const [config, setConfig] = useState({ 
    maxSteps: 5000, 
    batchSize: 1, 
    learningRate: 0.0001 
  });
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchSnapshots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dataset/snapshots');
      setSnapshots(res.data);
    } catch (error) {
      console.error('Failed to fetch snapshots:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  // Poll Training Status
  useEffect(() => {
    const pollStatus = async () => {
        try {
            const res = await api.get('/training/status');
            setTrainingStatus(res.data);
        } catch (e) {
            console.error('Failed to poll status', e);
        }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trainingStatus?.logs]);

  const handleGenerate = async () => {
    const name = `snapshot_${new Date().toISOString().slice(0, 10)}_${Date.now()}`;
    setGenerating(true);
    try {
      await api.post('/admin/dataset/snapshot', { name }); 
      setTimeout(async () => {
          await fetchSnapshots();
          setGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to generate snapshot:', error);
      alert('Failed to generate snapshot.');
      setGenerating(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
        const res = await api.get(`/admin/dataset/snapshots/${id}/download`);
        window.open(res.data.url, '_blank');
    } catch (error) {
        console.error('Failed to get download URL:', error);
    }
  };

  const handleStartTraining = async () => {
    if (!confirm(`Start training for ${config.maxSteps} steps? This will run on the server.`)) return;
    try {
        await api.post('/training/start', config);
    } catch (e: any) {
        alert('Failed to start training: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleStopTraining = async () => {
     if (!confirm('Are you sure you want to stop training? The process will be killed.')) return;
     try {
        await api.post('/training/stop');
     } catch (e: any) {
        alert('Failed to stop training: ' + (e.response?.data?.message || e.message));
     }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 font-sans">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Database className="text-indigo-600 w-6 h-6" />
                </div>
                Model Training
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Manage datasets and train F5-TTS models.</p>
        </div>
        <button 
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 group"
        >
            {generating ? <RefreshCw className="animate-spin" size={20} /> : <Plus size={20} className="group-hover:rotate-90 transition-transform" />}
            {generating ? 'Processing...' : 'New Snapshot'}
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Content: Training Terminal & Controls */}
          <div className="xl:col-span-8 space-y-6">
             <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col h-[600px]">
                {/* Terminal Header */}
                <div className="px-4 py-3 bg-gray-950/50 border-b border-gray-800 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Terminal size={18} className="text-gray-400" />
                        <span className="text-sm font-mono text-gray-300">training_session.log</span>
                    </div>
                    {trainingStatus?.running ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-mono border border-green-500/20 animate-pulse">
                            <Activity size={12} />
                            RUNNING (PID: {trainingStatus.pid})
                        </div>
                    ) : (
                         <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-mono border border-gray-700">
                            <Square size={12} />
                            STOPPED
                        </div>
                    )}
                </div>

                {/* Terminal Output */}
                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm text-gray-300 custom-scrollbar bg-black/20">
                    <pre className="whitespace-pre-wrap leading-relaxed">
                        {trainingStatus?.logs || <span className="text-gray-600 italic opacity-50">No logs available. Start training to see output...</span>}
                    </pre>
                    <div ref={logsEndRef} />
                </div>
             </div>
          </div>

          {/* Sidebar: Controls & Datasets */}
          <div className="xl:col-span-4 space-y-8">
             
             {/* Training Controls */}
             <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Zap className="text-yellow-500 fill-yellow-500" size={20} />
                    Configuration
                </h2>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Max Steps</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={config.maxSteps} 
                                onChange={e => setConfig({...config, maxSteps: +e.target.value})} 
                                disabled={trainingStatus?.running}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition font-mono text-sm"
                            />
                            <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Batch Size</label>
                             <input 
                                type="number" 
                                value={config.batchSize} 
                                onChange={e => setConfig({...config, batchSize: +e.target.value})} 
                                disabled={trainingStatus?.running}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition font-mono text-sm"
                             />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">LR</label>
                             <input 
                                type="number" 
                                step="0.0001"
                                value={config.learningRate} 
                                onChange={e => setConfig({...config, learningRate: +e.target.value})} 
                                disabled={trainingStatus?.running}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition font-mono text-sm"
                             />
                        </div>
                    </div>

                    <div className="pt-2">
                        {trainingStatus?.running ? (
                            <button 
                                onClick={handleStopTraining} 
                                className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition font-bold shadow-sm"
                            >
                                <Square size={20} className="fill-current" /> Stop Process
                            </button>
                        ) : (
                            <button 
                                onClick={handleStartTraining} 
                                className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:scale-[1.02] transition-transform font-bold shadow-lg shadow-indigo-200"
                            >
                                <Play size={20} className="fill-current" /> Start Training
                            </button>
                        )}
                    </div>
                </div>
             </div>

             {/* Recent Snapshots (Compact) */}
             <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Snapshots</h2>
                </div>
                <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                    {loading ? (
                         <div className="p-6 text-center text-gray-500 animate-pulse">Loading...</div>
                    ) : snapshots.length === 0 ? (
                         <div className="p-6 text-center text-gray-500">No snapshots found.</div>
                    ) : (
                        snapshots.map((snap) => (
                            <div key={snap.id} className="p-4 hover:bg-gray-50 transition group flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 font-medium text-gray-900 text-sm">
                                        <Layers size={14} className="text-gray-400" />
                                        {snap.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                        <span>{new Date(snap.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{snap._count?.items || 0} items</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                            snap.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {snap.status}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDownload(snap.id)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                    title="Download"
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}
