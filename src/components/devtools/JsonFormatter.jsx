import React, { useState } from 'react';

const JsonFormatter = ({ content, onChange }) => {
  const [error, setError] = useState(null);

  const handleFormat = (indentSpaces) => {
    try {
      if (!content?.input1?.trim()) return;
      const parsed = JSON.parse(content.input1);
      
      // indentSpaces: 2 para multilínea, 0 para 1 sola línea
      const formatted = JSON.stringify(parsed, null, indentSpaces);
      
      onChange({ ...content, output: formatted, error: null });
      setError(null);
    } catch (err) {
      setError('❌ JSON Inválido: Revisa la sintaxis');
      onChange({ ...content, output: '', error: '❌ JSON Inválido' });
    }
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Input */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#1c1c1c] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800">
            JSON de Entrada
          </div>
          <textarea
            className="flex-1 w-full p-4 font-mono text-xs bg-transparent text-indigo-300 outline-none resize-none placeholder-zinc-600"
            value={content?.input1 || ''}
            onChange={(e) => onChange({ ...content, input1: e.target.value })}
            placeholder="Pega tu JSON desordenado aquí..."
          />
        </div>

        {/* Output */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#1c1c1c] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800">
            Resultado Formateado
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {error ? (
              <p className="text-red-400 font-mono text-xs">{error}</p>
            ) : (
              <pre className="font-mono text-xs text-indigo-300 whitespace-pre-wrap leading-relaxed">
                {content?.output || '// El resultado aparecerá aquí...'}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => handleFormat(2)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
        >
          📄 FORMATEAR (MULTILÍNEA)
        </button>
        <button
          onClick={() => handleFormat(0)}
          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-indigo-300 border border-indigo-500/30 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
        >
          🗜️ AGRUPAR (1 SOLA LÍNEA)
        </button>
      </div>
    </div>
  );
};

export default JsonFormatter;