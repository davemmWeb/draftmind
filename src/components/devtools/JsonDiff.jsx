import React, { useState } from 'react';

const JsonDiff = ({ content, onChange }) => {
  const [compared, setCompared] = useState(false);
  const [error, setError] = useState(null);

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

  const handleCompare = () => {
    try {
      if (!content?.input1?.trim() || !content?.input2?.trim()) {
        setError('❌ Ingresa ambos JSON para comparar');
        return;
      }

      const obj1 = JSON.parse(content.input1);
      const obj2 = JSON.parse(content.input2);

      onChange({
        ...content,
        input1: JSON.stringify(obj1, null, 2),
        input2: JSON.stringify(obj2, null, 2),
      });

      setError(null);
      setCompared(true);
    } catch (err) {
      setError(`❌ Error al parsear JSONs: ${err.message}`);
      setCompared(false);
    }
  };

  const renderHighlightedJson = (jsonString, otherJsonString, side) => {
    if (!compared || !jsonString?.trim()) {
      return <pre className="text-purple-300 font-mono text-xs whitespace-pre-wrap">{jsonString}</pre>;
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
      return <pre className="text-purple-300 font-mono text-xs">{jsonString}</pre>;
    }
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {error && <p className="text-red-400 font-mono text-xs">{error}</p>}
      
      <div className="flex flex-1 gap-4 min-h-0 w-full overflow-hidden">
        {/* JSON 1 */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#1c1c1c] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800 flex justify-between shrink-0">
            <span>JSON 1 (Original)</span>
            {compared && <span className="text-red-400">- Eliminados / ≠ Modificados</span>}
          </div>
          <div className="flex-1 overflow-auto p-3">
            {!compared ? (
              <textarea
                className="w-full h-full font-mono text-xs bg-transparent text-purple-300 outline-none resize-none placeholder-zinc-600"
                value={content?.input1 || ''}
                onChange={(e) => onChange({ ...content, input1: e.target.value })}
                placeholder="Pega el primer JSON..."
              />
            ) : (
              renderHighlightedJson(content?.input1 || '', content?.input2 || '', 'left')
            )}
          </div>
        </div>

        {/* JSON 2 */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#1c1c1c] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="bg-[#141414] px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800 flex justify-between shrink-0">
            <span>JSON 2 (A comparar)</span>
            {compared && <span className="text-green-400">+ Nuevos / ≠ Modificados</span>}
          </div>
          <div className="flex-1 overflow-auto p-3">
            {!compared ? (
              <textarea
                className="w-full h-full font-mono text-xs bg-transparent text-purple-300 outline-none resize-none placeholder-zinc-600"
                value={content?.input2 || ''}
                onChange={(e) => onChange({ ...content, input2: e.target.value })}
                placeholder="Pega el segundo JSON..."
              />
            ) : (
              renderHighlightedJson(content?.input2 || '', content?.input1 || '', 'right')
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-center gap-3">
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
      </div>
    </div>
  );
};

export default JsonDiff;