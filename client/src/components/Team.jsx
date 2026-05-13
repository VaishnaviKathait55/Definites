import React from 'react';

const founders = [
  {
    initials: 'MK',
    role: 'Senior Advisor',
    name: 'M.K. Srivastava',
    credentials: 'Retd. Chief Commissioner, CBIC, Customs & GST',
    bio: 'Senior Advisor, former IRS officer with 30+ years of expertise in indirect taxation and advisory services.',
  },
  {
    initials: 'PK',
    role: 'Managing Head',
    name: 'Pradeep Kaura',
    credentials: 'Ex. IRS, CBIC, Customs & GST',
    bio: "Directing the firm's strategic vision with decades of insider regulatory experience, ensuring every client strategy is bulletproof.",
  },
  {
    initials: 'RJ',
    role: 'Advocate',
    name: 'Rishabh Jain',
    credentials: 'Head of Litigation',
    bio: "Leads the firm's litigation practice before various High Courts, handling writ petitions, customs valuation challenges, anti-dumping matters, ITC disputes, and SCN defense across the full spectrum of indirect tax controversy.",
  },
];

const advocates = [
  { name: 'Abhishek Kathait', role: 'Advocate', focus: 'Associate, GST Litigation & Advisory', bio: 'Advises on GST compliance, multi-state registrations, and statutory interpretation, while representing clients in departmental proceedings, DGGI matters, and appeals through the GST tribunal framework.' },
  { name: 'Divya Sharma', role: 'Advocate', focus: 'Associate, Customs Disputes and Litigation', bio: 'Advises on import-export structuring, customs valuation disputes, and BIS compliance, with hands-on experience in advance ruling applications and zero-duty planning strategies for trading and manufacturing clients.' },
  { name: 'Shubham Jain', role: 'Advocate', focus: 'Associate, Customs Disputes and Litigation', bio: 'Handles defense in DRI and SIIB investigations, port-level classification disputes, and appellate proceedings before Higher Forum, with particular focus on anti-evasion and audit defense matters.' },
  { name: 'Dhriti Dhall', role: 'Advocate', focus: 'Associate, GST Litigation & Advisory', bio: 'Structures tax-efficient supply chains and advises on multi-jurisdictional GST issues, transactional models, and complex classification questions for businesses operating across multiple states and sectors' },
  { name: 'Ishita Sharma', role: 'Advocate', focus: 'Associate, GST Litigation & Advisory', bio: 'Represents clients across all stages of GST appellate proceedings, from first appeals through Higher Forums, with focus on advance rulings, preventive audits, and strategic dispute mitigation.' },
];

const getInitials = (name) => name.split(' ').map((n) => n[0]).join('');

const Team = () => {
  return (
    <section id="team" className="team-section fade-up">
      <div className="section-header text-center">
        <span className="badge">Our Roster</span>
        <h2>The Minds Behind the Strategy</h2>
      </div>

      <div className="team-container">

        {/* Row 1 — Three founders in a horizontal grid */}
        <div className="founders-grid">
          {founders.map((founder, index) => (
            <div key={index} className="founder-card">
              <div className="founder-avatar-large">
                <span>{founder.initials}</span>
              </div>
              <div className="founder-details">
                <span className="founder-role">{founder.role}</span>
                <h3>{founder.name}</h3>
                <p className="founder-credentials">{founder.credentials}</p>
                <p className="founder-bio">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rows 2 & 3 — Advocates grid */}
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
                <span className="team-bio">{advocate.bio}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;


// import React from 'react';


// const advocates = [
//   // { name: "Rishabh Jain", role: "Advocate", focus: "Advance Rulings & Tax Planning" },
//   { name: "Abhishek Kathait", role: "Advocate", focus: "GST Litigation & Advisory" },
//   { name: "Divya Sharma", role: "Advocate", focus: "Customs Valuation & Compliance" },
//   { name: "Shubham Jain", role: "Advocate", focus: "Audit Defense & Anti-Evasion" },
//   { name: "Dhriti Dhall", role: "Advocate", focus: "Supply Chain Tax Structuring" },
//   { name: "Ishita Sharma", role: "Advocate", focus: "Appellate Representation" }
// ];


// const getInitials = (name) => {
//   return name.split(' ').map(n => n[0]).join('');
// };

// const Team = () => {
//   return (
//     <section id="team" className="team-section fade-up">
//       <div className="section-header text-center">
//         <span className="badge">Our Roster</span>
//         <h2>The Minds Behind the Strategy</h2>
//       </div>

//       <div className="team-container">


//         <div className="founder-spotlight">
//           <div className="founder-avatar-large">
//             <span>PK</span>
//           </div>
//           <div className="founder-details">
//             <span className="founder-role">Managing Head</span>
//             <h3>Pradeep Kaura</h3>
//             <p className="founder-credentials">Ex. IRS, CBIC, Customs & GST</p>
//             <p className="founder-bio">
//               Directing the firm's strategic vision with decades of insider regulatory experience, ensuring every client strategy is bulletproof.
//             </p>
//           </div>
//         </div>
//         <div className="founder-spotlight">
//           <div className="founder-avatar-large">
//             <span>MK</span>
//           </div>
//           <div className="founder-details">
//             <span className="founder-role">Senior Advisor</span>
//             <h3>M.K. Srivastava</h3>
//             <p className="founder-credentials">Retd.  Chief Commissioner, CBIC, Customs & GST</p>
//             <p className="founder-bio">
//               Senior Advisor, former IRS officer with 30+ years of expertise in indirect taxation and advisory services.
//             </p>
//           </div>
//         </div>


//         <div className="advocates-grid">
//           {advocates.map((advocate, index) => (
//             <div key={index} className="team-card">
//               <div className="team-avatar">
//                 <span>{getInitials(advocate.name)}</span>
//               </div>
//               <div className="team-info">
//                 <h4>{advocate.name}</h4>
//                 <span className="team-role">{advocate.role}</span>
//                 <div className="team-focus">
//                   <span className="focus-dot"></span>
//                   {advocate.focus}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Team;