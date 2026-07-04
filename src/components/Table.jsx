import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

function Table({ content, onChange }) {
  // 1. Asegurar matriz bidimensional por defecto
  const data = useMemo(() => {
    return Array.isArray(content) ? content : Array(8).fill(null).map(() => Array(5).fill(""));
  }, [content]);

  // 2. Definir dinámicamente las columnas basadas en el ancho de la primera fila
  const columns = useMemo(() => {
    const colCount = data[0]?.length || 5;
    return Array(colCount)
      .fill(null)
      .map((_, index) => {
        const label = String.fromCharCode(65 + index); // A, B, C...
        return {
          id: `col-${index}`,
          header: label,
          accessorFn: (row) => row[index],
        };
      });
  }, [data]);

  // 3. Inicializar la configuración de TanStack Table
  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange", // Cambia el tamaño en tiempo real mientras arrastras
    getCoreRowModel: getCoreRowModel(),
  });

  // ==========================================
  // MANEJADORES DE EVENTOS Y EDICIÓN
  // ==========================================
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = data.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
    );
    onChange(newData);
  };

  const addRow = () => {
    const colCount = data[0]?.length || 5;
    onChange([...data, Array(colCount).fill("")]);
  };

  const deleteRow = () => {
    if (data.length <= 1) return;
    onChange(data.slice(0, -1));
  };

  const addColumn = () => {
    onChange(data.map((row) => [...row, ""]));
  };

  const deleteColumn = () => {
    if (data[0]?.length <= 1) return;
    onChange(data.map((row) => row.slice(0, -1)));
  };

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      
      {/* BOTONERA DE CONTROL MINIMALISTA */}
      <div className="flex flex-wrap items-center gap-2 bg-[#1c1c1c] border border-zinc-800 p-2 rounded-xl max-w-max">
        <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
          <button onClick={addRow} className="px-2.5 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition flex items-center gap-1">
            ➕ Fila
          </button>
          <button onClick={deleteRow} disabled={data.length <= 1} className="px-2.5 py-1 text-xs font-medium bg-zinc-800/50 hover:bg-red-950/40 hover:text-red-400 text-zinc-500 rounded-lg transition disabled:opacity-30">
            🗑️ Fila
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={addColumn} className="px-2.5 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition flex items-center gap-1">
            ➕ Columna
          </button>
          <button onClick={deleteColumn} disabled={data[0]?.length <= 1} className="px-2.5 py-1 text-xs font-medium bg-zinc-800/50 hover:bg-red-950/40 hover:text-red-400 text-zinc-500 rounded-lg transition disabled:opacity-30">
            🗑️ Columna
          </button>
        </div>
      </div>

      {/* CONTENEDOR DE LA TABLA CON SCROLL VERTICAL Y HORIZONTAL */}
      <div className="overflow-auto max-h-[60vh] border border-zinc-800 rounded-xl bg-[#18181b] shadow-inner max-w-full relative custom-scrollbar">
        <table 
          style={{ minWidth: "100%", width: table.getCenterTotalSize() }}
          className="border-collapse table-fixed"
        >
          {/* Añadimos 'sticky top-0 z-20' para congelar la cabecera */}
          <thead className="sticky top-0 z-20 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[#1c1c1c]">
                {/* Esquina superior izquierda */}
                <th className="w-10 min-w-[40px] border-r border-b border-zinc-800 text-[10px] text-zinc-600 font-bold text-center bg-[#1c1c1c]"></th>
                
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-2 py-1 text-[11px] font-bold text-zinc-500 tracking-wider text-center border-r border-b border-zinc-800 uppercase relative bg-[#1c1c1c]"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    
                    {/* DIVISOR DE RESIZE */}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize select-none z-10 transition-colors ${
                        header.column.getIsResizing() ? "bg-emerald-400 w-1" : "bg-transparent hover:bg-emerald-500/50"
                      }`}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-zinc-900/30 transition-colors">
                {/* Índice numérico lateral */}
                <td className="w-10 min-w-[40px] border-r border-b border-zinc-800 text-[10px] text-zinc-600 font-bold text-center bg-[#1c1c1c]">
                  {rowIndex + 1}
                </td>
                
                {row.getVisibleCells().map((cell, colIndex) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="border-r border-b border-zinc-800 p-0 relative focus-within:ring-1 focus-within:ring-emerald-500/50 z-0 overflow-hidden"
                  >
                    <input
                      type="text"
                      value={cell.getValue() || ""}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="w-full h-8 px-2 bg-transparent text-xs text-zinc-300 border-none outline-none focus:ring-0 font-mono"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-zinc-600 font-mono px-1 flex justify-between items-center">
        <span>Dimensión: {data.length} filas × {data[0]?.length || 0} columnas</span>
      </div>
    </div>
  );
}

export default Table;