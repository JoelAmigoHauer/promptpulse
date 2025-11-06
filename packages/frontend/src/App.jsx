import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export default function App() {
  const [status, setStatus] = useState('Checking backend health...');

  useEffect(() => {
    let ignore = false;

    async function checkHealth() {
      try {
        const response = await fetch(`${API_BASE}/health`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (!ignore) {
          setStatus(`Backend status: ${data.status ?? 'unknown'}`);
        }
      } catch (error) {
        if (!ignore) {
          setStatus(`Backend health check failed: ${error.message}`);
        }
      }
    }

    checkHealth();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-semibold mb-6 text-center">PromptPulse</h1>
      <p className="text-lg text-center max-w-xl">
        {status}
      </p>
    </main>
  );
}
