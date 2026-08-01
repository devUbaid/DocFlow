import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/redux';
import { showToast } from '@/slices';
import { apiListOwned, apiListShared, apiCreateDocument, apiDeleteDocument, apiUploadFile } from '@/helpers/api';
import { formatDateTime, timeAgo, getInitials } from '@/lib/utils';
import {
  FiPlus, FiUpload, FiFileText, FiTrash2, FiUsers,
  FiClock, FiSearch, FiGrid, FiList, FiFile,
} from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState('owned');
  const [owned, setOwned] = useState([]);
  const [shared, setShared] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [showUpload, setShowUpload] = useState(false);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const [ownRes, sharedRes] = await Promise.all([apiListOwned(), apiListShared()]);
      setOwned(ownRes.documents);
      setShared(sharedRes.documents);
    } catch (e) {
      dispatch(showToast({ type: 'error', message: e.message }));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const createDoc = async () => {
    try {
      const res = await apiCreateDocument({ title: 'Untitled Document' });
      navigate(`/app/doc/${res.document._id}`);
    } catch (e) {
      dispatch(showToast({ type: 'error', message: e.message }));
    }
  };

  const deleteDoc = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this document?')) return;
    try {
      await apiDeleteDocument(id);
      dispatch(showToast({ type: 'success', message: 'Document deleted' }));
      fetchDocs();
    } catch (e) {
      dispatch(showToast({ type: 'error', message: e.message }));
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await apiUploadFile(fd);
      dispatch(showToast({ type: 'success', message: 'File imported as document' }));
      navigate(`/app/doc/${res.document._id}`);
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    }
    setShowUpload(false);
  };

  const docs = tab === 'owned' ? owned : shared;
  const filtered = docs.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">My Documents</h1>
          <p className="dashboard__subtitle">Create, edit, and share your documents</p>
        </div>
        <div className="dashboard__actions">
          <label className="btn btn--outline">
            <FiUpload />
            <span>Import File</span>
            <input type="file" accept=".txt,.md" hidden onChange={handleUpload} />
          </label>
          <button className="btn btn--primary" onClick={createDoc}>
            <FiPlus />
            <span>New Document</span>
          </button>
        </div>
      </div>

      <div className="dashboard__toolbar">
        <div className="tab-group">
          <button
            className={`tab-group__btn ${tab === 'owned' ? 'tab-group__btn--active' : ''}`}
            onClick={() => setTab('owned')}
          >
            <FiFileText /> My Docs
            <span className="tab-group__count">{owned.length}</span>
          </button>
          <button
            className={`tab-group__btn ${tab === 'shared' ? 'tab-group__btn--active' : ''}`}
            onClick={() => setTab('shared')}
          >
            <FiUsers /> Shared with me
            <span className="tab-group__count">{shared.length}</span>
          </button>
        </div>

        <div className="dashboard__toolbar-right">
          <div className="search-bar">
            <FiSearch className="search-bar__icon" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${view === 'grid' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => setView('grid')}
            >
              <FiGrid />
            </button>
            <button
              className={`view-toggle__btn ${view === 'list' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => setView('list')}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="dashboard__loading">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <FiFile className="empty-state__icon" />
          <h3>
            {search
              ? 'No documents match your search'
              : tab === 'owned'
              ? 'No documents yet'
              : 'No shared documents'}
          </h3>
          <p>
            {tab === 'owned'
              ? 'Create your first document or import a file to get started.'
              : 'When someone shares a document with you, it will appear here.'}
          </p>
          {tab === 'owned' && !search && (
            <button className="btn btn--primary" onClick={createDoc}>
              <FiPlus /> Create Document
            </button>
          )}
        </div>
      ) : (
        <div className={view === 'grid' ? 'doc-grid' : 'doc-list'}>
          {filtered.map((doc) => (
            <div
              key={doc._id}
              className={view === 'grid' ? 'doc-card' : 'doc-row'}
              onClick={() => navigate(`/app/doc/${doc._id}`)}
            >
              <div className="doc-card__icon-wrap">
                <FiFileText />
              </div>
              <div className="doc-card__body">
                <h3 className="doc-card__title">{doc.title}</h3>
                <div className="doc-card__meta">
                  {tab === 'shared' && doc.owner && (
                    <span className="doc-card__owner">
                      <span className="avatar avatar--xs">{getInitials(doc.owner.name)}</span>
                      {doc.owner.name}
                    </span>
                  )}
                  {tab === 'shared' && doc.sharePermission && (
                    <span className={`badge badge--${doc.sharePermission}`}>
                      {doc.sharePermission}
                    </span>
                  )}
                  <span className="doc-card__time">
                    <FiClock /> {timeAgo(doc.updatedAt)}
                  </span>
                </div>
              </div>
              {tab === 'owned' && (
                <button
                  className="doc-card__delete"
                  onClick={(e) => deleteDoc(e, doc._id)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
