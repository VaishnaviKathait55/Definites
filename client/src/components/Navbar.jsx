import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="nav-brand-link">
          <h2>Definites</h2>
        </Link>
      </div>

      <ul className="nav-links">
        <li><a href="/#about">About</a></li>
        <li><a href="/#services">Services</a></li>
        <li><a href="/#why-us">Why Us</a></li>
        <li><a href="/#expertise">Expertise</a></li>
        <li><a href="/#insights">Insights</a></li>
        <li><a href="/#testimonials">Testimonials</a></li>
        <li><a href="/#team">Team</a></li>
      </ul>

      <div className="nav-cta">
        <Link to="/login" className="btn-secondary nav-auth-btn">
          Portal Login
        </Link>
        <Link to="/request-access" className="btn-primary nav-auth-btn">
          Request Access
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
