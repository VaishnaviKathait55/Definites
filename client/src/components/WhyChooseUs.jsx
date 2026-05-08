import React, { useEffect, useRef } from 'react';

const reasons = [
  {
    num: "01",
    title: "Technical Depth",
    desc: "Insight directly from former IRS officers, giving us a rare, strategic view into the adjudicator's mindset."
  },
  {
    num: "02",
    title: "Litigation Power",
    desc: "Aggressive, experienced courtroom representation across all departmental and appellate forums."
  },
  {
    num: "03",
    title: "End-to-End Lifecycle",
    desc: "We don't just advise; we execute. Seamless management from initial tax planning to final dispute resolution."
  },
  {
    num: "04",
    title: "Pan-India Reach",
    desc: "Consistent, high-caliber legal service delivery across all state and central jurisdictions."
  },
  {
    num: "05",
    title: "Client-Centric",
    desc: "Bespoke legal architectures and compliance models tailored exactly to your operational reality."
  },
  {
    num: "06",
    title: "Proactive Defense",
    desc: "We focus on preventative structuring to neutralize compliance threats long before a notice is ever issued."
  }
];

const WhyChooseUs = () => {
  const cardsRef = useRef([]);


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-us" className="wcu-section">
      <div className="section-header text-center fade-up">
        <span className="badge">The Definites Advantage</span>
        <h2>Why Choose Us</h2>
      </div>

      <div className="wcu-grid">
        {reasons.map((reason, index) => (
          <div 
            key={index} 
            className="wcu-card fade-up-stagger"
            ref={(el) => (cardsRef.current[index] = el)}
            style={{ transitionDelay: `${index * 0.1}s` }} 
          >
            <div className="wcu-number">{reason.num}</div>
            <div className="wcu-content">
              <h3>{reason.title}</h3>
              <p>{reason.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;