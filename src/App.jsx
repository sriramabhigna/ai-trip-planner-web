/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css' 
import Hero from './components/custom/Hero.jsx' 
import UnsplashGallery from "./src/components/UnsplashGallery.jsx";
import Footer from './components/Footer'; // Import the Footer

function App() {
  return (  
    <Hero/>
    
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-8">
        <UnsplashGallery location="Paris, France" />
      </main>
      <Footer /> 
    </div>
  );
}
export default App*/ 


import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Hero from './components/custom/Hero.jsx';
import UnsplashGallery from "./components/UnsplashGallery.jsx"; // Fixed path
import Footer from './components/Footer.jsx';

function App() {
  return (  
    <>
      <Hero />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow p-8">
          <UnsplashGallery location="Paris, France" />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;