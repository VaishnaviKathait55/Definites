import React from 'react';


const advocates = [
  { name: "Rishabh Jain", role: "Advocate", focus: "Advance Rulings & Tax Planning" },
  { name: "Abhishek Kathait", role: "Advocate", focus: "GST Litigation & Advisory" },
  { name: "Divya Sharma", role: "Advocate", focus: "Customs Valuation & Compliance" },
  { name: "Shubham Jain", role: "Advocate", focus: "Audit Defense & Anti-Evasion" },
  { name: "Dhriti Dhall", role: "Advocate", focus: "Supply Chain Tax Structuring" },
  { name: "Ishita Sharma", role: "Advocate", focus: "Appellate Representation" }
];


const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('');
};

const Team = () => {
  return (
    <section id="team" className="team-section fade-up">
      <div className="section-header text-center">
        <span className="badge">Our Roster</span>
        <h2>The Minds Behind the Strategy</h2>
      </div>

      <div className="team-container">


        <div className="founder-spotlight">
          <div className="founder-avatar-large">
            <span>PK</span>
          </div>
          <div className="founder-details">
            <span className="founder-role">Managing Head</span>
            <h3>Pradeep Kaura</h3>
            <p className="founder-credentials">Ex. IRS, CBIC, Customs & GST</p>
            <p className="founder-bio">
              Directing the firm's strategic vision with decades of insider regulatory experience, ensuring every client strategy is bulletproof.
            </p>
          </div>
        </div>
        <div className="founder-spotlight">
          <div className="founder-avatar-large">
            <span>MK</span>
          </div>
          <div className="founder-details">
            <span className="founder-role">Senior Advisor</span>
            <h3>M.K. Srivastava</h3>
            <p className="founder-credentials">Retd.  Chief Commissioner, CBIC, Customs & GST</p>
            <p className="founder-bio">
              Senior Advisor, former IRS officer with 30+ years of expertise in indirect taxation and advisory services.
            </p>
          </div>
        </div>


        <div className="advocates-grid">
          {advocates.map((advocate, index) => (
            <div key={index} className="team-card">
              <div className="team-avatar">
                <span>{getInitials(advocate.name)}</span>
              </div>
              <div className="team-info">
                <h4>{advocate.name}</h4>
                <span className="team-role">{advocate.role}</span>
                <div className="team-focus">
                  <span className="focus-dot"></span>
                  {advocate.focus}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;