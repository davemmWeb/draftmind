import React from 'react';

const ThemeSidebar = ({
  themes,
  activeThemeId,
  showThemeMenu,
  setShowThemeMenu,
  onSelectTheme,
  onAddTheme,
  onUpdateTitle,
  onDeleteTheme,
}) => {
  return (
    <aside className="w-64 bg-[#1c1c1c] border-r border-zinc-800 flex flex-col justify-between p-4 shrink-0">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2 mb-4">
          Mis Temas
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[70vh]">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme)}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer transition group ${
                theme.id === activeThemeId
                  ? 'bg-zinc-800 text-zinc-50 font-medium'
                  : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <input
                type="text"
                value={theme.title}
                onChange={(e) => onUpdateTitle(theme.id, e.target.value)}
                className="bg-transparent border-none outline-none focus:ring-0 w-full p-0 cursor-pointer text-inherit"
              />
              {themes.length > 1 && (
                <button
                  onClick={(e) => onDeleteTheme(theme.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 rounded transition-all text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Menú de Selección de los 5 Tipos de Temas */}
      <div className="relative">
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm py-2.5 rounded-xl font-medium transition"
        >
          + Añadir Tema
        </button>

        {showThemeMenu && (
          <div className="absolute bottom-12 left-0 w-full bg-[#222] border border-zinc-800 p-1.5 rounded-xl shadow-2xl flex flex-col gap-1 z-50">
            <button
              onClick={() => onAddTheme('text')}
              className="text-left text-xs text-zinc-300 hover:bg-zinc-800 px-3 py-2 rounded-lg transition"
            >
              📝 Tema de Notas
            </button>
            <button
              onClick={() => onAddTheme('table')}
              className="text-left text-xs text-zinc-300 hover:bg-emerald-950 hover:text-emerald-300 px-3 py-2 rounded-lg transition"
            >
              📊 Hoja de cálculo
            </button>
            <button
              onClick={() => onAddTheme('json-formatter')}
              className="text-left text-xs text-zinc-300 hover:bg-indigo-950 hover:text-indigo-300 px-3 py-2 rounded-lg transition"
            >
              🛠️ JSON Formatter
            </button>
            <button
              onClick={() => onAddTheme('json-diff')}
              className="text-left text-xs text-zinc-300 hover:bg-purple-950 hover:text-purple-300 px-3 py-2 rounded-lg transition"
            >
              ⚖️ JSON Diff / Compare
            </button>
            <button
              onClick={() => onAddTheme('rest-client')}
              className="text-left text-xs text-zinc-300 hover:bg-amber-950 hover:text-amber-300 px-3 py-2 rounded-lg transition"
            >
              🚀 REST Client
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ThemeSidebar;