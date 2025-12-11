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
import Login from './sections/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

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
    <AuthProvider>
      <BlogProvider>
        <BrowserRouter>
          <main className=' max-w-7xl mx-auto'>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />

              <Route path="/login" element={<Login />} />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedRoute>
                  <AdminProfile />
                </ProtectedRoute>
              } />
              <Route path="/admin/editor" element={
                <ProtectedRoute>
                  <AdminEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/editor/:id" element={
                <ProtectedRoute>
                  <AdminEditor />
                </ProtectedRoute>
              } />
            </Routes>
            <Footer />
          </main>
        </BrowserRouter>
      </BlogProvider>
    </AuthProvider>
  )
}

export default App
