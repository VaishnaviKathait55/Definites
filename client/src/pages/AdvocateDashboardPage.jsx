import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../admin.css';

export default function AdvocateDashboardPage() {
  const auth = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`admin-shell ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Overlay for mobile */}
      <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="admin-logo">
          <div className="admin-logo-mark"><i className="ti ti-scale"></i></div>
          <div>
            <div className="admin-logo-name">Definites</div>
            <div className="admin-logo-role">Advocate Portal</div>
          </div>
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Overview</div>
          <button className="admin-nav-item active"><i className="ti ti-layout-dashboard"></i><span>Dashboard</span></button>
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Management</div>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-briefcase"></i><span>My Cases</span></button>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-calendar"></i><span>Hearings</span></button>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-files"></i><span>Documents</span></button>
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">System</div>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-bell"></i><span>Notifications</span></button>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-settings"></i><span>Settings</span></button>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-card" onClick={auth.logout}>
            <div className="admin-avatar">{auth.user?.email?.slice(0, 2).toUpperCase() || 'AD'}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--admin-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {auth.user?.email.split('@')[0]}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--admin-text-3)' }}>Advocate</div>
            </div>
            <i className="ti ti-logout" style={{ fontSize: '15px', color: 'var(--admin-text-3)' }}></i>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" onClick={() => setIsSidebarOpen(true)}>
            <i className="ti ti-menu-2"></i>
          </button>
          <div className="admin-page-title">Advocate Dashboard</div>
          <div className="admin-topbar-actions">
            <button className="admin-btn-icon"><i className="ti ti-search"></i></button>
            <button className="admin-btn-icon"><i className="ti ti-bell"></i></button>
            <button className="admin-btn-primary pc-only" onClick={auth.logout}>Sign out</button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-stats-grid">
            <div className="admin-stat-card amber">
              <div className="admin-stat-label">Active Cases</div>
              <div className="admin-stat-value">0</div>
              <div className="admin-stat-icon"><i className="ti ti-briefcase"></i></div>
            </div>
            <div className="admin-stat-card green">
              <div className="admin-stat-label">Total Completed</div>
              <div className="admin-stat-value">0</div>
              <div className="admin-stat-icon"><i className="ti ti-circle-check"></i></div>
            </div>
            <div className="admin-stat-card gold">
              <div className="admin-stat-label">Pending Hearings</div>
              <div className="admin-stat-value">0</div>
              <div className="admin-stat-icon"><i className="ti ti-calendar"></i></div>
            </div>
          </div>

          <section className="admin-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--admin-border-md)' }}>
            <div style={{ textAlign: 'center', color: 'var(--admin-text-3)' }}>
              <i className="ti ti-database-off" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}></i>
              <h2 style={{ color: 'var(--admin-text-1)', fontSize: '20px', marginBottom: '10px' }}>No cases assigned</h2>
              <p style={{ fontSize: '15px', maxWidth: '300px', margin: '0 auto' }}>Your assigned cases and upcoming hearings will appear here once the administrator assigns them to you.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}