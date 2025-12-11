import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BlogProvider } from './context/BlogContext'
import Navbar from './sections/Navbar'
import Hero from './sections/hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Clients from './sections/Clients'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Experience from './components/Experience'
import Blog from './sections/Blog'
import BlogPost from './sections/BlogPost'
import AdminDashboard from './sections/AdminDashboard'
import AdminEditor from './sections/AdminEditor'
import AdminProfile from './sections/AdminProfile'

const Home = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Clients />
    <Experience />
    <Contact />
  </>
)

const App = () => {
  return (
    <BlogProvider>
      <BrowserRouter>
        <main className=' max-w-7xl mx-auto'>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/editor" element={<AdminEditor />} />
            <Route path="/admin/editor/:id" element={<AdminEditor />} />
          </Routes>
          <Footer />
        </main>
      </BrowserRouter>
    </BlogProvider>
  )
}

export default App
