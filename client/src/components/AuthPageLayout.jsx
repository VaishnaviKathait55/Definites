import { Link } from 'react-router-dom';

function AuthPageLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="auth-page-shell">
      <aside className="auth-side-panel">
        <Link to="/" className="auth-brand">
          Definites
        </Link>
        <div className="status-pill">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="auth-side-meta">
          <div>
            <span>EXPERT GUIDANCE</span>
            <strong>Every query is handled by seasoned indirect tax professionals with deep statutory knowledge.</strong>
          </div>
          <div>
            <span>CONFIDENTIAL & SECURE</span>
            <strong>Your information and business details are treated with complete discretion and confidentiality.</strong>
          </div>
          <div>
            <span>PROMPT RESPONSE</span>
            <strong>Our team reviews every inquiry and responds within one business day.</strong>
          </div>
        </div>
      </aside>

      <section className="auth-card">
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </section>
    </div>
  );
}

export default AuthPageLayout;
