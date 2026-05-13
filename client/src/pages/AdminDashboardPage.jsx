import { useEffect, useState } from 'react';
import {
  approveAccessRequest,
  getAdminAccessRequests,
  rejectAccessRequest,
  resendCredentials,
} from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../admin.css';

export default function AdminDashboardPage() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectionNotes, setRejectionNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await getAdminAccessRequests(activeTab);
      setRequests(response.requests);
      setSummary(response.summary);
      if (response.requests.length > 0 && !selectedRequestId) {
        setSelectedRequestId(response.requests[0].id);
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  function handleSelectRequest(id) {
    setSelectedRequestId(id);
    setShowDetailOnMobile(true);
  }

  async function handleApprove(id) {
    setActionLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      await approveAccessRequest(id);
      setFeedback({ type: 'success', message: 'Request approved and credentials sent.' });
      fetchData();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(id) {
    setActionLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      await rejectAccessRequest(id, { reason: rejectionNotes[id] || '' });
      setFeedback({ type: 'success', message: 'Request rejected.' });
      fetchData();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResend(id) {
    setActionLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      await resendCredentials(id);
      setFeedback({ type: 'success', message: 'Credentials resent successfully.' });
      fetchData();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setActionLoading(false);
    }
  }

  function renderDeliveryHistory(delivery) {
    if (!delivery || delivery.attempts === 0) {
      return <div style={{ fontSize: '12px', color: 'var(--admin-text-3)', marginTop: '12px' }}>No credential email has been recorded yet.</div>;
    }

    return (
      <div className="delivery-log" style={{ marginTop: '24px' }}>
        <div className="delivery-summary">
          <span className={`request-status request-status-${delivery.status}`}>{delivery.status}</span>
          <span>Attempts: {delivery.attempts}</span>
          <span>Last sent: {delivery.lastSentAt ? new Date(delivery.lastSentAt).toLocaleString() : 'Not sent'}</span>
        </div>
        <div className="delivery-history-list">
          {(delivery.history || []).slice(0, 3).map((entry, index) => (
            <div key={index} className="delivery-history-item">
              <div className="delivery-history-top">
                <strong>{entry.status.toUpperCase()}</strong>
                <span>{entry.sentAt ? new Date(entry.sentAt).toLocaleString() : 'Unknown time'}</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--admin-text-3)', marginTop: '4px' }}>
                {entry.triggeredBy ? `By ${entry.triggeredBy.email}` : 'System'}
                {entry.error ? ` · Error: ${entry.error}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-shell ${isSidebarOpen ? 'sidebar-open' : ''} ${showDetailOnMobile ? 'show-detail' : ''}`}>
      <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      <aside className={`admin-sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="admin-logo">
          <div className="admin-logo-mark"><i className="ti ti-lock"></i></div>
          <div>
            <div className="admin-logo-name" style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Definites</div>
            <div className="admin-logo-role" style={{ fontSize: '10px', color: 'var(--admin-text-3)', textTransform: 'uppercase' }}>Control Center</div>
          </div>
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Overview</div>
          <button className="admin-nav-item active"><i className="ti ti-layout-dashboard"></i><span>Dashboard</span></button>
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Management</div>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-user-plus"></i><span>Access Requests</span> {summary.pending > 0 && <span className="admin-nav-badge">{summary.pending}</span>}</button>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-briefcase"></i><span>Cases</span></button>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-users"></i><span>Advocates team</span></button>
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">System</div>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-bell"></i><span>Notifications</span></button>
          <button className="admin-nav-item" onClick={() => setIsSidebarOpen(false)}><i className="ti ti-settings"></i><span>Settings</span></button>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-card" onClick={auth.logout}>
            <div className="admin-avatar" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>AD</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-1)' }}>Admin</div>
              <div style={{ fontSize: '11px', color: 'var(--admin-text-3)' }}>Super User</div>
            </div>
            <i className="ti ti-logout" style={{ fontSize: '14px', color: 'var(--admin-text-3)' }}></i>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" onClick={() => setIsSidebarOpen(true)}>
            <i className="ti ti-menu-2"></i>
          </button>
          <div className="admin-page-title">
            Access Request Review Desk
            <p className="pc-only" style={{ fontSize: '13px', color: 'var(--admin-text-3)', fontWeight: 400, marginTop: '2px', fontStyle: 'normal' }}>
              Review and manage access requests efficiently
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="admin-btn-icon pc-only"><i className="ti ti-search"></i></button>
            <button className="admin-btn-icon pc-only"><i className="ti ti-bell"></i></button>
            <button className="admin-btn-primary" style={{ background: '#e5c364', color: '#000', borderRadius: '8px', padding: '8px 16px', border: 'none', fontWeight: 600 }} onClick={auth.logout}>Sign out</button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-stats-strip">
            <div className="admin-stat-item">
              <div className="admin-stat-icon-box amber"><i className="ti ti-clock"></i></div>
              <div className="admin-stat-info">
                <dt>Pending Requests</dt>
                <dd>{summary.pending}</dd>
                <div style={{ fontSize: '11px', color: 'var(--admin-amber)', fontWeight: 600, marginTop: '4px' }}>Needs Review</div>
              </div>
            </div>
            <div className="admin-stat-item">
              <div className="admin-stat-icon-box green"><i className="ti ti-user-check"></i></div>
              <div className="admin-stat-info">
                <dt>Approved</dt>
                <dd>{summary.approved}</dd>
                <div style={{ fontSize: '11px', color: 'var(--admin-green)', fontWeight: 600, marginTop: '4px' }}>Total Approved</div>
              </div>
            </div>
            <div className="admin-stat-item">
              <div className="admin-stat-icon-box red"><i className="ti ti-user-x"></i></div>
              <div className="admin-stat-info">
                <dt>Rejected</dt>
                <dd>{summary.rejected}</dd>
                <div style={{ fontSize: '11px', color: 'var(--admin-red)', fontWeight: 600, marginTop: '4px' }}>Total Rejected</div>
              </div>
            </div>
          </div>

          <div className="admin-master-detail">
            <div className="admin-master-list">
              <div className="admin-list-header">
                <div className="list-tabs">
                  <button className={`list-tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending</button>
                  <button className={`list-tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Requests</button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="admin-btn-icon" style={{ width: '32px', height: '32px' }}><i className="ti ti-search" style={{ fontSize: '14px' }}></i></button>
                  <button className="admin-btn-icon" style={{ width: '32px', height: '32px' }}><i className="ti ti-filter" style={{ fontSize: '14px' }}></i></button>
                </div>
              </div>

              <div className="admin-list-scroll">
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-3)' }}>Loading...</div>
                ) : requests.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--admin-text-3)' }}>No requests found</div>
                ) : (
                  requests.map((req) => (
                    <div
                      key={req.id}
                      className={`compact-card ${selectedRequestId === req.id ? 'active' : ''}`}
                      onClick={() => handleSelectRequest(req.id)}
                    >
                      <div className="compact-avatar">
                        {req.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="compact-info">
                        <div className="compact-name">{req.name}</div>
                        <div className="compact-sub">{req.email}</div>
                        <div className={`compact-status request-status-${req.status}`}>● {req.status}</div>
                      </div>
                      <i className="ti ti-chevron-right" style={{ color: 'var(--admin-text-3)', fontSize: '12px' }}></i>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="admin-detail-pane">
              {selectedRequest ? (
                <div className="detail-view">
                  <button className="mobile-back-btn" onClick={() => setShowDetailOnMobile(false)}>
                    <i className="ti ti-arrow-left"></i> Back to list
                  </button>

                  {feedback.message && (
                    <div className={`admin-alert admin-alert-${feedback.type}`}>
                      <i className={feedback.type === 'success' ? 'ti ti-circle-check' : 'ti ti-alert-circle'}></i>
                      {feedback.message}
                    </div>
                  )}

                  <div className="detail-header">
                    <div className="detail-avatar-large">
                      {selectedRequest.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="detail-title">
                      <h2>{selectedRequest.name}</h2>
                      <p>{selectedRequest.email}</p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <div className={`request-status request-status-${selectedRequest.status}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
                        {selectedRequest.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <dt>Phone Number</dt>
                      <dd>{selectedRequest.phone}</dd>
                    </div>
                    <div className="detail-item">
                      <dt>Organization</dt>
                      <dd>{selectedRequest.organization || 'Not provided'}</dd>
                    </div>
                    <div className="detail-item">
                      <dt>Requested On</dt>
                      <dd>{new Date(selectedRequest.createdAt).toLocaleDateString()}</dd>
                    </div>
                    <div className="detail-item">
                      <dt>Reviewed On</dt>
                      <dd>{selectedRequest.reviewedAt ? new Date(selectedRequest.reviewedAt).toLocaleDateString() : 'Awaiting'}</dd>
                    </div>
                  </div>

                  {selectedRequest.query && (
                    <div className="detail-query">
                      <dt>User Message</dt>
                      <dd>{selectedRequest.query}</dd>
                    </div>
                  )}

                  {selectedRequest.status === 'pending' ? (
                    <div style={{ marginTop: '40px' }}>
                      <dt style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-3)', textTransform: 'uppercase', marginBottom: '12px' }}>Rejection Note (Optional)</dt>
                      <textarea
                        className="admin-textarea"
                        placeholder="Add a reason for rejection..."
                        value={rejectionNotes[selectedRequest.id] || ''}
                        onChange={(e) => setRejectionNotes({ ...rejectionNotes, [selectedRequest.id]: e.target.value })}
                      />
                      <div className="admin-actions">
                        <button className="admin-btn-outline" style={{ flex: 1 }} onClick={() => handleReject(selectedRequest.id)} disabled={actionLoading}>
                          Reject Request
                        </button>
                        <button className="admin-btn-primary" style={{ flex: 1, background: '#184e44', color: '#fff' }} onClick={() => handleApprove(selectedRequest.id)} disabled={actionLoading}>
                          Approve & Grant Access
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '40px', borderTop: '1px solid var(--admin-border)', paddingTop: '32px' }}>
                      {selectedRequest.status === 'approved' ? (
                        <>
                          <div className="request-status-info" style={{ background: 'var(--admin-surface-2)', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="ti ti-circle-check-filled" style={{ color: 'var(--admin-green)', fontSize: '20px' }}></i>
                            <div>
                              <div style={{ fontWeight: 600 }}>Approved Account</div>
                              <div style={{ fontSize: '13px', color: 'var(--admin-text-3)' }}>{selectedRequest.approvedUser?.email || selectedRequest.email}</div>
                            </div>
                            <button
                              className="admin-btn-primary"
                              style={{ marginLeft: 'auto', background: 'var(--admin-surface-3)', color: '#fff', border: '1px solid var(--admin-border-md)', padding: '8px 16px', fontSize: '12px' }}
                              onClick={() => handleResend(selectedRequest.id)}
                              disabled={actionLoading}
                            >
                              Resend Credentials
                            </button>
                          </div>
                          {renderDeliveryHistory(selectedRequest.credentialDelivery)}
                        </>
                      ) : (
                        <div style={{ background: 'var(--admin-red-dim)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                          <div style={{ fontWeight: 600, color: 'var(--admin-red)' }}>Rejection Reason</div>
                          <div style={{ fontSize: '14px', color: 'var(--admin-text-2)', marginTop: '4px' }}>{selectedRequest.rejectionReason || 'No reason provided.'}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-3)' }}>
                  Select a request to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
