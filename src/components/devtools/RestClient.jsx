import React, { useState } from 'react';

const RestClient = ({ content, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async () => {
    if (!content?.url) return;
    setLoading(true);
    setError(null);

    try {
      const options = {
        method: content.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      if (['POST', 'PUT', 'PATCH'].includes(content.method) && content.input1) {
        options.body = content.input1;
      }

      const response = await fetch(content.url, options);
      const resData = await response.json();
      
      onChange({ ...content, output: JSON.stringify(resData, null, 2) });
    } catch (err) {
      setError(`❌ Error en la petición: ${err.message}`);
      onChange({ ...content, output: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          {/* Barra Método + URL */}
          <div className="flex gap-2">
            <select
              value={content?.method || 'GET'}
              onChange={(e) => onChange({ ...content, method: e.target.value })}
              className="bg-[#1c1c1c] border border-zinc-800 text-amber-400 rounded-lg px-2 py-1.5 font-bold text-xs outline-none"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input
              type="text"
              placeholder="https://api.example.com/data"
              className="flex-1 bg-[#1c1c1c] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-500"
              value={content?.url || ''}
              onChange={(e) => onChange({ ...content, url: e.target.value })}
            />
          </div>

          {/* Body Request */}
          <textarea
            className="flex-1 w-full p-4 font-mono text-xs bg-[#1c1c1c] border border-zinc-800 rounded-xl outline-none resize-none text-amber-300 focus:border-amber-500 placeholder-zinc-600"
            value={content?.input1 || ''}
            onChange={(e) => onChange({ ...content, input1: e.target.value })}
            placeholder="Body (JSON) para POST/PUT..."
          />
        </div>

        {/* Respuesta */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#1c1c1c] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800">
            Respuesta del Servidor
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {error ? (
              <p className="text-red-400 font-mono text-xs">{error}</p>
            ) : (
              <pre className="font-mono text-xs text-amber-300 whitespace-pre-wrap leading-relaxed">
                {loading ? 'Cargando petición...' : content?.output || '// Respuesta...'}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Botón */}
      <div className="flex justify-center">
        <button
          onClick={handleRequest}
          disabled={loading}
          className="px-12 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer disabled:bg-zinc-700"
        >
          {loading ? 'ENVIANDO...' : 'ENVIAR PETICIÓN'}
        </button>
      </div>
    </div>
  );
};

export default RestClient;