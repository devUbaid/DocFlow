import { Link } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';
import {
  FiFileText, FiEdit3, FiUsers, FiUpload, FiShield,
  FiZap, FiArrowRight, FiCheck, FiMonitor, FiSmartphone,
  FiLayers, FiStar,
} from 'react-icons/fi';

const FEATURES = [
  {
    icon: <FiEdit3 />,
    title: 'Rich-Text Editing',
    desc: 'Full formatting toolbar — bold, italic, underline, headings, lists, blockquotes, and more. Write naturally in a clean, distraction-free editor.',
    color: 'indigo',
  },
  {
    icon: <FiUsers />,
    title: 'Share & Collaborate',
    desc: 'Share documents with anyone on your team. Assign view or edit permissions and manage access from a single modal.',
    color: 'emerald',
  },
  {
    icon: <FiUpload />,
    title: 'File Import',
    desc: 'Upload .txt or .md files and instantly convert them into rich, editable documents. Your content, your format.',
    color: 'amber',
  },
  {
    icon: <FiShield />,
    title: 'Access Control',
    desc: 'Owners control sharing. Editors can modify content. Viewers can read only. Clear, simple permissions.',
    color: 'rose',
  },
  {
    icon: <FiZap />,
    title: 'Auto-Save',
    desc: 'Never lose work — documents save automatically as you type with real-time status indicators.',
    color: 'cyan',
  },
  {
    icon: <FiLayers />,
    title: 'Organized Dashboard',
    desc: 'See all your documents in one place. Toggle grid or list view, search instantly, and switch between owned and shared docs.',
    color: 'violet',
  },
];

const STEPS = [
  { num: '01', title: 'Create or Import', desc: 'Start a blank document or upload a .txt / .md file to begin.' },
  { num: '02', title: 'Write & Format', desc: 'Use the rich-text toolbar to craft polished, structured content.' },
  { num: '03', title: 'Share & Collaborate', desc: 'Invite teammates by email with view or edit access.' },
];

export default function Landing() {
  const { token } = useAppSelector((s) => s.auth);
  const ctaLink = token ? '/app' : '/login';
  const ctaText = token ? 'Go to Dashboard' : 'Get Started Free';

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav__inner">
          <Link to="/" className="landing-nav__brand">
            <FiFileText />
            <span>DocFlow</span>
          </Link>
          <div className="landing-nav__links">
            <a href="#features" className="landing-nav__link">Features</a>
            <a href="#how-it-works" className="landing-nav__link">How It Works</a>
            <Link to={ctaLink} className="btn btn--primary btn--sm">
              {token ? 'Dashboard' : 'Sign In'}
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <div className="hero__badge">
            <FiStar /> Your AI Strategy. Executed.
          </div>
          <h1 className="hero__title">
            Write, Share, And <span className="hero__highlight">Collaborate</span> —
            <br />
            All In One Place
          </h1>
          <p className="hero__subtitle">
            A lightweight collaborative document editor with rich-text formatting,
            file import, and simple sharing — designed for speed and clarity.
          </p>
          <div className="hero__actions">
            <Link to={ctaLink} className="btn btn--primary btn--lg">
              {ctaText}
              <FiArrowRight />
            </Link>
            <a href="#features" className="btn btn--outline btn--lg">
              See Features
            </a>
          </div>
        </div>

        {/* Editor Preview */}
        <div className="hero__preview">
          <div className="preview-window">
            <div className="preview-window__bar">
              <span className="preview-dot preview-dot--red" />
              <span className="preview-dot preview-dot--yellow" />
              <span className="preview-dot preview-dot--green" />
              <span className="preview-window__title">Project Roadmap Q3 — DocFlow</span>
            </div>
            <div className="preview-window__toolbar">
              <span className="pw-btn pw-btn--active">B</span>
              <span className="pw-btn"><em>I</em></span>
              <span className="pw-btn"><u>U</u></span>
              <span className="pw-sep" />
              <span className="pw-btn">H1</span>
              <span className="pw-btn">H2</span>
              <span className="pw-sep" />
              <span className="pw-btn">• List</span>
              <span className="pw-btn">1. List</span>
            </div>
            <div className="preview-window__body">
              <h2 className="pw-h2">Q3 2026 Roadmap</h2>
              <p className="pw-p">
                This document outlines our <strong>key initiatives</strong> for the upcoming quarter.
              </p>
              <ul className="pw-ul">
                <li>Launch collaborative editor v1</li>
                <li>Implement real-time sync</li>
                <li>User feedback integration</li>
              </ul>
              <p className="pw-p">
                Priority is on <em>shipping quality</em> over feature count.
              </p>
              <div className="pw-cursor" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="features__inner">
          <div className="section-header">
            <span className="section-label">Features</span>
            <h2 className="section-title">Everything you need to write and share</h2>
            <p className="section-desc">
              Focused on the essentials — no bloat, no complexity. Just a clean editor
              with the tools your team actually uses.
            </p>
          </div>
          <div className="features__grid">
            {FEATURES.map((f) => (
              <div key={f.title} className={`feature-card feature-card--${f.color}`}>
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="how-it-works__inner">
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">From blank page to shared doc in seconds</h2>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s.num} className="step">
                <div className="step__num">{s.num}</div>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__desc">{s.desc}</p>
                {i < STEPS.length - 1 && <div className="step__connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive */}
      <section className="responsive-section">
        <div className="responsive-section__inner">
          <div className="responsive-section__text">
            <span className="section-label">Responsive Design</span>
            <h2 className="section-title">Works on every screen</h2>
            <p className="section-desc">
              Fully responsive from desktop to mobile. Edit documents on your laptop,
              review on your tablet, or check shares from your phone.
            </p>
            <div className="responsive-section__checks">
              {['Desktop optimized', 'Tablet friendly', 'Mobile responsive', 'Touch-ready toolbar'].map((c) => (
                <div key={c} className="check-item">
                  <FiCheck /> {c}
                </div>
              ))}
            </div>
          </div>
          <div className="responsive-section__visual">
            <div className="device device--desktop">
              <FiMonitor />
              <span>Desktop</span>
            </div>
            <div className="device device--tablet">
              <FiLayers />
              <span>Tablet</span>
            </div>
            <div className="device device--mobile">
              <FiSmartphone />
              <span>Mobile</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-section__inner">
          <h2 className="cta-section__title">Ready to start writing?</h2>
          <p className="cta-section__desc">
            Jump in with a demo account or create your own — no credit card, no setup.
          </p>
          <div className="cta-section__actions">
            <Link to={ctaLink} className="btn btn--primary btn--lg">
              {ctaText}
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <FiFileText />
            <span>DocFlow</span>
          </div>
          <p className="landing-footer__copy">
            DocFlow — Collaborative Document Editor.
          </p>
        </div>
      </footer>
    </div>
  );
}
