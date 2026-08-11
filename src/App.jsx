import { useState, useEffect } from "react";
import Table from "./components/Table";
import RichTextEditor from "./components/RichTextEditor";
import DevTools from "./components/DevTools";
import ThemeSidebar from "./components/ThemeSidebar";
import SubTabFooter from "./components/SubTabFooter";

const LOCAL_STORAGE_KEY = "draftmind_themes_v7";

const DEFAULT_DATA = [
  {
    id: "theme-1",
    title: "📝 Notas de Viaje",
    type: "text",
    subTabs: [{ id: "sub-1", title: "Hoja 1", content: "Lienzo de texto..." }],
  },
  {
    id: "theme-2",
    title: "📊 Finanzas Personales",
    type: "table",
    subTabs: [{ id: "sub-2", title: "Tabla 1", content: [["Concepto", "Valor"], ["Ingresos", "0"]] }],
  },
  {
    id: "theme-3",
    title: "🛠️ Formatter de Logs",
    type: "json-formatter",
    subTabs: [{ id: "sub-3", title: "Format 1", content: { input1: '', output: '', error: null } }],
  },
  {
    id: "theme-4",
    title: "⚖️ Comparador JSON",
    type: "json-diff",
    subTabs: [{ id: "sub-4", title: "Diff 1", content: { input1: '', input2: '', error: null } }],
  },
  {
    id: "theme-5",
    title: "🚀 Pruebas API",
    type: "rest-client",
    subTabs: [{ id: "sub-5", title: "Req 1", content: { url: '', method: 'GET', input1: '', output: '' } }],
  },
];

function App() {
  const [themes, setThemes] = useState(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : DEFAULT_DATA;
  });

  const [activeThemeId, setActiveThemeId] = useState(() => themes[0]?.id || "theme-1");
  const [activeSubTabId, setActiveSubTabId] = useState(() => themes[0]?.subTabs[0]?.id || "sub-1");
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(themes));
  }, [themes]);

  const currentTheme = themes.find((t) => t.id === activeThemeId) || themes[0];
  const currentSubTab = currentTheme?.subTabs?.find((st) => st.id === activeSubTabId) || currentTheme?.subTabs?.[0];

  // --- Crear Tema (Maneja los 5 Tipos) ---
  const handleAddTheme = (type) => {
    const newThemeId = crypto.randomUUID();
    const newSubTabId = crypto.randomUUID();

    let initialContent = "";
    let defaultTabTitle = "Hoja 1";
    let defaultThemeTitle = "📝 Nuevas Notas";

    switch (type) {
      case "table":
        initialContent = Array(8).fill(null).map(() => Array(5).fill(""));
        defaultTabTitle = "Tabla 1";
        defaultThemeTitle = "📊 Hoja de Cálculo";
        break;
      case "json-formatter":
        initialContent = { input1: '', output: '', error: null };
        defaultTabTitle = "Format 1";
        defaultThemeTitle = "🛠️ JSON Formatter";
        break;
      case "json-diff":
        initialContent = { input1: '', input2: '', error: null };
        defaultTabTitle = "Diff 1";
        defaultThemeTitle = "⚖️ JSON Diff";
        break;
      case "rest-client":
        initialContent = { url: '', method: 'GET', input1: '', output: '', error: null };
        defaultTabTitle = "Req 1";
        defaultThemeTitle = "🚀 REST Client";
        break;
      default:
        break;
    }

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

  // --- Crear Pestañas Inferiores segun el Tema Activo ---
  const handleAddSubTab = () => {
    if (!currentTheme) return;

    const newSubTabId = crypto.randomUUID();
    const nextNumber = (currentTheme.subTabs?.length || 0) + 1;

    let initialContent = "";
    let defaultTitle = `Hoja ${nextNumber}`;

    switch (currentTheme.type) {
      case "table":
        initialContent = Array(8).fill(null).map(() => Array(5).fill(""));
        defaultTitle = `Tabla ${nextNumber}`;
        break;
      case "json-formatter":
        initialContent = { input1: '', output: '', error: null };
        defaultTitle = `Format ${nextNumber}`;
        break;
      case "json-diff":
        initialContent = { input1: '', input2: '', error: null };
        defaultTitle = `Diff ${nextNumber}`;
        break;
      case "rest-client":
        initialContent = { url: '', method: 'GET', input1: '', output: '', error: null };
        defaultTitle = `Req ${nextNumber}`;
        break;
      default:
        break;
    }

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
    setActiveSubTabId(theme.subTabs[0]?.id || "");
  };

  const renderMainContent = () => {
    if (!currentSubTab) return <p className="text-zinc-600">No hay ninguna pestaña activa.</p>;

    switch (currentTheme.type) {
      case "table":
        return (
          <div className="animate-fadeIn h-full">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">📊 Hoja de Cálculo Interactiva</h2>
            <Table
              content={currentSubTab.content}
              onChange={(newData) => updateContent(currentSubTab.id, newData)}
            />
          </div>
        );
      case "json-formatter":
        return (
          <div className="animate-fadeIn h-full">
            <h2 className="text-lg font-bold mb-3 text-indigo-400">🛠️ JSON Formatter</h2>
            <DevTools
              type="json-formatter"
              content={currentSubTab.content}
              onChange={(newData) => updateContent(currentSubTab.id, newData)}
            />
          </div>
        );
      case "json-diff":
        return (
          <div className="animate-fadeIn h-full flex flex-col overflow-hidden">
            <h2 className="text-lg font-bold mb-3 text-purple-400 shrink-0">⚖️ JSON Diff / Compare</h2>
            <div className="flex-1 min-h-0">
              <DevTools
                type="json-diff"
                content={currentSubTab.content}
                onChange={(newData) => updateContent(currentSubTab.id, newData)}
              />
            </div>
          </div>
        );
      case "rest-client":
        return (
          <div className="animate-fadeIn h-full">
            <h2 className="text-lg font-bold mb-3 text-amber-400">🚀 REST Client (Fetch)</h2>
            <DevTools
              type="rest-client"
              content={currentSubTab.content}
              onChange={(newData) => updateContent(currentSubTab.id, newData)}
            />
          </div>
        );
      default:
        return (
          <div className="animate-fadeIn h-full">
            <h2 className="text-lg font-bold mb-4 text-zinc-400">📝 Notas Enriquecidas</h2>
            <RichTextEditor
              content={currentSubTab.content}
              onChange={(newHtml) => updateContent(currentSubTab.id, newHtml)}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-100 flex font-sans select-none h-screen overflow-hidden">
      <ThemeSidebar
        themes={themes}
        activeThemeId={activeThemeId}
        showThemeMenu={showThemeMenu}
        setShowThemeMenu={setShowThemeMenu}
        onSelectTheme={handleThemeChange}
        onAddTheme={handleAddTheme}
        onUpdateTitle={updateThemeTitle}
        onDeleteTheme={deleteTheme}
      />

      <main className="flex-1 flex flex-col justify-between bg-[#141414] relative overflow-hidden h-full">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl w-full mx-auto h-[calc(100vh-50px)]">
          {renderMainContent()}
        </div>

        <SubTabFooter
          currentTheme={currentTheme}
          activeSubTabId={activeSubTabId}
          onSelectSubTab={setActiveSubTabId}
          onAddSubTab={handleAddSubTab}
          onUpdateSubTabTitle={updateSubTabTitle}
          onDeleteSubTab={deleteSubTab}
        />
      </main>
    </div>
  );
}

export default App;