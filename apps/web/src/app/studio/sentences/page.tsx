'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import BulkImport from './BulkImport';
import SentenceTable from './SentenceTable';
import { Database, FileText } from 'lucide-react';

export default function SentencesPage() {
  const [sentences, setSentences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSentences = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/sentences?limit=50');
      setSentences(response.data.data);
    } catch (error) {
      console.error('Failed to fetch sentences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSentences();
  }, [fetchSentences]);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="text-blue-600 w-6 h-6" />
                </div>
                Sentence Management
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Import, view, and manage text corpus for recording.</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
             <BulkImport onImportSuccess={fetchSentences} />
        </div>
      </header>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            Loading sentences...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <SentenceTable sentences={sentences} />
        </div>
      )}
    </div>
  );
}
