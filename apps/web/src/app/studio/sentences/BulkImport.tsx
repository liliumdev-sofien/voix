'use client';

import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function BulkImport({ onImportSuccess }: { onImportSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage(null);

    try {
      await api.post('/sentences/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({ type: 'success', text: 'CSV imported successfully!' });
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      onImportSuccess();
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to upload CSV. Please check the format.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Bulk Import Sentences</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="flex-1">
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : <><Upload size={18} /> Upload CSV</>}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Accepted format: CSV with headers <code>textArabizi, textNormalized, style, domain, tags</code>
      </p>
    </div>
  );
}
