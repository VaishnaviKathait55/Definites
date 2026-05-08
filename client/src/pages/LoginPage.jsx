import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get('next');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
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
    setStatus({ loading: true, error: '' });

    try {
      const response = await auth.login(formData);

      if (response.mustChangePassword) {
        navigate('/change-password', { replace: true });
        return;
      }

      if (response.user.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      navigate(nextPath || '/account', { replace: true });
    } catch (error) {
      const passwordExpiredMessage =
        error.code === 'PASSWORD_EXPIRED'
          ? `${error.message} Use the reset workflow below to set a new password.`
          : error.message;

      setStatus({
        loading: false,
        error: passwordExpiredMessage,
      });
    }
  }

  return (
    <AuthPageLayout
      eyebrow="Portal login"
      title="Access the practice management workspace"
      description="Approved users and administrators sign in here. Temporary passwords are blocked after seven days if not changed."
      footer={
        <p>
          Need approval first? <Link to="/request-access">Submit an access request</Link>.
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@firm.com" required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
        </label>

        {status.error ? <div className="form-alert form-alert-error">{status.error}</div> : null}

        <button type="submit" className="btn-primary auth-submit-btn" disabled={status.loading}>
          {status.loading ? 'Signing in...' : 'Sign in'}
        </button>

        <Link className="inline-link" to={`/reset-password${formData.email ? `?email=${encodeURIComponent(formData.email)}` : ''}`}>
          Forgot password or temporary password expired?
        </Link>
      </form>
    </AuthPageLayout>
  );
}

export default LoginPage;
