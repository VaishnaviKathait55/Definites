import React, { useState, useEffect } from 'react';

const testimonialsData = [
  {
    quote: "Definites completely restructured our cross-border supply chain. Their foresight into customs valuation saved us from a multi-million rupee classification dispute. Absolute strategic mastery.",
    author: "Director of Operations",
    company: "Global Logistics Corporation"
  },
  {
    quote: "When facing a complex DGGI investigation, you need more than just a lawyer—you need someone who has sat on the other side of the table. Their IRS background changed the entire trajectory of our defense.",
    author: "Chief Financial Officer",
    company: "Multinational Tech Conglomerate"
  },
  {
    quote: "We engaged Definites for a pan-India GST structuring overhaul. The level of precision, rapid responsiveness, and deep regulatory insight they brought was unparalleled. A truly elite practice.",
    author: "VP of Finance",
    company: "National Manufacturing Enterprise"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play the carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, 6000);
    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  return (
    <section id="testimonials" className="testimonials-section fade-up">
      <div className="testimonials-container">
        
        <div className="section-header text-center light-text">
          <span className="badge badge-light">Client Success</span>
          <h2>The Verdict</h2>
        </div>

        <div className="carousel-stage">
          {/* Giant Decorative Quote Mark */}
          <div className="quote-mark">“</div>

          <div className="quote-content-wrapper">
            {testimonialsData.map((testimonial, index) => (
              <div 
                key={index} 
                className={`testimonial-slide ${index === currentIndex ? 'active' : ''}`}
              >
                <p className="testimonial-text">{testimonial.quote}</p>
                <div className="testimonial-author-block">
                  <span className="author-name">{testimonial.author}</span>
                  <span className="author-company">{testimonial.company}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Navigation Dots */}
          <div className="carousel-indicators">
            {testimonialsData.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Testimonials;