import { useState, useEffect } from "react";
import Table from "./components/Table";
import RichTextEditor from "./components/RichTextEditor";

const LOCAL_STORAGE_KEY = "draftmind_themes_v5";

const DEFAULT_DATA = [
  {
    id: "theme-1",
    title: "📝 Notas de Viaje",
    type: "text", // El tipo ahora pertenece al Tema completo
    subTabs: [
      { id: "sub-1", title: "Hoja 1", content: "Lienzo de texto para mis notas..." },
      { id: "sub-2", title: "Hoja 2", content: "" },
    ],
  },
  {
    id: "theme-2",
    title: "📊 Finanzas Personales",
    type: "table", // Tema tipo Excel
    subTabs: [
      { id: "sub-3", title: "Tabla 1", content: [["Concepto", "Valor"], ["Ingresos", "0"], ["Gastos", "0"]] },
    ],
  },
];

function App() {
  const [themes, setThemes] = useState(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : DEFAULT_DATA;
  });

  const [activeThemeId, setActiveThemeId] = useState(() => themes[0]?.id || "theme-1");
  const [activeSubTabId, setActiveSubTabId] = useState(() => themes[0]?.subTabs[0]?.id || "sub-1");
  
  // Menú flotante ahora para añadir TEMAS a la izquierda
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(themes));
  }, [themes]);

  const currentTheme = themes.find((t) => t.id === activeThemeId) || themes[0];
  const currentSubTab = currentTheme?.subTabs?.find((st) => st.id === activeSubTabId) || currentTheme?.subTabs?.[0];

  // ==========================================
  // OPERACIONES DE TEMAS (Elegir tipo al crear)
  // ==========================================
  const handleAddTheme = (type) => {
    const newThemeId = crypto.randomUUID();
    const newSubTabId = crypto.randomUUID();
    
    const initialContent = type === "table" ? Array(8).fill(null).map(() => Array(5).fill("")) : "";
    const defaultTabTitle = type === "table" ? "Tabla 1" : "Hoja 1";
    const defaultThemeTitle = type === "table" ? "📊 Nuevo Excel" : "📝 Nuevas Notas";

    const newTheme = {
      id: newThemeId,
      title: defaultThemeTitle,
      type: type,
      subTabs: [{ id: newSubTabId, title: defaultTabTitle, content: initialContent }],
    };

    setThemes([...themes, newTheme]);
    setActiveThemeId(newThemeId);
    setActiveSubTabId(newSubTabId);
    setShowThemeMenu(false);
  };

  const updateThemeTitle = (id, newTitle) => {
    setThemes(themes.map((t) => (t.id === id ? { ...t, title: newTitle } : t)));
  };

  const deleteTheme = (themeId, e) => {
    e.stopPropagation();
    if (themes.length <= 1) return;

    const updatedThemes = themes.filter((t) => t.id !== themeId);
    setThemes(updatedThemes);

    if (themeId === activeThemeId) {
      const fallbackTheme = updatedThemes[0];
      setActiveThemeId(fallbackTheme.id);
      setActiveSubTabId(fallbackTheme.subTabs[0]?.id);
    }
  };

  // ==========================================
  // OPERACIONES DE PESTAÑAS INFERIORES
  // ==========================================
  const handleAddSubTab = () => {
    if (!currentTheme) return;

    const newSubTabId = crypto.randomUUID();
    const nextNumber = (currentTheme.subTabs?.length || 0) + 1;
    
    // El contenido inicial depende estrictamente del tipo del tema actual
    const isTable = currentTheme.type === "table";
    const defaultTitle = isTable ? `Tabla ${nextNumber}` : `Hoja ${nextNumber}`;
    const initialContent = isTable ? Array(8).fill(null).map(() => Array(5).fill("")) : "";

    const newSubTab = {
      id: newSubTabId,
      title: defaultTitle,
      content: initialContent,
    };

    setThemes(
      themes.map((t) =>
        t.id === currentTheme.id ? { ...t, subTabs: [...t.subTabs, newSubTab] } : t
      )
    );

    setActiveSubTabId(newSubTabId);
  };

  const updateSubTabTitle = (subTabId, newTitle) => {
    setThemes(
      themes.map((t) =>
        t.id === currentTheme.id
          ? { ...t, subTabs: t.subTabs.map((st) => (st.id === subTabId ? { ...st, title: newTitle } : st)) }
          : t
      )
    );
  };

  const deleteSubTab = (subTabId, e) => {
    e.stopPropagation();
    if (!currentTheme || currentTheme.subTabs.length <= 1) return;

    const updatedSubTabs = currentTheme.subTabs.filter((st) => st.id !== subTabId);

    setThemes(
      themes.map((t) => (t.id === currentTheme.id ? { ...t, subTabs: updatedSubTabs } : t))
    );

    if (subTabId === activeSubTabId) {
      setActiveSubTabId(updatedSubTabs[0].id);
    }
  };

  const updateContent = (subTabId, newContent) => {
    setThemes(
      themes.map((t) =>
        t.id === currentTheme.id
          ? { ...t, subTabs: t.subTabs.map((st) => (st.id === subTabId ? { ...st, content: newContent } : st)) }
          : t
      )
    );
  };

  const handleThemeChange = (theme) => {
    setActiveThemeId(theme.id);
    // Al cambiar de tema, enfocamos automáticamente su primera pestaña
    setActiveSubTabId(theme.subTabs[0]?.id || "");
  };

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-100 flex font-sans select-none">
      
      {/* PANEL IZQUIERDO: TEMAS */}
      <aside className="w-64 bg-[#1c1c1c] border-r border-zinc-800 flex flex-col justify-between p-4 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2 mb-4">Mis Temas</div>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[75vh]">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => handleThemeChange(theme)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer transition group ${
                  theme.id === activeThemeId ? "bg-zinc-800 text-zinc-50 font-medium" : "text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                <input
                  type="text"
                  value={theme.title}
                  onChange={(e) => updateThemeTitle(theme.id, e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 w-full p-0 cursor-pointer text-inherit"
                />
                {themes.length > 1 && (
                  <button
                    onClick={(e) => deleteTheme(theme.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 rounded transition-all text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Añadir Tema con Selector de Tipo */}
        <div className="relative">
          <button 
            onClick={() => setShowThemeMenu(!showThemeMenu)} 
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm py-2.5 rounded-xl font-medium transition"
          >
            + Añadir Tema
          </button>
          
          {showThemeMenu && (
            <div className="absolute bottom-12 left-0 w-full bg-[#222] border border-zinc-800 p-1.5 rounded-xl shadow-2xl flex flex-col gap-1 z-50">
              <button onClick={() => handleAddTheme("text")} className="text-left text-xs text-zinc-300 hover:bg-zinc-800 px-3 py-2 rounded-lg transition flex items-center gap-2">
                📝 Tema de Notas
              </button>
              <button onClick={() => handleAddTheme("table")} className="text-left text-xs text-zinc-300 hover:bg-emerald-950 hover:text-emerald-300 px-3 py-2 rounded-lg transition flex items-center gap-2">
                📊 Hoja de calculo
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 flex flex-col justify-between bg-[#141414] relative overflow-hidden">
        
       {/* ÁREA DE CONTENIDO */}
<div className="flex-1 overflow-y-auto py-16 px-12 md:px-20 max-w-5xl w-full mx-auto">
  {currentSubTab ? (
    currentTheme.type === "table" ? (
      <div className="animate-fadeIn">
        <h2 className="text-lg font-bold mb-4 text-emerald-400">📊 Hoja de Cálculo Interactiva</h2>
        <Table 
          content={currentSubTab.content} 
          onChange={(newData) => updateContent(currentSubTab.id, newData)} 
        />
      </div>
    ) : (
      <div className="animate-fadeIn">
        <h2 className="text-lg font-bold mb-4 text-zinc-400">📝 Notas Enriquecidas</h2>
        <RichTextEditor
          content={currentSubTab.content}
          onChange={(newHtml) => updateContent(currentSubTab.id, newHtml)}
        />
      </div>
    )
  ) : (
    <p className="text-zinc-600">No hay ninguna pestaña activa.</p>
  )}
</div>

        {/* PANEL INFERIOR: PESTAÑAS ESTILO EXCEL */}
        {currentTheme && (
          <footer className="bg-[#1c1c1c] border-t border-zinc-800 px-6 py-2 flex items-center gap-1 overflow-x-auto w-full shrink-0 relative">
            {currentTheme.subTabs?.map((subTab) => (
              <div
                key={subTab.id}
                onClick={() => setActiveSubTabId(subTab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium border rounded-t-lg cursor-pointer transition group ${
                  subTab.id === activeSubTabId 
                    ? "bg-[#141414] text-emerald-400 border-zinc-800 border-b-transparent relative -bottom-[9px] z-10 font-bold" 
                    : "bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900"
                }`}
              >
                <span>{currentTheme.type === "table" ? "📊" : "📝"}</span>
                <input
                  type="text"
                  value={subTab.title}
                  onChange={(e) => updateSubTabTitle(subTab.id, e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 p-0 w-20 text-center cursor-pointer text-inherit"
                />
                {currentTheme.subTabs.length > 1 && (
                  <button
                    onClick={(e) => deleteSubTab(subTab.id, e)}
                    className="opacity-0 group-hover:opacity-100 ml-1 text-zinc-500 hover:text-red-400 transition-all text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* Botón simple de agregar pestaña que adopta la naturaleza del tema */}
            <button
              onClick={handleAddSubTab}
              className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 p-1.5 rounded-lg transition text-xs font-bold ml-2"
              title="Añadir nueva pestaña"
            >
              ➕
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}

export default App;