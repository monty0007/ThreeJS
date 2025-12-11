import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Link } from 'react-router-dom';

const Blog = () => {
    const { posts, loading } = useBlog();

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <section className="c-space my-20">
            <div className="w-full text-white-600">
                <h3 className="head-text">My Blog</h3>
                <p className="text-lg text-white-500 mt-3 max-w-2xl">
                    Thoughts on development, design, and the future of tech.
                </p>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link to={`/blog/${post.id}`} key={post.id} className="bg-black-300 p-6 rounded-2xl border border-black-200 hover:border-white-500 transition-all duration-300 group cursor-pointer block">
                            <div className="w-full h-48 overflow-hidden rounded-xl mb-6">
                                <div className="w-full h-full bg-black-200 flex items-center justify-center text-white-500 relative">
                                    <span className="absolute z-0">Image Placeholder</span>
                                    {post.image ? (
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover relative z-10 bg-black-200 group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.style.display = 'none'} />
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4 text-white-500 text-sm">
                                <span>{post.date}</span>
                                <span>{post.readTime}</span>
                            </div>

                            <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {post.title}
                            </h4>

                            <p className="text-white-500 line-clamp-3 mb-4">
                                {post.excerpt}
                            </p>

                            <span className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
                                Read Article
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
