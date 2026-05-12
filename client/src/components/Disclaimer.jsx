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
          <h2 className="disclaimer-title">Disclaimer</h2>
        </div>
        <div className="disclaimer-body">
          <p>
            The Bar Council of India does not permit advertisement or solicitation by advocates
            in any form or manner. By accessing this website,{' '}
            <strong>www.definitesconsultants.com</strong>, you acknowledge and confirm that you are
            seeking information relating to <strong>Definites Consultants</strong> of your own accord
            and that there has been no form of solicitation, advertisement or inducement by
            Definites Consultants or its members.
          </p>
          <p>
            The content of this website is for informational purposes only and should not be
            interpreted as soliciting or advertisement. No material/information provided on this
            website should be construed as legal advice. Definites Consultants shall not be liable
            for consequences of any action taken by relying on the material/information provided
            on this website.
          </p>
          <p>
            The contents of this website are the intellectual property of Definites Consultants.
          </p>
          <p className="disclaimer-acknowledge">
            I accept the above.
          </p>
        </div>
        <div className="disclaimer-actions">
          <button className="disclaimer-btn-decline" onClick={handleDecline}>
            Decline
          </button>
          <button className="disclaimer-btn-accept" onClick={handleAccept}>
            Proceed to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;