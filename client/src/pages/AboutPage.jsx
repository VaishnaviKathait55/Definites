import About from '../components/About';
import Navbar from '../components/Navbar';

function AboutPage() {
  return (
    <div className="app-container">
      <Navbar />
      <main><About /></main>
    </div>
  );
}
export default AboutPage;