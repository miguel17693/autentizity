"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  YoutubeIcon,
} from "lucide-react";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "full" | "compact";
}

function ToolbarBtn({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? "bg-accent/10 text-accent"
          : "text-text-muted hover:text-text-body hover:bg-surface-alt"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  variant = "full",
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      ImageExtension,
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-accent underline" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[120px] max-h-[50vh] overflow-y-auto px-3 py-2.5 text-sm text-text-body font-light leading-relaxed editor-content",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Error al subir");
        const { url } = await res.json();
        return url;
      } catch {
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      if (!ALLOWED_TYPES.includes(file.type)) {
        alert("Solo se permiten imágenes PNG, JPG o WebP");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no puede superar 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const url = await uploadImage(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [editor, uploadImage]
  );

  const handleYoutubeClick = useCallback(() => {
    if (!editor) return;
    const url = prompt("URL del vídeo de YouTube:");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  const handleLinkClick = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("URL del enlace:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="w-full px-3 py-2.5 text-sm text-text-muted border border-border bg-surface-alt">
        Cargando editor...
      </div>
    );
  }

  const buttonSize = 15;

  return (
    <>
      <style>{`
        .editor-content { outline: none; }
        .editor-content h1 { font-family: serif; font-size: 1.5rem; font-weight: 300; margin-top: 1rem; margin-bottom: 0.5rem; line-height: 1.15; }
        .editor-content h2 { font-family: serif; font-size: 1.25rem; font-weight: 300; margin-top: 0.75rem; margin-bottom: 0.5rem; line-height: 1.2; }
        .editor-content h3 { font-size: 1.05rem; font-weight: 400; margin-top: 0.5rem; margin-bottom: 0.25rem; }
        .editor-content p { margin-bottom: 0.5rem; }
        .editor-content ul, .editor-content ol { padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .editor-content li { margin-bottom: 0.25rem; }
        .editor-content li p { margin-bottom: 0; }
        .editor-content blockquote { border-left: 2px solid var(--color-border, #e5e7eb); padding-left: 1rem; margin: 0.5rem 0; color: var(--color-text-secondary, #6b7280); font-style: italic; }
        .editor-content img { max-width: 100%; height: auto; margin: 0.5rem 0; }
        .editor-content .iframe-wrapper { position: relative; padding-bottom: 56.25%; height: 0; margin: 0.5rem 0; }
        .editor-content .iframe-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .editor-content p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #9ca3af; pointer-events: none; height: 0; }
        .editor-content a { color: var(--color-accent, #3b82f6); text-decoration: underline; cursor: pointer; }
        .editor-content strong { font-weight: 700; }
        .editor-content em { font-style: italic; }
      `}</style>

      <div className="border border-border focus-within:border-accent bg-surface-alt transition-colors rounded-xl overflow-hidden">
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-white flex-wrap">
          <div className="flex items-center gap-0.5">
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Negrita"
            >
              <Bold size={buttonSize} />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Cursiva"
            >
              <Italic size={buttonSize} />
            </ToolbarBtn>
          </div>

          <div className="w-px h-5 bg-border mx-1" />

          {variant === "full" && (
            <>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive("heading", { level: 1 })}
                title="Título 1"
              >
                <Heading1 size={buttonSize} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive("heading", { level: 2 })}
                title="Título 2"
              >
                <Heading2 size={buttonSize} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive("heading", { level: 3 })}
                title="Título 3"
              >
                <Heading3 size={buttonSize} />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border mx-1" />
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Lista"
              >
                <List size={buttonSize} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Lista numerada"
              >
                <ListOrdered size={buttonSize} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                title="Cita"
              >
                <Quote size={buttonSize} />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border mx-1" />
            </>
          )}

          <ToolbarBtn
            onClick={handleLinkClick}
            isActive={editor.isActive("link")}
            title="Enlace"
          >
            <Link size={buttonSize} />
          </ToolbarBtn>

          {variant === "full" && (
            <>
              <ToolbarBtn
                onClick={handleImageClick}
                disabled={uploading}
                title="Insertar imagen"
              >
                <Image size={buttonSize} />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={handleYoutubeClick}
                title="Insertar vídeo de YouTube"
              >
                <YoutubeIcon size={buttonSize} />
              </ToolbarBtn>
            </>
          )}
        </div>

        <EditorContent editor={editor} />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {uploading && (
          <div className="px-3 py-2 text-xs text-text-muted animate-pulse">
            Subiendo imagen...
          </div>
        )}
      </div>
    </>
  );
}
