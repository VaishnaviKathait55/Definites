
import Disclaimer from '../components/Disclaimer';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import CTA from '../components/CTA';
// import About from '../components/About';
// import Expertise from '../components/Expertise';
// import Insights from '../components/Insights';
// import Services from '../components/Services';
// import Team from '../components/Team';
// import Contact from '../components/Contact';
// import Testimonials from '../components/Testimonials';
// import WhyChooseUs from '../components/WhyChooseUs';

function LandingPage() {
  return (
    // <div className="app-container">
    //   <Navbar />
    //   <main>
    //     <Hero />
    //     <About />
    //     <Services />
    //     <WhyChooseUs />
    //     <Expertise />
    //     <Insights />
    //     <Testimonials />
    //     <Team />
    //     <CTA />
    //     <Contact />
    //   </main>
    // </div>
    <div className="app-container">
      <Disclaimer />
      <Navbar />
      <main>
        <Hero />
        <CTA />
      </main>
    </div>
  );
}

export default LandingPage;
