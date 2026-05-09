import { useState } from 'react';

const Disclaimer = () => {
  const [visible, setVisible] = useState(
    () => !sessionStorage.getItem('disclaimer-accepted')
  );

  const handleAccept = () => {
    sessionStorage.setItem('disclaimer-accepted', 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    window.location.href = 'about:blank';
  };

  if (!visible) return null;

  return (
    <div className="disclaimer-overlay">
      <div className="disclaimer-box">
        <div className="disclaimer-header">
          <div className="disclaimer-icon">⚖️</div>
          <h2 className="disclaimer-title">Legal Disclaimer</h2>
        </div>
        <div className="disclaimer-body">
          <p>
            The information provided on this website is for general informational
            purposes only and does not constitute legal advice. Accessing or using
            this website does not create an attorney-client relationship between
            you and <strong>Definites Legal</strong>.
          </p>
          <p>
            The content on this site is provided "as is" without any representations
            or warranties. Definites Legal makes no representations or warranties
            in relation to the legal information on this website.
          </p>
          <p>
            You should not rely on the information on this website as an alternative
            to legal advice from a qualified professional. If you have specific
            questions, please consult a qualified legal practitioner.
          </p>
        </div>
        <div className="disclaimer-actions">
          <button className="disclaimer-btn-decline" onClick={handleDecline}>
            Decline
          </button>
          <button className="disclaimer-btn-accept" onClick={handleAccept}>
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;