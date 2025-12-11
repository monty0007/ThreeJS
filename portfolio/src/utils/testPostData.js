export const testPost = {
    title: "The Ultimate Guide to 3D Web Development: A Feature Test",
    excerpt: "A comprehensive test post demonstrating all the new features of the blog, including Table of Contents, Author Sidebar, and Rich Markdown styling.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop",
    readTime: "15 min read",
    content: `
> [!NOTE]
> This is a **sample post** generated to test the **Table of Contents** and **Rich Styling** features.

## 1. Introduction to 3D on the Web
Web development has evolved significantly. From static HTML to dynamic 3D experiences.

### 1.1 The Role of WebGL
WebGL allows us to render 2D and 3D graphics.

### 1.2 Why Three.js?
Three.js abstracts the complexity of WebGL.

![Three.js Example](https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop)

## 2. Setting Up the Environment
Before we start, we need to set up our tools.

### 2.1 Installing Node.js
Ensure you have the latest version.

### 2.2 Initializing Vite
Vite is fast and efficient.

## 3. Basic Scene Structure
Every Three.js scene needs three things.

### 3.1 The Scene
The container for all objects.

### 3.2 The Camera
The eye through which we see.

### 3.3 The Renderer
Draws the scene to the canvas.

## 4. Adding Objects
Let's add some geometry.

### 4.1 Geometries vs Meshes
Understanding the difference.

### 4.2 Materials Explained
Standard, Basic, and Physical materials.

> [!TIP]
> Use \`MeshStandardMaterial\` for better lighting effects!

## 5. Lighting the Scene
Without light, there is only darkness.

### 5.1 Ambient Light
Global illumination.

### 5.2 Directional Light
Simulating the sun.

### 5.3 Point Lights
Like lightbulbs in 3D space.

## 6. Animation Loop
Making things move.

### 6.1 requestAnimationFrame
The heart of the loop.

### 6.2 Using GSAP
For complex timelines and easing.

![Animation Code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop)

## 7. Interactivity
Handling user input.

### 7.1 OrbitControls
Navigating the scene.

### 7.2 Raycasting
Clicking on 3D objects.

## 8. Performance Optimization
Keeping it 60fps.

### 8.1 InstancedRendering
Drawing many same objects cheaply.

### 8.2 Texture Compression
Using .ktx2 or .webp.

## 9. Deployment
Sharing with the world.

### 9.1 Building for Production
\`npm run build\`.

### 9.2 Hosting on Vercel
Easy deployment options.

## 10. Conclusion
We have covered a lot today.

### 10.1 Next Steps
Keep experimenting!

### 10.2 Resources
Links to documentation.
    `
};
