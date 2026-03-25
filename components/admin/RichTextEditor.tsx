'use client';

// @ts-ignore
import { useEditor, EditorContent } from '@tiptap/react';
// @ts-ignore
import StarterKit from '@tiptap/starter-kit';
// @ts-ignore
import Image from '@tiptap/extension-image';
// @ts-ignore
import Link from '@tiptap/extension-link';
import { useCallback, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Undo, 
  Redo 
} from 'lucide-react';
import { toast } from 'sonner';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blog_images');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      const { url } = await res.json();

      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image.');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children 
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    disabled?: boolean, 
    children: React.ReactNode 
  }) => (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      className={`p-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50 items-center">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
           <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
           <Italic size={18} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
           <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>
           <Heading3 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
           <List size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
           <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
           <Quote size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
           <LinkIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()}>
           <ImageIcon size={18} />
        </ToolbarButton>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
           <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
           <Redo size={18} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="cursor-text" onClick={() => editor.commands.focus()} />
    </div>
  );
}
