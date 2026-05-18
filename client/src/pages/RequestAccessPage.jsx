import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitAccessRequest } from '../api/client';
import AuthPageLayout from '../components/AuthPageLayout';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  query: '',
};

const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

function RequestAccessPage() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const [wordCount, setWordCount] = useState(0);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === 'query') {
      const words = countWords(value);
      if (words > 100) return;
      setWordCount(words);
    }

    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await submitAccessRequest(formData);
      setFormData(initialForm);
      setWordCount(0);
      setStatus({ loading: false, error: '', success: response.message });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  }

  return (
    <AuthPageLayout
      eyebrow="Contact Us"
      title="Get in touch with us"
      description="Fill in the form below and our team will get back to you. Each request is reviewed by an administrator."
      // footer={
      //   <p>
      //     Already have credentials? <Link to="/login">Go to portal login</Link>.
      //   </p>
      // }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Aarav Mehta" required />
        </label>

        <label>
          Email
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="aarav@lawfirm.com" required />
        </label>

        <label>
          Phone
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
        </label>

        <label>
          Organization
          <input name="organization" value={formData.organization} onChange={handleChange} placeholder="Optional" />
        </label>

        <label>
          Query
          <textarea
            name="query"
            value={formData.query}
            onChange={handleChange}
            placeholder="Briefly describe your query or reason for reaching out..."
            rows={4}
            required
          />
          <span className={`word-count ${wordCount >= 100 ? 'word-count-limit' : ''}`}>
            {wordCount} / 100 words
          </span>
        </label>

        {status.error   ? <div className="form-alert form-alert-error">{status.error}</div>   : null}
        {status.success ? <div className="form-alert form-alert-success">{status.success}</div> : null}

        <button type="submit" className="btn-primary auth-submit-btn" disabled={status.loading}>
          {status.loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </AuthPageLayout>
  );
}

export default RequestAccessPage;



