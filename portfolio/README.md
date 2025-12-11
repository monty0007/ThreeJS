# 3D Developer Portfolio

A modern, responsive portfolio website featuring interactive 3D elements, animations, and a showcase of projects and experience.

## Tech Stack
- **Framework**: React (Vite)
- **Styling**: TailwindCSS
- **3D Graphics**: Three.js (@react-three/fiber, @react-three/drei)
- **Animations**: GSAP
- **Routing**: React Router
- **Email**: EmailJS

## Features
- **3D Hero Section**: Interactive 3D avatar and scene.
- **Projects Gallery**: Showcase of work with details and links.
- **Work Experience**: Timeline of professional history.
- **Blog Section**: Thoughts on development and tech (Zenn.dev style).
- **Contact Form**: Functional contact form integrated with EmailJS.
- **Responsive Design**: Optimized for all devices.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure
- `src/components`: Reusable UI components (CanvasLoader, standard components).
- `src/sections`: Main page sections (Hero, About, Blog, etc.).
- `src/constants`: Static data configuration (links, projects, blog posts).
- `src/App.jsx`: Main application component with routing setup.
