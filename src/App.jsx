import { useState, useEffect } from "react";

const BLOCK_TYPES = {
  TITLE: "title",
  HEADING: "heading",
  PARAGRAPH: "paragraph",
};

// Clave única para almacenar los datos en el navegador
const LOCAL_STORAGE_KEY = "draftmind_themes_data";

// Datos por defecto en caso de que el storage esté vacío
const DEFAULT_DATA = [
  {
    id: "theme-1",
    title: "🚀 Proyecto Alfa",
    subTabs: [
      { id: "sub-1", title: "General", content: "Este es el lienzo de texto de la pestaña General." },
      { id: "sub-2", title: "Tareas", content: "Lista de pendientes del proyecto..." },
    ],
  },
  {
    id: "theme-2",
    title: "📚 Estudios",
    subTabs: [
      { id: "sub-3", title: "Clase 1", content: "Apuntes de la primera clase." },
    ],
  },
];

function App() {
  // 1. CARGA INICIAL: Intentamos leer de localStorage, si no hay nada, cargamos DEFAULT_DATA
  const [themes, setThemes] = useState(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : DEFAULT_DATA;
  });

  // Controladores de navegación (pestañas activas)
  const [activeThemeId, setActiveThemeId] = useState(themes[0]?.id || "theme-1");
  const [activeSubTabIds, setActiveSubTabIds] = useState(() => {
    // Inicializamos las subpestañas activas apuntando a la primera hoja de cada tema guardado
    const initialActiveSubs = {};
    themes.forEach(theme => {
      if (theme.subTabs && theme.subTabs.length > 0) {
        initialActiveSubs[theme.id] = theme.subTabs[0].id;
      }
    });
    return initialActiveSubs;
  });

  // 2. PERSISTENCIA AUTOMÁTICA: Cada vez que 'themes' cambie, guardamos en localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(themes));
  }, [themes]);

  // Encontrar el tema activo actual y la sub-pestaña activa actual
  const currentTheme = themes.find((t) => t.id === activeThemeId) || themes[0];
  const currentSubTabId = activeSubTabIds[currentTheme?.id] || currentTheme?.subTabs[0]?.id;
  const currentSubTab = currentTheme?.subTabs.find((st) => st.id === currentSubTabId) || currentTheme?.subTabs[0];

  // Funciones para gestionar Temas (Izquierda)
  const addTheme = () => {
    const newThemeId = crypto.randomUUID();
    const newSubTabId = crypto.randomUUID();
    const newTheme = {
      id: newThemeId,
      title: "Nuevo Tema",
      subTabs: [{ id: newSubTabId, title: "Hoja 1", content: "" }],
    };
    setThemes([...themes, newTheme]);
    setActiveThemeId(newThemeId);
    setActiveSubTabIds((prev) => ({ ...prev, [newThemeId]: newSubTabId }));
  };

  const updateThemeTitle = (id, newTitle) => {
    setThemes(themes.map((t) => (t.id === id ? { ...t, title: newTitle } : t)));
  };

  // Funciones para gestionar Sub-pestañas (Abajo estilo Excel)
  const addSubTab = (themeId) => {
    const targetTheme = themes.find(t => t.id === themeId);
    if (!targetTheme) return;

    const newSubTabId = crypto.randomUUID();
    const newSubTab = { id: newSubTabId, title: `Hoja ${targetTheme.subTabs.length + 1}`, content: "" };
    
    setThemes(
      themes.map((t) =>
        t.id === themeId ? { ...t, subTabs: [...t.subTabs, newSubTab] } : t
      )
    );
    setActiveSubTabIds((prev) => ({ ...prev, [themeId]: newSubTabId }));
  };

  const updateSubTabTitle = (themeId, subTabId, newTitle) => {
    setThemes(
      themes.map((t) =>
        t.id === themeId
          ? {
              ...t,
              subTabs: t.subTabs.map((st) => (st.id === subTabId ? { ...st, title: newTitle } : st)),
            }
          : t
      )
    );
  };

  // Actualizar el contenido de texto principal
  const updateContent = (themeId, subTabId, newContent) => {
    setThemes(
      themes.map((t) =>
        t.id === themeId
          ? {
              ...t,
              subTabs: t.subTabs.map((st) => (st.id === subTabId ? { ...st, content: newContent } : st)),
            }
          : t
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-100 flex font-sans">
      
      {/* PANEL IZQUIERDO: TEMAS */}
      <aside className="w-64 bg-[#1c1c1c] border-r border-zinc-800 flex flex-col justify-between p-4 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2 mb-4">
            Mis Temas
          </div>
          
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[75vh]">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setActiveThemeId(theme.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition group ${
                  theme.id === activeThemeId
                    ? "bg-zinc-800 text-zinc-50 font-medium"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                <input
                  type="text"
                  value={theme.title}
                  onChange={(e) => updateThemeTitle(theme.id, e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 w-full p-0 cursor-pointer font-inherit text-inherit"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={addTheme}
          className="mt-4 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-1"
        >
          + Añadir Tema
        </button>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 flex flex-col justify-between bg-[#141414] relative overflow-hidden">
        
        {/* ÁREA DE ESCRITURA */}
        <div className="flex-1 overflow-y-auto py-16 px-12 md:px-24 max-w-4xl w-full mx-auto">
          {currentSubTab ? (
            <textarea
              value={currentSubTab.content}
              onChange={(e) => {
                updateContent(currentTheme.id, currentSubTab.id, e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="w-full text-base border-none outline-none focus:ring-0 bg-transparent text-zinc-300 resize-none leading-relaxed h-auto min-h-[40vh] placeholder-zinc-700"
              placeholder="Empieza a escribir en esta pestaña..."
              autoFocus
            />
          ) : (
            <p className="text-zinc-600">Crea una pestaña abajo para escribir.</p>
          )}
        </div>

        {/* PANEL INFERIOR: SUB-PESTAÑAS (Estilo Excel) */}
        {currentTheme && (
          <footer className="bg-[#1c1c1c] border-t border-zinc-800 px-6 py-2 flex items-center gap-1 overflow-x-auto w-full shrink-0">
            {currentTheme.subTabs.map((subTab) => (
              <div
                key={subTab.id}
                onClick={() =>
                  setActiveSubTabIds((prev) => ({ ...prev, [currentTheme.id]: subTab.id }))
                }
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium border rounded-t-lg cursor-pointer transition select-none ${
                  subTab.id === currentSubTabId
                    ? "bg-[#141414] text-emerald-400 border-zinc-800 border-b-transparent relative -bottom-[9px] z-10 font-bold"
                    : "bg-transparent text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <input
                  type="text"
                  value={subTab.title}
                  onChange={(e) => updateSubTabTitle(currentTheme.id, subTab.id, e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 p-0 w-20 text-center cursor-pointer text-inherit"
                />
              </div>
            ))}

            <button
              onClick={() => addSubTab(currentTheme.id)}
              className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 p-1.5 rounded-lg transition ml-2 text-xs font-bold"
              title="Añadir pestaña"
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