import Contact from '../components/Contact';
import Navbar from '../components/Navbar';

function ContactPage() {
  return (
    <div className="app-container">
      <Navbar />
      <main><Contact /></main>
    </div>
  );
}
export default ContactPage;