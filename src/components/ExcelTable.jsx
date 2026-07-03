import { useState } from "react";

export default function ExcelTable({ content, onChange }) {
  // Si no hay contenido de matriz inicializado, creamos una tabla por defecto de 6 filas x 4 columnas
  const rowsCount = 8;
  const colsCount = 5;

  const initializeTable = () => {
    if (Array.isArray(content)) return content;
    return Array(rowsCount).fill(null).map(() => Array(colsCount).fill(""));
  };

  const tableData = initializeTable();

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = tableData.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
    );
    onChange(newData);
  };

  // Generar letras para las cabeceras de las columnas (A, B, C...)
  const getColumnLabel = (index) => String.fromCharCode(65 + index);

  return (
    <div className="w-full overflow-x-auto border border-zinc-800 rounded-xl bg-[#181818]">
      <table className="min-w-full border-collapse text-left text-xs text-zinc-300">
        <thead>
          <tr className="bg-zinc-900 border-b border-zinc-800">
            {/* Esquina superior izquierda vacía */}
            <th className="w-10 border-r border-zinc-800 p-2 text-center text-zinc-500 font-bold select-none"></th>
            {tableData[0]?.map((_, cIdx) => (
              <th key={cIdx} className="border-r border-zinc-800 p-2 text-center text-zinc-400 font-semibold select-none w-32">
                {getColumnLabel(cIdx)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
              {/* Índice de la fila */}
              <td className="border-r border-zinc-800 p-2 text-center text-zinc-500 font-bold bg-zinc-900/30 select-none">
                {rIdx + 1}
              </td>
              {row.map((cellValue, cIdx) => (
                <td key={cIdx} className="border-r border-zinc-800 p-0">
                  <input
                    type="text"
                    value={cellValue || ""}
                    onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                    className="w-full bg-transparent border-none outline-none focus:bg-zinc-800/80 focus:ring-1 focus:ring-emerald-500/50 px-3 py-2 text-zinc-200 transition-all font-mono"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}