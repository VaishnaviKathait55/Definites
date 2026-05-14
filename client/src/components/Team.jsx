import React from 'react';

import abhishekImg from '../assets/team/Abhishek Kathait.jpeg';
import dhritiImg from '../assets/team/Dhriti Dhall.jpeg';
import divyaImg from '../assets/team/Divya Sharma.jpeg';
import ishitaImg from '../assets/team/Ishita Khanna.jpeg';
import mkImg from '../assets/team/MK Srivastava.jpeg';
import pradeepImg from '../assets/team/Pradeep Kaura.jpeg';
import rishabhImg from '../assets/team/Rishabh Jain.jpeg';
import shubhamImg from '../assets/team/Shubham jain.jpeg';

const founders = [
  {
    image: mkImg,
    imagePosition: 'center 32%',
    position: 'Senior Advisor',
    name: 'M.K. Srivastava',
    title: 'Retd. Chief Commissioner, CBIC, Customs & GST',
    bio: 'Senior Advisor, former IRS officer with 30+ years of expertise in indirect taxation and advisory services.',
  },
  {
    image: pradeepImg,
    imagePosition: 'center 34%',
    position: 'Managing Head',
    name: 'Pradeep Kaura',
    title: 'Ex. IRS, CBIC, Customs & GST',
    bio: "Directing the firm's strategic vision with decades of insider regulatory experience, ensuring every client strategy is bulletproof.",
  },
  {
    image: rishabhImg,
    position: 'Head of Litigation',
    name: 'Rishabh Jain',
    title: 'Advocate',
    bio: "Leads the firm's litigation practice before various High Courts, handling writ petitions, customs valuation challenges, anti-dumping matters, ITC disputes, and SCN defense across the full spectrum of indirect tax controversy.",
  },
];

const advocates = [
  {
    image: abhishekImg,
    name: 'Abhishek Kathait',
    position: 'Associate',
    title: 'Advocate',
    expertise: 'GST Litigation & Advisory',
    bio: 'Advises on GST compliance, multi-state registrations, and statutory interpretation, while representing clients in departmental proceedings, DGGI matters, and appeals through the GST tribunal framework.',
  },
  {
    image: divyaImg,
    imagePosition: 'center 34%',
    name: 'Divya Sharma',
    position: 'Associate',
    title: 'Advocate',
    expertise: 'Customs Disputes and Litigation',
    bio: 'Advises on import-export structuring, customs valuation disputes, and BIS compliance, with hands-on experience in advance ruling applications and zero-duty planning strategies for trading and manufacturing clients.',
  },
  {
    image: shubhamImg,
    name: 'Shubham Jain',
    position: 'Associate',
    title: 'Advocate',
    expertise: 'Customs Disputes and Litigation',
    bio: 'Handles defense in DRI and SIIB investigations, port-level classification disputes, and appellate proceedings before Higher Forum, with particular focus on anti-evasion and audit defense matters.',
  },
  {
    image: dhritiImg,
    name: 'Dhriti Dhall',
    position: 'Associate',
    title: 'Advocate',
    expertise: 'GST Litigation & Advisory',
    bio: 'Structures tax-efficient supply chains and advises on multi-jurisdictional GST issues, transactional models, and complex classification questions for businesses operating across multiple states and sectors.',
  },
  {
    image: ishitaImg,
    imagePosition: 'center 34%',
    name: 'Ishita Khanna',
    position: 'Associate',
    title: 'Advocate',
    expertise: 'GST Litigation & Advisory',
    bio: 'Represents clients across all stages of GST appellate proceedings, from first appeals through Higher Forums, with focus on advance rulings, preventive audits, and strategic dispute mitigation.',
  },
];

const Team = () => {
  return (
    <section id="team" className="team-section fade-up">
      <div className="section-header text-center">
        <span className="badge">Our Roster</span>
        <h2>The Minds Behind the Strategy</h2>
      </div>

      <div className="team-container">
        <div className="founders-grid">
          {founders.map((founder) => (
            <div key={founder.name} className="founder-card">
              <div className="founder-avatar-large">
                <img
                  src={founder.image}
                  alt={founder.name}
                  style={{ objectPosition: founder.imagePosition || 'center' }}
                />
              </div>
              <div className="founder-details">
                <span className="founder-role">{founder.position}</span>
                <h3>{founder.name}</h3>
                <p className="founder-credentials">{founder.title}</p>
                <p className="founder-bio">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="advocates-grid">
          {advocates.map((advocate) => (
            <div key={advocate.name} className="team-card">
              <div className="team-avatar">
                <img
                  src={advocate.image}
                  alt={advocate.name}
                  style={{ objectPosition: advocate.imagePosition || 'center' }}
                />
              </div>
              <div className="team-info">
                <span className="team-position">{advocate.position}</span>
                <h4>{advocate.name}</h4>
                <span className="team-role">{advocate.title}</span>
                <div className="team-focus">
                  <span>{advocate.position}</span>
                  <span>{advocate.expertise}</span>
                </div>
                <p className="team-bio">{advocate.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
