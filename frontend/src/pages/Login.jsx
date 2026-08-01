import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loginThunk, registerThunk, clearError } from '@/slices';
import {
  FiFileText, FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiArrowLeft, FiEdit3, FiUsers, FiUpload,
} from 'react-icons/fi';

export default function Login() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [isRegister, setIsRegister] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (isRegister) {
      dispatch(registerThunk(form));
    } else {
      dispatch(loginThunk({ email: form.email, password: form.password }));
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    dispatch(clearError());
  };

  return (
    <div className="auth-page">
      {/* Left — Branded Panel */}
      <aside className="auth-brand">
        <div className="auth-brand-decor">
          <span className="auth-wm">docflow</span>
          <div className="auth-orb" />
        </div>
        <div className="auth-brand-inner">
          <Link to="/" className="auth-brand-logo">
            <div className="auth-brand-mark">
              <FiFileText />
            </div>
            <span>DocFlow</span>
          </Link>

          <div className="auth-brand-body">
            <span className="auth-eyebrow-brand">Collaborative Editor</span>
            <h1 className="auth-brand-heading">
              Write, share, and<br />
              <em>collaborate.</em>
            </h1>
            <p className="auth-brand-desc">
              A lightweight document editor with rich-text formatting,
              file import, and simple sharing — designed for teams that move fast.
            </p>
            <ul className="auth-brand-list">
              <li><FiEdit3 /> Rich-text editing with auto-save</li>
              <li><FiUsers /> Share documents with view or edit access</li>
              <li><FiUpload /> Import .txt and .md files instantly</li>
            </ul>
          </div>

          <div className="auth-brand-footer">
            DocFlow — Collaborative Document Editor
          </div>
        </div>
      </aside>

      {/* Right — Form Side */}
      <main className="auth-form-side">
        <div className="auth-topbar">
          <Link to="/" className="auth-brand-mobile">
            <FiFileText />
            <span>DocFlow</span>
          </Link>
          <Link to="/" className="auth-back">
            <FiArrowLeft /> Back to home
          </Link>
        </div>

        <div className="auth-form-center">
          <div className="auth-card">
            <span className="auth-eyebrow">
              {isRegister ? 'Get started' : 'Welcome back'}
            </span>
            <h2 className="auth-card-heading">
              {isRegister ? 'Create your account' : 'Sign in to DocFlow'}
            </h2>
            <p className="auth-card-subtitle">
              {isRegister
                ? 'Start creating and sharing documents.'
                : 'Access your documents and shared files.'}
            </p>

            {error && <div className="alert alert--error">{error}</div>}

            <form onSubmit={onSubmit} className="auth-form">
              {isRegister && (
                <div className="auth-input">
                  <FiUser className="auth-input__icon" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={onChange}
                    required
                  />
                </div>
              )}

              <div className="auth-input">
                <FiMail className="auth-input__icon" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="auth-input">
                <FiLock className="auth-input__icon" />
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={onChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-input__toggle"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? 'Please wait...'
                  : isRegister
                  ? 'Create Account'
                  : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button className="auth-switch__link" onClick={toggleMode}>
                {isRegister ? 'Sign in' : 'Sign up'}
              </button>
            </p>

            <div className="auth-demo">
              <span className="auth-demo__label">Demo accounts</span>
              <div className="auth-demo__chips">
                {['alice', 'bob', 'charlie'].map((name) => (
                  <button
                    key={name}
                    className="auth-demo__chip"
                    onClick={() =>
                      setForm({ ...form, email: `${name}@demo.com`, password: 'password123' })
                    }
                  >
                    {name}@demo.com
                  </button>
                ))}
              </div>
              <div className="auth-demo__pw-row">
                <span className="auth-demo__chip auth-demo__chip--pw">password123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-footer">
          © 2026 Made With ❤ By Mohd Ubaid.
        </div>
      </main>
    </div>
  );
}
