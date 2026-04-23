import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* 1. Logo */}
      <div className="nav-brand">
        <h2>Definites</h2>
      </div>
      
      {/* Middle Sections */}
      <ul className="nav-links">
        {/* 2. About the firm */}
        <li><a href="#about">About</a></li>
        {/* 3. Services/practice areas */}
        <li><a href="#services">Services</a></li>
        {/* 4. Why choose us */}
        <li><a href="#why-us">Why Us</a></li>
        {/* 5. Our expertise */}
        <li><a href="#expertise">Expertise</a></li>
        {/* 6. Key insights */}
        <li><a href="#insights">Insights</a></li>
        {/* 7. Client testimonials */}
        <li><a href="#testimonials">Testimonials</a></li>
        {/* 8. Team */}
        <li><a href="#team">Team</a></li>
      </ul>

      {/* 9. Contact Information (As a premium CTA button) */}
      <div className="nav-cta">
        <a href="#contact" className="btn-primary">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;