import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { loadMeThunk } from '@/slices';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import EditorPage from '@/pages/EditorPage';
import Toast from '@/components/Toast';

export default function App() {
  const dispatch = useAppDispatch();
  const { token, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(loadMeThunk());
    else dispatch({ type: 'auth/loadMe/rejected' });
  }, []);

  if (!initialized) {
    return (
      <div className="app-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={token ? <Navigate to="/app" replace /> : <Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/doc/:id" element={<EditorPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
