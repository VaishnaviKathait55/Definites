import React from 'react';

const About = () => {
  return (
    <section id="about" className="about-section fade-up">
      <div className="about-grid">
        
        {/* Left Side: Heading & Trust Badge */}
        <div className="about-visual-side">
          <div>
            <span className="badge">Who We Are</span>
            <h2>About the Firm</h2>
          </div>
          
          {/* New Creative Element: FinTech Style Trust Badge */}
          <div className="founder-badge">
            <div className="founder-info">
              <span className="founder-title">Led by Pradeep Kaura</span>
              <span className="founder-cred">Ex. IRS, CBIC, Customs & GST</span>
            </div>
            <div className="badge-icon">
              {/* Simple pure CSS icon to act as a seal of trust */}
              <div className="seal"></div>
            </div>
          </div>
        </div>
        
        {/* Right Side: Content & Value Grid */}
        <div className="about-content">
          <p className="lead-text">
            We are a specialized law firm providing end-to-end legal and advisory services in indirect taxation, with a focus on <span className="text-highlight">GST and Customs law</span>.
          </p>
          <p>
            Our practice combines deep regulatory expertise with practical business strategy, enabling clients to navigate complex tax frameworks efficiently. We serve a wide spectrum of clients—from emerging enterprises to large corporations—across diverse industries, with seamless Pan-India service delivery.
          </p>

          {/* New Creative Element: Quick Value Grid to fill the blank space */}
          <div className="about-value-grid">
            <div className="value-card">
              <h3>End-to-End</h3>
              <p>From initial strategy to final litigation resolution.</p>
            </div>
            <div className="value-card">
              <h3>Pan-India</h3>
              <p>Seamless service delivery across all jurisdictions.</p>
            </div>
            <div className="value-card">
              <h3>Proactive</h3>
              <p>Focus on prevention and early audit defense.</p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default About;