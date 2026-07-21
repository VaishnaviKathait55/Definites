import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        {/* <Link to="/" className="nav-brand-link">
          <h2>Definites</h2> <br />
          <span>From Statute to Strategy</span>
        </Link> */}
        <Link to="/" className="nav-brand-link" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h2 style={{ margin: 0, lineHeight: 1 }}>Definites</h2>
          <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 400, letterSpacing: '0.02em' }}>
            <i>From Statute to Strategy</i> 
          </span>
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/expertise">Expertise</Link></li>
        <li><Link to="/testimonials">Latest Updates</Link></li>
        <li><Link to="/team">Team</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="nav-cta">
        <Link to="/login" className="btn-secondary nav-auth-btn nav-auth-btn-hidden">
          Portal Login
        </Link>
        <Link to="/request-access" className="btn-primary nav-auth-btn ">
          Contact Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;


// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <div className="nav-brand">
//         <Link to="/" className="nav-brand-link">
//           <h2>Definites</h2>
//         </Link>
//       </div>

//       <ul className="nav-links">
//         <li><Link to="/about">About</Link></li>
//         <li><Link to="/services">Services</Link></li>
//         <li><Link to="/why-us">Why Us</Link></li>
//         <li><Link to="/expertise">Expertise</Link></li>
//         <li><Link to="/insights">Insights</Link></li>
//         <li><Link to="/testimonials">Testimonials</Link></li>
//         <li><Link to="/team">Team</Link></li>
//         <li><Link to="/contact">Contact</Link></li>
//       </ul>

//       <div className="nav-cta">
//         <Link to="/login" className="btn-secondary nav-auth-btn">
//           Portal Login
//         </Link>
//         <Link to="/request-access" className="btn-primary nav-auth-btn">
//           Request Access
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
