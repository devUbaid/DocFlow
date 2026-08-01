import {
  FiBold, FiItalic, FiUnderline, FiList,
  FiAlignLeft, FiCode, FiMinus,
} from 'react-icons/fi';
import {
  LuHeading1, LuHeading2, LuHeading3, LuListOrdered,
  LuQuote, LuUndo2, LuRedo2,
} from 'react-icons/lu';

export default function Toolbar({ editor }) {
  if (!editor) return null;

  const btn = (label, icon, action, isActive) => (
    <button
      key={label}
      className={`toolbar__btn ${isActive ? 'toolbar__btn--active' : ''}`}
      onMouseDown={(e) => { e.preventDefault(); action(); }}
      onClick={(e) => { e.preventDefault(); /* keep for keyboard/activation accessibility - do not re-run action */ }}
      title={label}
      type="button"
    >
      {icon}
    </button>
  );

  return (
    <div className="toolbar">
      <div className="toolbar__group">
        {btn('Bold', <FiBold />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {btn('Italic', <FiItalic />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {btn('Underline', <FiUnderline />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
        {btn('Code', <FiCode />, () => editor.chain().focus().toggleCode().run(), editor.isActive('code'))}
      </div>

      <div className="toolbar__sep" />

      <div className="toolbar__group">
        {btn('Heading 1', <LuHeading1 />, () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
        {btn('Heading 2', <LuHeading2 />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
        {btn('Heading 3', <LuHeading3 />, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
      </div>

      <div className="toolbar__sep" />

      <div className="toolbar__group">
        {btn('Bullet List', <FiList />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {btn('Ordered List', <LuListOrdered />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
        {btn('Blockquote', <LuQuote />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
        {btn('Divider', <FiMinus />, () => editor.chain().focus().setHorizontalRule().run(), false)}
      </div>

      <div className="toolbar__sep" />

      <div className="toolbar__group">
        {btn('Undo', <LuUndo2 />, () => editor.chain().focus().undo().run(), false)}
        {btn('Redo', <LuRedo2 />, () => editor.chain().focus().redo().run(), false)}
      </div>
    </div>
  );
}
