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
            <span>Controlled onboarding</span>
            <strong>Every user request is reviewed by an administrator.</strong>
          </div>
          <div>
            <span>Temporary credentials</span>
            <strong>Approved users receive a seven-day temporary password by email.</strong>
          </div>
          <div>
            <span>First-login security</span>
            <strong>Password change is mandatory before the account can be used normally.</strong>
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
