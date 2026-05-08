import { useEffect, useState } from 'react';
import {
  approveAccessRequest,
  getAdminAccessRequests,
  rejectAccessRequest,
  resendCredentials,
} from '../api/client';
import { useAuth } from '../context/AuthContext';

function AdminDashboardPage() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [refreshKey, setRefreshKey] = useState(0);
  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [rejectionNotes, setRejectionNotes] = useState({});
  const [deliveryActionId, setDeliveryActionId] = useState('');
  const [status, setStatus] = useState({
    loading: true,
    error: '',
    message: '',
  });

  useEffect(() => {
    let ignore = false;

    async function loadRequests() {
      setStatus((current) => ({
        ...current,
        loading: true,
        error: '',
      }));

      try {
        const response = await getAdminAccessRequests(activeTab);

        if (ignore) {
          return;
        }

        setRequests(response.requests);
        setSummary(response.summary);
        setStatus({
          loading: false,
          error: '',
          message: '',
        });
      } catch (error) {
        if (ignore) {
          return;
        }

        setStatus({
          loading: false,
          error: error.message,
          message: '',
        });
      }
    }

    loadRequests();

    return () => {
      ignore = true;
    };
  }, [activeTab, refreshKey]);

  async function handleApprove(requestId) {
    setStatus((current) => ({
      ...current,
      message: '',
      error: '',
    }));

    try {
      const response = await approveAccessRequest(requestId);
      setStatus((current) => ({
        ...current,
        message: response.message,
      }));
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setStatus((current) => ({
        ...current,
        error: error.message,
      }));
    }
  }

  async function handleReject(requestId) {
    setStatus((current) => ({
      ...current,
      message: '',
      error: '',
    }));

    try {
      const response = await rejectAccessRequest(requestId, {
        reason: rejectionNotes[requestId] || '',
      });
      setStatus((current) => ({
        ...current,
        message: response.message,
      }));
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setStatus((current) => ({
        ...current,
        error: error.message,
      }));
    }
  }

  async function handleResend(requestId) {
    setDeliveryActionId(requestId);
    setStatus((current) => ({
      ...current,
      message: '',
      error: '',
    }));

    try {
      const response = await resendCredentials(requestId);
      setStatus((current) => ({
        ...current,
        message: response.message,
      }));
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setStatus((current) => ({
        ...current,
        error: error.message,
      }));
    } finally {
      setDeliveryActionId('');
    }
  }

  function renderDeliveryHistory(delivery) {
    if (!delivery || delivery.attempts === 0) {
      return <div className="request-history-note">No credential email has been recorded yet.</div>;
    }

    return (
      <div className="delivery-log">
        <div className="delivery-summary">
          <span className={`request-status request-status-${delivery.status}`}>{delivery.status}</span>
          <span>Attempts: {delivery.attempts}</span>
          <span>Last sent: {delivery.lastSentAt ? new Date(delivery.lastSentAt).toLocaleString() : 'Not sent'}</span>
        </div>

        {delivery.lastError ? <div className="form-alert form-alert-error">Last error: {delivery.lastError}</div> : null}

        <div className="delivery-history-list">
          {(delivery.history || []).map((entry, index) => (
            <article key={`${entry.sentAt || index}-${index}`} className="delivery-history-item">
              <div className="delivery-history-top">
                <strong>{entry.status}</strong>
                <span>{entry.sentAt ? new Date(entry.sentAt).toLocaleString() : 'Unknown time'}</span>
              </div>
              <p>{entry.note || 'No note provided.'}</p>
              <p>{entry.triggeredBy ? `Triggered by ${entry.triggeredBy.email}` : 'Trigger source unavailable.'}</p>
              {entry.messageId ? <p>Message ID: {entry.messageId}</p> : null}
              {entry.error ? <p>Error: {entry.error}</p> : null}
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <span className="status-pill">Administrator</span>
          <h1>Access request review desk</h1>
          <p>Signed in as {auth.user?.email}. Approvals create user records and trigger credential emails automatically.</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="btn-secondary nav-auth-btn" type="button" onClick={auth.logout}>
            Sign out
          </button>
        </div>
      </header>

      <section className="summary-grid">
        <article className="summary-card">
          <span>Pending requests</span>
          <strong>{summary.pending}</strong>
        </article>
        <article className="summary-card">
          <span>Approved</span>
          <strong>{summary.approved}</strong>
        </article>
        <article className="summary-card">
          <span>Rejected</span>
          <strong>{summary.rejected}</strong>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div className="tab-row">
            <button type="button" className={activeTab === 'pending' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('pending')}>
              Pending
            </button>
            <button type="button" className={activeTab === 'all' ? 'tab-button active' : 'tab-button'} onClick={() => setActiveTab('all')}>
              All requests
            </button>
          </div>
        </div>

        {status.error ? <div className="form-alert form-alert-error">{status.error}</div> : null}
        {status.message ? <div className="form-alert form-alert-success">{status.message}</div> : null}

        {status.loading ? (
          <div className="empty-state">Loading access requests...</div>
        ) : requests.length === 0 ? (
          <div className="empty-state">No requests found for this view.</div>
        ) : (
          <div className="request-list">
            {requests.map((request) => (
              <article key={request.id} className="request-card">
                <div className="request-card-top">
                  <div>
                    <h2>{request.name}</h2>
                    <p>{request.email}</p>
                  </div>
                  <span className={`request-status request-status-${request.status}`}>{request.status}</span>
                </div>

                <dl className="request-meta">
                  <div>
                    <dt>Phone</dt>
                    <dd>{request.phone}</dd>
                  </div>
                  <div>
                    <dt>Organization</dt>
                    <dd>{request.organization || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt>Requested</dt>
                    <dd>{new Date(request.createdAt).toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt>Reviewed</dt>
                    <dd>{request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : 'Awaiting review'}</dd>
                  </div>
                </dl>

                {request.status === 'pending' ? (
                  <>
                    <label className="textarea-label">
                      Rejection note
                      <textarea
                        value={rejectionNotes[request.id] || ''}
                        onChange={(event) =>
                          setRejectionNotes((current) => ({
                            ...current,
                            [request.id]: event.target.value,
                          }))
                        }
                        placeholder="Optional reason for rejection"
                      />
                    </label>

                    <div className="request-actions">
                      <button type="button" className="btn-secondary nav-auth-btn" onClick={() => handleReject(request.id)}>
                        Reject
                      </button>
                      <button type="button" className="btn-primary nav-auth-btn" onClick={() => handleApprove(request.id)}>
                        Approve and email credentials
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="request-followup">
                    <div className="request-history-note">
                      {request.status === 'approved'
                        ? `Approved account: ${request.approvedUser?.email || request.email}`
                        : request.rejectionReason || 'Rejected without a note.'}
                    </div>

                    {request.status === 'approved' ? (
                      <>
                        <div className="request-followup-meta">
                          <span>Temp expires: {request.approvedUser?.tempPasswordExpiresAt ? new Date(request.approvedUser.tempPasswordExpiresAt).toLocaleString() : 'Unknown'}</span>
                          <span>Must change: {request.approvedUser?.mustChangePassword ? 'Yes' : 'No'}</span>
                        </div>

                        <div className="request-actions">
                          <button
                            type="button"
                            className="btn-primary nav-auth-btn"
                            onClick={() => handleResend(request.id)}
                            disabled={deliveryActionId === request.id}
                          >
                            {deliveryActionId === request.id ? 'Resending...' : 'Resend credentials'}
                          </button>
                        </div>

                        {renderDeliveryHistory(request.credentialDelivery)}
                      </>
                    ) : null}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboardPage;
