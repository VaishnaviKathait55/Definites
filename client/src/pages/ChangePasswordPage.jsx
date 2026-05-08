import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
import { useAuth } from '../context/AuthContext';

function ChangePasswordPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({
        loading: false,
        error: 'New password and confirmation do not match.',
        success: '',
      });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await auth.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setStatus({
        loading: false,
        error: '',
        success: response.message,
      });

      navigate(auth.user?.role === 'admin' ? '/admin' : '/account', { replace: true });
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
      eyebrow="Mandatory password change"
      title="Replace your temporary password"
      description="Your first login is restricted until you set a permanent password. Choose a strong password with at least 10 characters."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Current password
          <input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} required />
        </label>

        <label>
          New password
          <input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} required />
        </label>

        <label>
          Confirm new password
          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
        </label>

        {status.error ? <div className="form-alert form-alert-error">{status.error}</div> : null}
        {status.success ? <div className="form-alert form-alert-success">{status.success}</div> : null}

        <button type="submit" className="btn-primary auth-submit-btn" disabled={status.loading}>
          {status.loading ? 'Updating password...' : 'Change password'}
        </button>
      </form>
    </AuthPageLayout>
  );
}

export default ChangePasswordPage;
