import React from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Expertise from './components/Expertise';
import Insights from './components/Insights';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import Contact from './components/Contact';

const App = () => {
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
        <Contact /> 
      </main>
    </div>
  );
};

export default App;