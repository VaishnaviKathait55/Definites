import About from '../components/About';
import Contact from '../components/Contact';
import CTA from '../components/CTA';
import Expertise from '../components/Expertise';
import Hero from '../components/Hero';
import Insights from '../components/Insights';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import WhyChooseUs from '../components/WhyChooseUs';

function LandingPage() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Expertise />
        <Insights />
        <Testimonials />
        <Team />
        <CTA />
        <Contact />
      </main>
    </div>
  );
}

export default LandingPage;
