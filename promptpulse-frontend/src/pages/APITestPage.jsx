import React, { useState } from 'react';
import { searchBrand } from '../services/api';

const providers = [
  { name: 'OpenAI', brand: 'Tesla', provider: 'openai' },
  { name: 'Anthropic', brand: 'Tesla', provider: 'anthropic' },
  { name: 'Google', brand: 'Tesla', provider: 'google' },
];

function APITestPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const testProvider = async (provider) => {
    setLoading((prev) => ({ ...prev, [provider]: true }));
    setError((prev) => ({ ...prev, [provider]: null }));
    setResults((prev) => ({ ...prev, [provider]: null }));
    try {
      // For now, just call searchBrand; backend should route to the correct provider if supported
      const data = await searchBrand('Tesla');
      // Filter mentions by provider if possible
      const filtered = data.mentions?.filter(m => m.provider?.toLowerCase() === provider) || [];
      setResults((prev) => ({ ...prev, [provider]: filtered }));
    } catch (err) {
      setError((prev) => ({ ...prev, [provider]: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">API Connection Test</h2>
        <div className="space-y-6">
          {providers.map((prov) => (
            <div key={prov.provider} className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{prov.name}</span>
                <button
                  className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
                  onClick={() => testProvider(prov.provider)}
                  disabled={loading[prov.provider]}
                >
                  {loading[prov.provider] ? 'Testing...' : 'Test'}
                </button>
              </div>
              {error[prov.provider] && (
                <div className="text-red-600 text-sm mb-2">Error: {error[prov.provider]}</div>
              )}
              {results[prov.provider] && results[prov.provider].length > 0 && (
                <div className="text-green-700 text-sm mb-2">
                  {results[prov.provider].length} mentions found for {prov.name}
                </div>
              )}
              {results[prov.provider] && results[prov.provider].length > 0 && (
                <ul className="text-xs text-gray-700 max-h-32 overflow-y-auto">
                  {results[prov.provider].slice(0, 3).map((m, i) => (
                    <li key={i} className="mb-2 border-b pb-1">
                      <div><b>Sentiment:</b> {m.sentiment_label} ({m.sentiment_score}/5)</div>
                      <div><b>Confidence:</b> {m.confidence}</div>
                      <div><b>Content:</b> {m.content.slice(0, 120)}{m.content.length > 120 ? '...' : ''}</div>
                    </li>
                  ))}
                </ul>
              )}
              {results[prov.provider] && results[prov.provider].length === 0 && !error[prov.provider] && (
                <div className="text-gray-500 text-sm">No results for {prov.name}.</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default APITestPage; 