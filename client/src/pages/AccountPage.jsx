import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AccountPage() {
  const auth = useAuth();

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <span className="status-pill">Secure account</span>
          <h1>Welcome back, {auth.user?.name}</h1>
          <p>Your account is active and ready for the practice management portal.</p>
        </div>
        <div className="dashboard-header-actions">
          <Link to="/change-password" className="btn-secondary nav-auth-btn">
            Change password
          </Link>
          <button className="btn-primary nav-auth-btn" type="button" onClick={auth.logout}>
            Sign out
          </button>
        </div>
      </header>

      <section className="dashboard-panel account-panel">
        <div className="account-grid">
          <article className="account-card">
            <span>Name</span>
            <strong>{auth.user?.name}</strong>
          </article>
          <article className="account-card">
            <span>Email</span>
            <strong>{auth.user?.email}</strong>
          </article>
          <article className="account-card">
            <span>Phone</span>
            <strong>{auth.user?.phone}</strong>
          </article>
          <article className="account-card">
            <span>Organization</span>
            <strong>{auth.user?.organization || 'Not provided'}</strong>
          </article>
        </div>
      </section>
    </div>
  );
}

export default AccountPage;
