import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Clients from './sections/Clients'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Experience from './components/Experience'

const App = () => {
  return (
    <main className=' max-w-7xl mx-auto'>
      <Navbar/>
      <Hero/>
      <About/>
      <Projects/>
      <Clients/>
      <Experience/>
      <Contact />
      <Footer/>
    </main>
  )
}

export default App