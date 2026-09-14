import React, { useState } from 'react';

const JsonFormatter = ({ content, onChange }) => {
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = (indentSpaces) => {
    try {
      if (!content?.input1?.trim()) return;

      const sanitizedInput = content.input1
        .replace(/[\r\n]+/g, '')
        .replace(/\s+/g, ' ');

      const parsed = JSON.parse(sanitizedInput);
      const formatted = JSON.stringify(parsed, null, indentSpaces);

      onChange({ ...content, output: formatted });
      setError(null);
    } catch (err) {
      try {
        const fallbackSanitize = content.input1.replace(/(\r\n|\n|\r)/gm, "");
        const parsed = JSON.parse(fallbackSanitize);
        const formatted = JSON.stringify(parsed, null, indentSpaces);

        onChange({ ...content, output: formatted });
        setError(null);
      } catch (fallbackErr) {
        setError('❌ JSON Inválido: Sintaxis incorrecta');
        onChange({ ...content, output: '' });
      }
    }
  };

  const handleCopy = async () => {
    if (!content?.output) return;
    try {
      await navigator.clipboard.writeText(content.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar: ', err);
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
          <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800 flex justify-between items-center shrink-0">
            <span>Resultado Formateado</span>
            {content?.output && !error && (
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition cursor-pointer flex items-center gap-1"
              >
                {copied ? '✅ ¡Copiado!' : '📋 Copiar'}
              </button>
            )}
          </div>
          <div className="flex-1 p-4 overflow-auto select-text">
            {error ? (
              <p className="text-red-400 font-mono text-xs">{error}</p>
            ) : (
              <pre className="font-mono text-xs text-indigo-300 whitespace-pre-wrap leading-relaxed select-text">
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