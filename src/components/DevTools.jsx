import React, { useState } from 'react';

const DevTools = ({ type, content, onChange }) => {
  const data = typeof content === 'object' && content !== null ? content : {
    input1: '',
    input2: '',
    url: '',
    method: 'GET',
    output: '',
    error: null,
  };

  const [compared, setCompared] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateState = (fields) => {
    onChange({ ...data, ...fields });
  };

  // --- Algoritmo de Diff AST ---
  const buildDiffMap = (obj1, obj2) => {
    const diffMap = {};
    const isObject = (val) => val !== null && typeof val === 'object';

    const traverse = (o1, o2, path = '') => {
      const keys1 = isObject(o1) ? Object.keys(o1) : [];
      const keys2 = isObject(o2) ? Object.keys(o2) : [];
      const allKeys = Array.from(new Set([...keys1, ...keys2]));

      allKeys.forEach((key) => {
        const currentPath = path ? `${path}.${key}` : key;
        const exists1 = isObject(o1) && key in o1;
        const exists2 = isObject(o2) && key in o2;

        if (exists1 && !exists2) {
          diffMap[currentPath] = 'removed';
        } else if (!exists1 && exists2) {
          diffMap[currentPath] = 'added';
        } else if (isObject(o1[key]) && isObject(o2[key])) {
          traverse(o1[key], o2[key], currentPath);
        } else if (o1[key] !== o2[key]) {
          diffMap[currentPath] = 'modified';
        } else {
          diffMap[currentPath] = 'unchanged';
        }
      });
    };

    traverse(obj1, obj2);
    return diffMap;
  };

  // --- Handlers de Acciones ---
  const handleFormat = () => {
    try {
      if (!data.input1?.trim()) return;
      const parsed = JSON.parse(data.input1);
      updateState({ output: JSON.stringify(parsed, null, 2), error: null });
    } catch (err) {
      updateState({ output: '', error: '❌ JSON Inválido' });
    }
  };

  const handleCompare = () => {
    try {
      if (!data.input1?.trim() || !data.input2?.trim()) {
        updateState({ error: '❌ Ingresa ambos JSON para comparar' });
        return;
      }

      const obj1 = JSON.parse(data.input1);
      const obj2 = JSON.parse(data.input2);

      updateState({
        input1: JSON.stringify(obj1, null, 2),
        input2: JSON.stringify(obj2, null, 2),
        error: null,
      });

      setCompared(true);
    } catch (err) {
      updateState({ error: `❌ Error al parsear JSONs: ${err.message}` });
      setCompared(false);
    }
  };

  const handleRequest = async () => {
    if (!data.url) return;
    setLoading(true);
    try {
      const options = {
        method: data.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
      if (['POST', 'PUT', 'PATCH'].includes(data.method) && data.input1) {
        options.body = data.input1;
      }

      const response = await fetch(data.url, options);
      const resData = await response.json();
      updateState({ output: JSON.stringify(resData, null, 2), error: null });
    } catch (err) {
      updateState({ output: '', error: `❌ Error en la petición: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Renderizador Diff por Líneas
  const renderHighlightedJson = (jsonString, otherJsonString, side) => {
    if (!compared || !jsonString?.trim()) {
      return <pre className="text-indigo-300 font-mono text-xs whitespace-pre-wrap">{jsonString}</pre>;
    }

    try {
      const objCurrent = JSON.parse(jsonString);
      const objOther = JSON.parse(otherJsonString || '{}');

      const diffMap = side === 'left' 
        ? buildDiffMap(objCurrent, objOther) 
        : buildDiffMap(objOther, objCurrent);

      const lines = jsonString.split('\n');
      const stack = [];

      return (
        <div className="font-mono text-xs leading-relaxed">
          {lines.map((line, idx) => {
            const indentMatch = line.match(/^(\s*)/);
            const indentSpaces = indentMatch ? indentMatch[1].length : 0;
            const level = Math.floor(indentSpaces / 2);

            stack.length = level;

            const keyMatch = line.match(/"([^"]+)":/);
            if (keyMatch) {
              stack[level] = keyMatch[1];
            }

            const currentPath = stack.filter(Boolean).join('.');
            const status = diffMap[currentPath];

            let bgColor = '';
            let textColor = 'text-zinc-300';
            let prefix = ' ';

            if (keyMatch && status) {
              if (side === 'left') {
                if (status === 'removed') {
                  bgColor = 'bg-red-950/70 border-l-4 border-red-500';
                  textColor = 'text-red-300';
                  prefix = '-';
                } else if (status === 'modified') {
                  bgColor = 'bg-yellow-950/70 border-l-4 border-yellow-500';
                  textColor = 'text-yellow-300';
                  prefix = '≠';
                }
              } else {
                if (status === 'added') {
                  bgColor = 'bg-green-950/70 border-l-4 border-green-500';
                  textColor = 'text-green-300';
                  prefix = '+';
                } else if (status === 'modified') {
                  bgColor = 'bg-yellow-950/70 border-l-4 border-yellow-500';
                  textColor = 'text-yellow-300';
                  prefix = '≠';
                }
              }
            }

            return (
              <div key={idx} className={`px-2 py-0.5 whitespace-pre-wrap ${bgColor} ${textColor}`}>
                <span className="select-none opacity-40 mr-2 inline-block w-3 text-center">{prefix}</span>
                {line}
              </div>
            );
          })}
        </div>
      );
    } catch {
      return <pre className="text-indigo-300 font-mono text-xs">{jsonString}</pre>;
    }
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex-1 flex gap-4 min-h-0">
        {type === 'json-diff' ? (
          /* JSON DIFF COMPONENT */
          <div className="flex flex-1 gap-4 min-h-0 w-full overflow-hidden">
            <div className="flex flex-col flex-1 min-w-0 bg-[#1c1c1c] rounded-xl border border-zinc-800 overflow-hidden">
              <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800 flex justify-between shrink-0">
                <span>JSON 1 (Original)</span>
                {compared && <span className="text-red-400">- Eliminados / ≠ Modificados</span>}
              </div>
              <div className="flex-1 overflow-auto p-3">
                {!compared ? (
                  <textarea
                    className="w-full h-full font-mono text-xs bg-transparent text-purple-300 outline-none resize-none"
                    value={data.input1 || ''}
                    onChange={(e) => updateState({ input1: e.target.value })}
                    placeholder="Pega el primer JSON..."
                  />
                ) : (
                  renderHighlightedJson(data.input1 || '', data.input2 || '', 'left')
                )}
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0 bg-[#1c1c1c] rounded-xl border border-zinc-800 overflow-hidden">
              <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800 flex justify-between shrink-0">
                <span>JSON 2 (A comparar)</span>
                {compared && <span className="text-green-400">+ Nuevos / ≠ Modificados</span>}
              </div>
              <div className="flex-1 overflow-auto p-3">
                {!compared ? (
                  <textarea
                    className="w-full h-full font-mono text-xs bg-transparent text-purple-300 outline-none resize-none"
                    value={data.input2 || ''}
                    onChange={(e) => updateState({ input2: e.target.value })}
                    placeholder="Pega el segundo JSON..."
                  />
                ) : (
                  renderHighlightedJson(data.input2 || '', data.input1 || '', 'right')
                )}
              </div>
            </div>
          </div>
        ) : (
          /* JSON FORMATTER / REST CLIENT COMPONENT */
          <>
            <div className="flex flex-col flex-1 min-w-0 gap-2">
              {type === 'rest-client' && (
                <div className="flex gap-2">
                  <select
                    value={data.method || 'GET'}
                    onChange={(e) => updateState({ method: e.target.value })}
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
                    value={data.url || ''}
                    onChange={(e) => updateState({ url: e.target.value })}
                  />
                </div>
              )}

              <textarea
                className={`flex-1 w-full p-4 font-mono text-xs bg-[#1c1c1c] border border-zinc-800 rounded-xl outline-none resize-none ${
                  type === 'rest-client' ? 'text-amber-300 focus:border-amber-500' : 'text-indigo-300 focus:border-indigo-500'
                }`}
                value={data.input1 || ''}
                onChange={(e) => updateState({ input1: e.target.value })}
                placeholder={type === 'rest-client' ? 'Body (JSON) para POST/PUT...' : 'Pega tu JSON sin formatear aquí...'}
              />
            </div>

            <div className="flex flex-col flex-1 min-w-0 bg-[#1c1c1c] rounded-xl border border-zinc-800 overflow-hidden">
              <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800">
                Resultado
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {data.error ? (
                  <p className="text-red-400 font-mono text-xs">{data.error}</p>
                ) : (
                  <pre className={`font-mono text-xs whitespace-pre-wrap leading-relaxed ${
                    type === 'rest-client' ? 'text-amber-300' : 'text-indigo-300'
                  }`}>
                    {loading ? 'Cargando petición...' : data.output || '// Resultado...'}
                  </pre>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botones del Pie */}
      <div className="flex justify-center gap-3">
        {type === 'json-formatter' && (
          <button
            onClick={handleFormat}
            className="px-12 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            FORMATEAR JSON
          </button>
        )}

        {type === 'json-diff' && (
          <>
            <button
              onClick={handleCompare}
              className="px-12 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
            >
              COMPARE (DIFF)
            </button>
            {compared && (
              <button
                onClick={() => setCompared(false)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ✏️ Editar JSONs
              </button>
            )}
          </>
        )}

        {type === 'rest-client' && (
          <button
            onClick={handleRequest}
            disabled={loading}
            className="px-12 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer disabled:bg-zinc-700"
          >
            {loading ? 'ENVIANDO...' : 'ENVIAR PETICIÓN'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DevTools;