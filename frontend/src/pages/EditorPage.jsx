import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { apiGetDocument, apiUpdateDocument } from '@/helpers/api';
import { useAppDispatch } from '@/hooks/redux';
import { showToast } from '@/slices';
import Toolbar from '@/components/Editor/Toolbar';
import ShareModal from '@/components/ShareModal';
import { FiArrowLeft, FiShare2, FiCheck, FiLoader, FiClock } from 'react-icons/fi';
import { timeAgo } from '@/lib/utils';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [doc, setDoc] = useState(null);
  const [permission, setPermission] = useState('owner');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  // keep track of last known content (any editor update) and last saved content
  const lastKnownContentRef = useRef('');
  const lastSavedContentRef = useRef('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    content: '',
    editable: false,
    onUpdate: ({ editor }) => {
      // Only schedule a save when the document HTML actually changed
      const html = editor.getHTML();
      if (html !== lastKnownContentRef.current) {
        lastKnownContentRef.current = html;
        if (html !== lastSavedContentRef.current) {
          scheduleSave(title, html);
        }
      }
    },
  });


  useEffect(() => {
    loadDoc();
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [id]);

  const loadDoc = async () => {
    setLoading(true);
    try {
      const res = await apiGetDocument(id);
      setDoc(res.document);
      setTitle(res.document.title);
      setPermission(res.permission);
      if (editor) {
        editor.commands.setContent(res.document.content || '');
        editor.setEditable(res.permission === 'owner' || res.permission === 'edit');
        // initialize content refs
        lastKnownContentRef.current = res.document.content || '';
        lastSavedContentRef.current = res.document.content || '';
      }
    } catch (e) {
      dispatch(showToast({ type: 'error', message: e.message }));
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editor && doc) {
      editor.commands.setContent(doc.content || '');
      editor.setEditable(permission === 'owner' || permission === 'edit');
    }
  }, [editor, doc]);

  const scheduleSave = useCallback(
    (t, c) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaved(false);
      saveTimer.current = setTimeout(() => doSave(t, c), 1000);
    },
    [id]
  );

  const doSave = async (t, c) => {
    setSaving(true);
    try {
      const payload = { content: c };
      if (t && t.trim().length) payload.title = t;
      const res = await apiUpdateDocument(id, payload);
      setDoc(res.document);
      setSaved(true);
      // record last saved content so subsequent selection-only updates won't trigger saves
      lastSavedContentRef.current = res.document.content || '';
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      dispatch(showToast({ type: 'error', message: e.message }));
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    scheduleSave(newTitle, editor?.getHTML() || '');
  };

  const canEdit = permission === 'owner' || permission === 'edit';

  if (loading) {
    return (
      <div className="editor-page editor-page--loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="editor-page">
      <div className="editor-header">
        <div className="editor-header__left">
          <button className="btn btn--ghost btn--icon" onClick={() => navigate('/app')}>
            <FiArrowLeft />
          </button>
          <input
            className="editor-header__title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Document"
            disabled={!canEdit}
          />
        </div>

        <div className="editor-header__right">
          <div className="save-status">
            {saving && (
              <>
                <FiLoader className="spin" /> Saving...
              </>
            )}
            {saved && !saving && (
              <>
                <FiCheck /> Saved
              </>
            )}
            {!saving && !saved && doc && (
              <>
                <FiClock /> {timeAgo(doc.updatedAt)}
              </>
            )}
          </div>

          {!canEdit && (
            <span className="badge badge--view">View only</span>
          )}

          {permission === 'owner' && (
            <button className="btn btn--outline" onClick={() => setShowShare(true)}>
              <FiShare2 />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>

      {canEdit && <Toolbar editor={editor} />}

      <div className="editor-container">
        <EditorContent editor={editor} className="editor-content" />
      </div>

      {showShare && (
        <ShareModal
          docId={id}
          docTitle={title}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
