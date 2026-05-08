import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../api/client';
import AuthPageLayout from '../components/AuthPageLayout';

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = query.get('token') || '';
  const [requestForm, setRequestForm] = useState({
    email: query.get('email') || '',
  });
  const [resetForm, setResetForm] = useState({
    email: query.get('email') || '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
  });

  function updateForm(setter) {
    return function handleChange(event) {
      const { name, value } = event.target;
      setter((current) => ({
        ...current,
        [name]: value,
      }));
    };
  }

  async function handleResetRequest(event) {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await requestPasswordReset(requestForm);
      setStatus({
        loading: false,
        error: '',
        success: response.message,
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message,
        success: '',
      });
    }
  }

  async function handlePasswordReset(event) {
    event.preventDefault();

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setStatus({
        loading: false,
        error: 'New password and confirmation do not match.',
        success: '',
      });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await resetPassword({
        email: resetForm.email,
        token,
        newPassword: resetForm.newPassword,
      });
      setStatus({
        loading: false,
        error: '',
        success: response.message,
      });
      navigate('/login', { replace: true });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message,
        success: '',
      });
    }
  }

  return (
    <AuthPageLayout
      eyebrow={token ? 'Create a new password' : 'Password reset'}
      title={token ? 'Set a new permanent password' : 'Request password reset instructions'}
      description={
        token
          ? 'Complete the reset using the secure link delivered to your email inbox.'
          : 'Use this workflow when your temporary password has expired or you cannot sign in.'
      }
      footer={
        <p>
          Remembered your password? <Link to="/login">Return to login</Link>.
        </p>
      }
    >
      {token ? (
        <form className="auth-form" onSubmit={handlePasswordReset}>
          <label>
            Email
            <input name="email" type="email" value={resetForm.email} onChange={updateForm(setResetForm)} required />
          </label>

          <label>
            New password
            <input name="newPassword" type="password" value={resetForm.newPassword} onChange={updateForm(setResetForm)} required />
          </label>

          <label>
            Confirm new password
            <input name="confirmPassword" type="password" value={resetForm.confirmPassword} onChange={updateForm(setResetForm)} required />
          </label>

          {status.error ? <div className="form-alert form-alert-error">{status.error}</div> : null}
          {status.success ? <div className="form-alert form-alert-success">{status.success}</div> : null}

          <button type="submit" className="btn-primary auth-submit-btn" disabled={status.loading}>
            {status.loading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleResetRequest}>
          <label>
            Email
            <input name="email" type="email" value={requestForm.email} onChange={updateForm(setRequestForm)} required />
          </label>

          {status.error ? <div className="form-alert form-alert-error">{status.error}</div> : null}
          {status.success ? <div className="form-alert form-alert-success">{status.success}</div> : null}

          <button type="submit" className="btn-primary auth-submit-btn" disabled={status.loading}>
            {status.loading ? 'Sending instructions...' : 'Email reset link'}
          </button>
        </form>
      )}
    </AuthPageLayout>
  );
}

export default ResetPasswordPage;
