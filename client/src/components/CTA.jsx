import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section id="cta" className="tw-cta-root">
      <div className="tw-cta-bg" aria-hidden="true">
        <div className="tw-cta-bg-gradient" />
        <div className="tw-cta-bg-radial" />
        <div className="tw-cta-bg-grid" />
        <div className="tw-cta-bg-plus" />
      </div>

      <div className="tw-cta-container">
        <div className="tw-cta-inner">
          <div className="tw-cta-header">
            <span className="tw-cta-badge">
              <span className="tw-cta-badge-dot" />
              Ready to Get Started
            </span>

            <h2 className="tw-cta-heading">
              Ready to Navigate Complex Tax Frameworks?
            </h2>
          </div>

          <div className="tw-cta-body">
            <p className="tw-cta-subtitle">
              Partner with Definites for strategic legal advisory that combines
              regulatory insight with practical business strategy.
            </p>

            <div className="tw-cta-buttons">
              <Link to="/request-access" className="tw-cta-btn-primary">
                Request Platform Access
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/login" className="tw-cta-btn-outline">
                Portal Login
              </Link>
            </div>

            <div className="tw-cta-trust">
              {[
                'Admin Approved Access',
                'Seven-Day Temporary Passwords',
                'Email-Based Credential Delivery',
              ].map((item) => (
                <div key={item} className="tw-cta-trust-item">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414-1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;
