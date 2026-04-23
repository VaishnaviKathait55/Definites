import React from 'react';

const Expertise = () => {
  return (
    <section id="expertise" className="expertise-section fade-up">
      <div className="expertise-grid">
        
        {/* Left Side: The Pillar of Authority (Dark Card) */}
        <div className="expertise-advantage-card">
          <span className="card-badge">The Insider Advantage</span>
          <h2 className="advantage-title">
            We don't just know the law. <br/>
            We know how the authorities apply it.
          </h2>
          <p className="advantage-text">
            Led by a former Indian Revenue Service (IRS) officer, we possess a rare, first-hand understanding of how tax departments evaluate transactions, raise objections, and pursue proceedings. 
          </p>
          <p className="advantage-text">
            This operational insight allows us to anticipate regulatory challenges long before they arise, engineering highly defensible strategies for our clients.
          </p>
        </div>

        {/* Right Side: Core Competencies (Interactive Rows) */}
        <div className="expertise-competencies">
          <div className="section-header">
            <span className="badge">Core Competencies</span>
            <h3>Precision Execution</h3>
          </div>

          <div className="competency-list">
            <div className="competency-item">
              <div className="comp-icon">01</div>
              <div className="comp-content">
                <h4>Complex Interpretation</h4>
                <p>Decoding intricate GST and Customs provisions into actionable, real-world business strategies.</p>
              </div>
            </div>

            <div className="competency-item">
              <div className="comp-icon">02</div>
              <div className="comp-content">
                <h4>Strategic Defense</h4>
                <p>Navigating high-stakes departmental proceedings, audits, and investigations with absolute clarity.</p>
              </div>
            </div>

            <div className="competency-item">
              <div className="comp-icon">03</div>
              <div className="comp-content">
                <h4>Risk Mitigation</h4>
                <p>Structuring high-value transactions to systematically reduce exposure to future tax disputes.</p>
              </div>
            </div>

            <div className="competency-item">
              <div className="comp-icon">04</div>
              <div className="comp-content">
                <h4>Appellate Representation</h4>
                <p>Commanding presence and robust representation across all adjudication and higher appellate forums.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Expertise;