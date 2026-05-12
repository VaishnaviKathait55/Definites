import React from 'react';


const servicesData = [
  {
    type: "Customs Law",
    category: "Strategic Trade Advisory",
    items: [
      "Import/export structuring and precise valuation",
      "Strategic advance ruling applications",
      "Comprehensive compliance and BIS advisory",
      "Zero-duty planning and deferment strategies"
    ]
  },
  {
    type: "Customs Law",
    category: "Operational Support",
    items: [
      "End-to-end import and export facilitation",
      "Supply chain and logistics optimization",
      "Real-time regulatory compliance monitoring",
      "Expansion structuring for trading units"
    ]
  },
  {
    type: "Customs Law",
    category: "Litigation & Dispute",
    items: [
      "Resolution of port-level classification disputes",
      "Defense in DRI and SIIB investigations",
      "Appellate representation before CESTAT, Higher Courts",
      "Strategic defense at all departmental levels"
    ]
  },
  {
    type: "GST Law",
    category: "Strategic Compliance",
    items: [
      "Comprehensive statutory interpretation",
      "Complex classification and taxability analysis",
      "Multi-state registration and ongoing compliance",
      "Execution of preventive GST health audits"
    ]
  },
  {
    type: "GST Law",
    category: "Dispute Resolution",
    items: [
      "Proactive departmental notice handling",
      "Robust defense during structural tax audits",
      "Representation in DGGI anti-evasion matters",
      "Strategic appeals up to GSTAT and higher courts"
    ]
  },
  {
    type: "GST Law",
    category: "Specialized Services",
    items: [
      "Procurement of strategic advance rulings",
      "Tax-efficient supply chain structuring",
      "Resolution of multi-jurisdictional tax issues",
      "Transactional advisory for complex models"
    ]
  }
];

const Services = () => {
  return (
    <section id="services" className="services-section fade-up">
      <div className="section-header text-center">
        <span className="badge">Our Expertise</span>
        <h2>Services & Practice Areas</h2>
      </div>

      <div className="services-grid-6">
        {servicesData.map((card, index) => (
          <div key={index} className="dark-card">
            <span className="card-badge">{card.type}</span>
            <h4 className="card-title">{card.category}</h4>
            <ul className="dark-list">
              {card.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;