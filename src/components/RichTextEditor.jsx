import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    // Cada vez que el usuario escriba, enviamos el HTML limpio al estado de App.jsx
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "w-full text-base bg-transparent text-zinc-300 outline-none focus:ring-0 leading-relaxed min-h-[40vh] placeholder-zinc-700 font-sans ProseMirror",
      },
    },
  });

  // Sincronizar el contenido si cambia desde el estado global (por ejemplo, al cambiar de pestaña)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* BARRA DE HERRAMIENTAS ESTILO WORD / NOTION MINIMALISTA */}
      <div className="flex flex-wrap items-center gap-1 bg-[#1c1c1c] border border-zinc-800 p-1.5 rounded-xl max-w-max">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
            editor.isActive("bold") ? "bg-emerald-950 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2.5 py-1 text-xs italic rounded-lg transition ${
            editor.isActive("italic") ? "bg-emerald-950 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2.5 py-1 text-xs line-through rounded-lg transition ${
            editor.isActive("strike") ? "bg-emerald-950 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          S
        </button>
        
        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
            editor.isActive("heading", { level: 1 }) ? "bg-emerald-950 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
            editor.isActive("heading", { level: 2 }) ? "bg-emerald-950 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          H2
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2.5 py-1 text-xs rounded-lg transition ${
            editor.isActive("bulletList") ? "bg-emerald-950 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          • Lista
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2.5 py-1 text-xs rounded-lg transition ${
            editor.isActive("orderedList") ? "bg-emerald-950 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          1. Lista
        </button>
      </div>

      {/* ÁREA DEL TEXTO REACTIVO */}
      <div className="py-4 border-t border-zinc-900 mt-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default RichTextEditor;