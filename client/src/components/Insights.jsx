import React, { useState } from 'react';

const insightsData = [
  {
    num: "01",
    title: "The Prevention Paradigm",
    desc: "Most indirect tax disputes are entirely preventable. We engineer upfront legal architectures that neutralize compliance risks long before a departmental notice is ever issued."
  },
  {
    num: "02",
    title: "Classification & Valuation Risks",
    desc: "Misclassification is the root cause of prolonged litigation. We secure airtight classifications and strategic advance rulings to protect your supply chain margins."
  },
  {
    num: "03",
    title: "The Power of Early Intervention",
    desc: "The trajectory of an audit is decided in its earliest stages. Rapid, strategic, and precise responses to departmental notices dramatically shift the ultimate outcome in your favor."
  },
  {
    num: "04",
    title: "Operational Tax Synergy",
    desc: "Tax strategy cannot exist in a vacuum. True compliance means aligning high-level tax planning seamlessly with your day-to-day operational workflows and logistics."
  },
  {
    num: "05",
    title: "Multi-Jurisdictional Mastery",
    desc: "Pan-India operations trigger complex, cross-border GST scrutiny. We provide coordinated, expert handling to ensure absolute consistency and defense across all state jurisdictions."
  }
];

const Insights = () => {

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {

    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="insights" className="insights-section fade-up">
      <div className="insights-container">

        <div className="section-header text-center">
          <span className="badge">Strategic Intelligence</span>
          <h2>Key Insights</h2>
          <p className="insights-subtitle">
            Actionable perspectives from the intersection of tax law and business strategy.
          </p>
        </div>

        <div className="accordion-wrapper">
          {insightsData.map((item, index) => (
            <div 
              key={index} 
              className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="accordion-header">
                <div className="accordion-title-group">
                  <span className="accordion-num">{item.num}</span>
                  <h3 className="accordion-title">{item.title}</h3>
                </div>

                <div className="accordion-icon">
                  {activeIndex === index ? '−' : '+'}
                </div>
              </div>

              <div className="accordion-body">
                <div className="accordion-content">
                  <p>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Insights;