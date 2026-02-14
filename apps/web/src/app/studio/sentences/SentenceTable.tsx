'use client';

export default function SentenceTable({ sentences }: { sentences: any[] }) {
  if (!sentences || sentences.length === 0) {
    return (
        <div className="text-center p-12 bg-gray-50/50">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No sentences found</h3>
            <p className="mt-1 text-gray-500">Get started by importing a dataset.</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-8 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Text Content</th>
            <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">Style</th>
            <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">Domain</th>
            <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Added</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sentences.map((sentence) => (
            <tr key={sentence.id} className="hover:bg-blue-50/30 transition group">
              <td className="px-8 py-5">
                 <div className="font-medium text-gray-900 group-hover:text-blue-700 transition line-clamp-2 max-w-xl">
                    {sentence.textArabizi}
                 </div>
                 {sentence.textArabic && (
                    <div className="text-xs text-gray-400 mt-1 font-arabic opacity-60">
                        {sentence.textArabic}
                    </div>
                 )}
              </td>
              <td className="px-6 py-5 text-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border
                    ${sentence.tags?.style === 'AD_HYPE' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : 'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                  {sentence.tags?.style || 'NEUTRAL'}
                </span>
              </td>
              <td className="px-6 py-5 text-center">
                <span className="text-sm text-gray-500">{sentence.tags?.domain || '-'}</span>
              </td>
              <td className="px-6 py-5 text-right whitespace-nowrap text-sm text-gray-400 font-mono">
                {new Date(sentence.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
