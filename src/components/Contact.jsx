import React from 'react';

const Contact = () => {
  return (
    <footer id="contact" className="contact-section fade-up">
      <div className="contact-container">
        
        {/* Left Side: The "Elite" Contact Form */}
        <div className="contact-form-wrapper">
          <span className="badge badge-light">Get in Touch</span>
          <h2 className="contact-title">Start the Conversation</h2>
          <p className="contact-subtitle">
            Secure a consultation to fortify your tax architecture and safeguard your operational margins.
          </p>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Work Email</label>
              <input type="email" id="email" placeholder="john@company.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">How can we help?</label>
              <textarea id="message" rows="4" placeholder="Briefly describe your inquiry..." required></textarea>
            </div>
            <button type="submit" className="btn-primary form-submit">Send Message</button>
          </form>
        </div>

        {/* Right Side: Direct Contact Details */}
        <div className="contact-info-wrapper">
          <div className="info-card">
            <h4>Office Location</h4>
            <p>5811, Modern Housing Complex,<br/>Sec - 13, Chandigarh</p>
          </div>

          <div className="info-card">
            <h4>Direct Contact</h4>
            <p className="highlight-text">+91 99142 20811</p>
            <p>definitesolutions2024@gmail.com</p>
          </div>

          <div className="info-card">
            <h4>Professional Network</h4>
            <p>Connect with our leadership and stay updated on regulatory insights.</p>
            {/* You can link this to Pradeep Kaura's actual LinkedIn later */}
            <a href="#" className="linkedin-link">Connect on LinkedIn →</a>
          </div>
        </div>

      </div>

      {/* The Absolute Bottom Copyright Bar */}
      <div className="copyright-bar">
        <div className="copyright-content">
          <p>&copy; {new Date().getFullYear()} Definites. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;