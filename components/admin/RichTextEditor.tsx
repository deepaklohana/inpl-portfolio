'use client';

// @ts-ignore
import { useEditor, EditorContent } from '@tiptap/react';
// @ts-ignore
import StarterKit from '@tiptap/starter-kit';
// @ts-ignore
import Image from '@tiptap/extension-image';
// @ts-ignore
import Link from '@tiptap/extension-link';
import { useCallback, useRef, useState } from 'react';
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
  Redo,
  BarChart3,
  Megaphone,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// ─── Stats Modal State
interface StatItem { value: string; label: string }
const DEFAULT_STATS: StatItem[] = [
  { value: '85%', label: 'Faster Decisions' },
  { value: '3x', label: 'More Insights' },
  { value: '60%', label: 'Cost Reduction' },
];

// ─── CTA Modal State
interface CTAData {
  title: string;
  subtitle: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
}
const DEFAULT_CTA: CTAData = {
  title: 'Ready to Transform Your Analytics?',
  subtitle: 'Start your free 30-day trial today. No credit card required.',
  primaryText: 'Start Free Trial',
  primaryLink: '/contact',
  secondaryText: '',
  secondaryLink: '',
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkMenuOpen, setLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // Stats modal
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);

  // CTA modal
  const [ctaModalOpen, setCtaModalOpen] = useState(false);
  const [cta, setCta] = useState<CTAData>(DEFAULT_CTA);

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
        class: 'focus:outline-none min-h-[300px] max-h-[500px] overflow-y-auto p-4 text-sm',
      },
    },
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getHTML());
    },
  });

  const openLinkMenu = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkMenuOpen(true);
  }, [editor]);

  const saveLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('/')) {
        finalUrl = 'https://' + finalUrl;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
    }
    setLinkMenuOpen(false);
  }, [editor, linkUrl]);

  // ─── Insert Stats shortcode
  const insertStats = useCallback(() => {
    if (!editor) return;
    const shortcode = stats
      .map(s => `${s.value}|${s.label}`)
      .join(', ');
    editor.chain().focus().insertContent(`<p>[STATS: ${shortcode}]</p>`).run();
    setStatsModalOpen(false);
    setStats(DEFAULT_STATS);
    toast.success('Stats block inserted!');
  }, [editor, stats]);

  const insertCTA = useCallback(() => {
    if (!editor) return;
    let shortcode = `[CTA: ${cta.title} | ${cta.subtitle} | ${cta.primaryText} | ${cta.primaryLink}`;
    if (cta.secondaryText && cta.secondaryLink) {
      shortcode += ` | ${cta.secondaryText} | ${cta.secondaryLink}`;
    }
    shortcode += ']';
    editor.chain().focus().insertContent(`<p>${shortcode}</p>`).run();
    setCtaModalOpen(false);
    setCta(DEFAULT_CTA);
    toast.success('CTA block inserted!');
  }, [editor, cta]);

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
    children,
    title,
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    disabled?: boolean, 
    children: React.ReactNode,
    title?: string,
  }) => (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      type="button"
    >
      {children}
    </button>
  );

  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#2251B5] focus:ring-2 focus:ring-[#2251B5]/10 outline-none transition-colors';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <div className="border border-gray-300 rounded-md bg-white">
      <div className="flex items-center gap-1 px-2 py-2 border-b border-gray-300 bg-gray-50 rounded-t-md z-10 relative overflow-x-auto scrollbar-none">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
           <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
           <Italic size={18} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
           <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
           <Heading3 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
           <List size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
           <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
           <Quote size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <div className="relative flex items-center">
          <ToolbarButton onClick={openLinkMenu} isActive={editor.isActive('link') || linkMenuOpen} title="Insert Link">
            <LinkIcon size={18} />
          </ToolbarButton>
          {linkMenuOpen && (
            <div className="absolute top-10 left-0 bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg p-2 z-50 flex items-center gap-2 min-w-[320px]">
              <input 
                type="text" 
                value={linkUrl} 
                onChange={(e) => setLinkUrl(e.target.value)} 
                placeholder="https://example.com" 
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:border-[#2251B5] focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); saveLink(); }
                  if (e.key === 'Escape') setLinkMenuOpen(false);
                }}
              />
              <button type="button" onClick={saveLink} className="bg-[#2251B5] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#1a3f99] font-medium shadow-sm transition-colors">Save</button>
              <button type="button" onClick={() => setLinkMenuOpen(false)} className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Cancel</button>
            </div>
          )}
        </div>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Insert Image">
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

        {/* ─── Shortcode Buttons ─── */}
        <button
          type="button"
          title="Insert Stats Block"
          onClick={() => setStatsModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#2251B5] bg-[#2251B5]/8 hover:bg-[#2251B5]/15 border border-[#2251B5]/20 transition-colors"
        >
          <BarChart3 size={14} />
          Stats
        </button>
        <button
          type="button"
          title="Insert CTA Block"
          onClick={() => setCtaModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#E96429] bg-[#E96429]/8 hover:bg-[#E96429]/15 border border-[#E96429]/20 transition-colors"
        >
          <Megaphone size={14} />
          CTA
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
           <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
           <Redo size={18} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="cursor-text" onClick={() => editor.commands.focus()} />

      {/* ═══ Stats Modal ═══ */}
      {statsModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Insert Stats Block</h3>
                <p className="text-xs text-gray-500 mt-0.5">Add up to 4 stat items</p>
              </div>
              <button type="button" onClick={() => setStatsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Preview */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex gap-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 p-3">
                {stats.map((s, i) => (
                  <div key={i} className={`flex-1 rounded-xl py-3 px-2 text-center text-xs ${i === 1 ? 'bg-[#2251B5] text-white' : 'bg-white border border-gray-200'}`}>
                    <div className={`text-lg font-bold ${i === 1 ? 'text-white' : 'text-[#2251B5]'}`}>{s.value || '—'}</div>
                    <div className={`text-[10px] mt-0.5 ${i === 1 ? 'text-white/80' : 'text-gray-600'}`}>{s.label || 'Label'}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-center">Live preview</p>
            </div>

            {/* Stat Fields */}
            <div className="px-6 pb-4 space-y-3 max-h-56 overflow-y-auto">
              {stats.map((stat, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1">
                    {i === 0 && <label className={labelCls}>Value (e.g. 85%)</label>}
                    <input
                      type="text"
                      value={stat.value}
                      onChange={e => {
                        const updated = [...stats];
                        updated[i] = { ...updated[i], value: e.target.value };
                        setStats(updated);
                      }}
                      placeholder="85%"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex-2">
                    {i === 0 && <label className={labelCls}>Label</label>}
                    <input
                      type="text"
                      value={stat.label}
                      onChange={e => {
                        const updated = [...stats];
                        updated[i] = { ...updated[i], label: e.target.value };
                        setStats(updated);
                      }}
                      placeholder="Faster Decisions"
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStats(stats.filter((_, idx) => idx !== i))}
                    className="mb-0.5 p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {stats.length < 4 && (
                <button
                  type="button"
                  onClick={() => setStats([...stats, { value: '', label: '' }])}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-[#2251B5] hover:text-[#2251B5] transition-colors"
                >
                  + Add Stat
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button type="button" onClick={() => setStatsModalOpen(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 font-medium transition-colors">Cancel</button>
              <button type="button" onClick={insertStats} className="flex-1 py-2 bg-[#2251B5] text-white rounded-xl text-sm font-semibold hover:bg-[#1a3f99] transition-colors shadow-sm">Insert Block</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CTA Modal ═══ */}
      {ctaModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Insert CTA Block</h3>
                <p className="text-xs text-gray-500 mt-0.5">Blue gradient call-to-action section</p>
              </div>
              <button type="button" onClick={() => setCtaModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Fields */}
            <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <div>
                <label className={labelCls}>Title</label>
                <input type="text" value={cta.title} onChange={e => setCta({ ...cta, title: e.target.value })} className={inputCls} placeholder="Ready to Transform Your Analytics?" />
              </div>
              <div>
                <label className={labelCls}>Subtitle</label>
                <input type="text" value={cta.subtitle} onChange={e => setCta({ ...cta, subtitle: e.target.value })} className={inputCls} placeholder="Start your free 30-day trial today." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Primary Button Text</label>
                  <input type="text" value={cta.primaryText} onChange={e => setCta({ ...cta, primaryText: e.target.value })} className={inputCls} placeholder="Start Free Trial" />
                </div>
                <div>
                  <label className={labelCls}>Primary Button Link</label>
                  <input type="text" value={cta.primaryLink} onChange={e => setCta({ ...cta, primaryLink: e.target.value })} className={inputCls} placeholder="/contact" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Secondary Button Text (Optional)</label>
                  <input type="text" value={cta.secondaryText} onChange={e => setCta({ ...cta, secondaryText: e.target.value })} className={inputCls} placeholder="Schedule Demo" />
                </div>
                <div>
                  <label className={labelCls}>Secondary Button Link (Optional)</label>

                  <input type="text" value={cta.secondaryLink} onChange={e => setCta({ ...cta, secondaryLink: e.target.value })} className={inputCls} placeholder="/demo" />
                </div>
              </div>

              {/* Mini Preview */}
              <div className="mt-2 rounded-xl bg-[#2251B5] text-white text-center p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#E96429] opacity-30 blur-xl rounded-full" />
                <p className="text-sm font-bold relative z-10">{cta.title || 'Your Title'}</p>
                <p className="text-xs text-white/70 mt-1 relative z-10">{cta.subtitle || 'Your subtitle'}</p>
                <div className="flex gap-2 justify-center mt-3 relative z-10">
                  <span className="bg-white text-[#2251B5] text-[10px] font-semibold px-3 py-1 rounded-lg">{cta.primaryText || 'Button 1'}</span>
                  {cta.secondaryText && (
                    <span className="border border-white text-white text-[10px] font-semibold px-3 py-1 rounded-lg">{cta.secondaryText}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button type="button" onClick={() => setCtaModalOpen(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 font-medium transition-colors">Cancel</button>
              <button type="button" onClick={insertCTA} className="flex-1 py-2 bg-[#E96429] text-white rounded-xl text-sm font-semibold hover:bg-[#d8551f] transition-colors shadow-sm">Insert Block</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
