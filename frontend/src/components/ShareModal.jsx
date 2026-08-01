import { useState, useEffect } from 'react';
import { apiShareDocument, apiGetShares, apiRemoveShare } from '@/helpers/api';
import { useAppDispatch } from '@/hooks/redux';
import { showToast } from '@/slices';
import { getInitials } from '@/lib/utils';
import { FiX, FiUserPlus, FiTrash2, FiShield, FiEdit3 } from 'react-icons/fi';

export default function ShareModal({ docId, docTitle, onClose }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShares();
  }, [docId]);

  const loadShares = async () => {
    try {
      const res = await apiGetShares(docId);
      setShares(res.shares);
    } catch (e) {
      dispatch(showToast({ type: 'error', message: e.message }));
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiShareDocument(docId, { email, permission });
      dispatch(showToast({ type: 'success', message: `Shared with ${email}` }));
      setEmail('');
      loadShares();
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (shareId) => {
    try {
      await apiRemoveShare(docId, shareId);
      dispatch(showToast({ type: 'success', message: 'Access removed' }));
      loadShares();
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Share "{docTitle}"</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className="share-form" onSubmit={handleShare}>
          <div className="share-form__row">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="share-form__input"
            />
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="share-form__select"
            >
              <option value="view">Can view</option>
              <option value="edit">Can edit</option>
            </select>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              <FiUserPlus />
              <span>Share</span>
            </button>
          </div>
        </form>

        <div className="share-list">
          <h3 className="share-list__title">People with access</h3>
          {shares.length === 0 ? (
            <p className="share-list__empty">Not shared with anyone yet.</p>
          ) : (
            shares.map((s) => (
              <div key={s._id} className="share-list__item">
                <div className="avatar avatar--sm">
                  {getInitials(s.sharedWith?.name)}
                </div>
                <div className="share-list__info">
                  <span className="share-list__name">{s.sharedWith?.name}</span>
                  <span className="share-list__email">{s.sharedWith?.email}</span>
                </div>
                <span className={`badge badge--${s.permission}`}>
                  {s.permission === 'edit' ? <FiEdit3 /> : <FiShield />}
                  {s.permission}
                </span>
                <button
                  className="btn btn--ghost btn--icon btn--danger"
                  onClick={() => handleRemove(s._id)}
                  title="Remove access"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
