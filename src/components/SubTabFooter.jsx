import React from 'react';

const SubTabFooter = ({
  currentTheme,
  activeSubTabId,
  onSelectSubTab,
  onAddSubTab,
  onUpdateSubTabTitle,
  onDeleteSubTab,
}) => {
  if (!currentTheme) return null;

  const getThemeMeta = (type) => {
    switch (type) {
      case 'table':
        return { icon: '📊', color: 'text-emerald-400' };
      case 'json-formatter':
        return { icon: '🛠️', color: 'text-indigo-400' };
      case 'json-diff':
        return { icon: '⚖️', color: 'text-purple-400' };
      case 'rest-client':
        return { icon: '🚀', color: 'text-amber-400' };
      default:
        return { icon: '📝', color: 'text-zinc-100' };
    }
  };

  const meta = getThemeMeta(currentTheme.type);

  return (
    <footer className="bg-[#1c1c1c] border-t border-zinc-800 px-6 py-2 flex items-center gap-1 overflow-x-auto w-full shrink-0 relative">
      {currentTheme.subTabs?.map((subTab) => (
        <div
          key={subTab.id}
          onClick={() => onSelectSubTab(subTab.id)}
          className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium border rounded-t-lg cursor-pointer transition group ${
            subTab.id === activeSubTabId
              ? `bg-[#141414] ${meta.color} border-zinc-800 border-b-transparent relative -bottom-[9px] z-10 font-bold`
              : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900'
          }`}
        >
          <span>{meta.icon}</span>
          <input
            type="text"
            value={subTab.title}
            onChange={(e) => onUpdateSubTabTitle(subTab.id, e.target.value)}
            className="bg-transparent border-none outline-none focus:ring-0 p-0 w-20 text-center cursor-pointer text-inherit"
          />
          {currentTheme.subTabs.length > 1 && (
            <button
              onClick={(e) => onDeleteSubTab(subTab.id, e)}
              className="opacity-0 group-hover:opacity-100 ml-1 text-zinc-500 hover:text-red-400 transition-all text-[10px]"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        onClick={onAddSubTab}
        className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 p-1.5 rounded-lg transition text-xs font-bold ml-2"
        title="Añadir nueva pestaña"
      >
        ➕
      </button>
    </footer>
  );
};

export default SubTabFooter;