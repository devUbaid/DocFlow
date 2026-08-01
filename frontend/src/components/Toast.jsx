import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { dismissToast } from '@/slices';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const icons = {
  success: <FiCheckCircle />,
  error: <FiAlertCircle />,
  info: <FiInfo />,
};

export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((s) => s.ui.toast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(dismissToast()), 3500);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast__icon">{icons[toast.type] || icons.info}</span>
      <span className="toast__msg">{toast.message}</span>
      <button className="toast__close" onClick={() => dispatch(dismissToast())}>
        <FiX />
      </button>
    </div>
  );
}
