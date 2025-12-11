import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BlogProvider } from './context/BlogContext'
import Navbar from './sections/Navbar'
import Hero from './sections/hero'
import Footer from './components/Footer'
import Blog from './sections/Blog'
import BlogPost from './sections/BlogPost'
import AdminDashboard from './sections/AdminDashboard'
import AdminEditor from './sections/AdminEditor'
import AdminProfile from './sections/AdminProfile'
import Login from './sections/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

const About = React.lazy(() => import('./sections/About'));
const Projects = React.lazy(() => import('./sections/Projects'));
const Clients = React.lazy(() => import('./sections/Clients'));
const Contact = React.lazy(() => import('./components/Contact'));
const Experience = React.lazy(() => import('./components/Experience'));

const Home = () => (
  <>
    <Hero />
    <Suspense fallback={<div className="flex justify-center py-20 text-white">Loading content...</div>}>
      <About />
      <Projects />
      <Clients />
      <Experience />
      <Contact />
    </Suspense>
  </>
)

const App = () => {
  return (
    <AuthProvider>
      <BlogProvider>
        <BrowserRouter>
          <ScrollToTop />
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
