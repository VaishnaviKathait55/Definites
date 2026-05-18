import React from 'react';







const Contact = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Practice Areas', href: '#practice-areas' },
    { name: 'Expertise',      href: '#expertise'      },
    { name: 'Insights',       href: '#insights'       },
    { name: 'Testimonials',   href: '#testimonials'   },
    { name: 'Team',           href: '#team'           },
    { name: 'Contact',        href: '#contact'        },
  ];

  const services = [
    'Customs Law Advisory',
    'GST Compliance',
    'Tax Litigation',
    'Trade Advisory',
    'Audit Defense',
    'Supply Chain Structuring',
  ];

  return (
    <footer id="contact" className="tw-footer-root">


      <div className="tw-footer-bg" aria-hidden="true">
        <div className="tw-footer-bg-gradient" />
        <div className="tw-footer-bg-radial"   />
        <div className="tw-footer-bg-grid"     />
        <div className="tw-footer-bg-plus"     />
      </div>


      <div className="tw-footer-container">


        <div className="tw-footer-grid">


          <div className="tw-footer-brand">
            <a href="#" className="tw-footer-logo">
              <div className="tw-footer-logo-icon">◆</div>
              <span className="tw-footer-logo-text">Definites</span>
            </a>

            <p className="tw-footer-tagline">"From Statute to Strategy"</p>

            <p className="tw-footer-desc">
              We are a specialized law firm providing end-to-end legal and advisory
              services in indirect taxation.
            </p>
          </div>


          <div className="tw-footer-col">
            <h3 className="tw-footer-col-heading">Quick Links</h3>
            <ul className="tw-footer-list">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="tw-footer-link">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>


          <div className="tw-footer-col">
            <h3 className="tw-footer-col-heading">Services</h3>
            <ul className="tw-footer-list">
              {services.map((service) => (
                <li key={service}>
                  <a href="#practice-areas" className="tw-footer-link">{service}</a>
                </li>
              ))}
            </ul>
          </div>


          <div className="tw-footer-col">
            <h3 className="tw-footer-col-heading">Contact Us</h3>

            <div className="tw-footer-contact-list">

              <div className="tw-footer-contact-row">
                <svg className="tw-footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="tw-footer-contact-text">
                  5811, Modern Housing Complex,<br />Sec - 13, Chandigarh
                </p>
              </div>

              <div className="tw-footer-contact-row">
                <svg className="tw-footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="tw-footer-contact-text">
                  H.No. 541, sector - 12 A,<br />Panchkula
                </p>
              </div>


              <div className="tw-footer-contact-row">
                <svg className="tw-footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <p className="tw-footer-contact-text">info@definitesconsultants.com</p>
              </div>
            </div>


            <div className="tw-footer-portal-card tw-footer-section-hidden" aria-hidden="true">
              <div className="tw-footer-portal-title">Client Portal</div>
              <p className="tw-footer-portal-desc">
                Upload documents, track cases, and review billing.
              </p>
              <button className="tw-footer-portal-btn">
                Access Portal
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </div>


        <div className="tw-footer-bottom">
          <p className="tw-footer-copyright">
            © {currentYear} Definites. All rights reserved.
          </p>
          <div className="tw-footer-bottom-links">
            <a href="#" className="tw-footer-bottom-link">Privacy Policy</a>
            <a href="#" className="tw-footer-bottom-link">Terms of Service</a>
            <a href="#" className="tw-footer-bottom-link">Portal Help</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Contact;
