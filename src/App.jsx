import { useState } from "react";

const BLOCK_TYPES = {
  TITLE: "title",
  HEADING: "heading",
  PARAGRAPH: "paragraph",
};

function App() {
  const [blocks, setBlocks] = useState([
    { id: "1", type: BLOCK_TYPES.TITLE, content: "Bienvenido a DraftMind 🚀" },
    { id: "2", type: BLOCK_TYPES.PARAGRAPH, content: "Un espacio minimalista. Haz clic en cualquier línea para comenzar a escribir texto." },
  ]);

  const addBlock = (type) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type: type,
      content: "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockContent = (id, newContent) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const deleteBlock = (id) => {
    if (blocks.length <= 1) return;
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#191919] text-zinc-100 flex justify-center py-20 px-6 md:px-12">
    <div className="w-full max-w-2xl flex flex-col gap-4 mx-auto">
        {/* Espacio de bloques */}
        <div className="flex flex-col gap-2 mb-12">
          {blocks.map((block) => (
            <div key={block.id} className="relative flex items-center group w-full">
              
              {/* Botón de eliminación en Hover (Estilo Notion) */}
              <button
                onClick={() => deleteBlock(block.id)}
                className="absolute -left-8 opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition-all"
                title="Eliminar bloque"
              >
                ✕
              </button>

              {/* Render condicional de los bloques de texto con mejor contraste */}
{block.type === BLOCK_TYPES.TITLE && (
  <input
    type="text"
    value={block.content}
    onChange={(e) => updateBlockContent(block.id, e.target.value)}
    className="w-full text-4xl font-extrabold tracking-tight border-none outline-none focus:ring-0 py-2 bg-transparent text-zinc-50 placeholder-zinc-700"
    placeholder="Sin título"
  />
)}

{block.type === BLOCK_TYPES.HEADING && (
  <input
    type="text"
    value={block.content}
    onChange={(e) => updateBlockContent(block.id, e.target.value)}
    className="w-full text-xl font-semibold border-none outline-none focus:ring-0 py-1 bg-transparent text-zinc-100 mt-4 placeholder-zinc-600"
    placeholder="Subtítulo"
  />
)}

{block.type === BLOCK_TYPES.PARAGRAPH && (
  <textarea
    value={block.content}
    onChange={(e) => {
      // 1. Actualiza el estado como lo hacía antes
      updateBlockContent(block.id, e.target.value);
      
      // 2. Ajusta la altura dinámicamente al escribir
      e.target.style.height = "auto"; // Resetea la altura
      e.target.style.height = `${e.target.scrollHeight}px`; // Asigna la altura del contenido real
    }}
    rows={1}
    className="w-full text-base border-none outline-none focus:ring-0 py-1 bg-transparent text-zinc-300 resize-none leading-relaxed overflow-hidden h-auto min-h-[1.5rem] placeholder-zinc-600"
    placeholder="Presiona para escribir..."
  />
)}
            </div>
          ))}
        </div>

        {/* Menú inferior flotante de herramientas */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-slate-200 p-2 rounded-2xl shadow-xl flex items-center gap-1 z-50">
          <button
            onClick={() => addBlock(BLOCK_TYPES.HEADING)}
            className="text-xs text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-xl font-medium transition"
          >
            + Subtítulo
          </button>
          <div className="w-[1px] h-4 bg-slate-200"></div>
          <button
            onClick={() => addBlock(BLOCK_TYPES.PARAGRAPH)}
            className="text-xs text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-xl font-medium transition"
          >
            + Párrafo
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;