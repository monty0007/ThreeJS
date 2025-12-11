import React from 'react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { posts, deletePost, loading } = useBlog();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <section className="c-space my-20 max-w-6xl mx-auto px-5">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-5">
                <h2 className="head-text">Admin Dashboard</h2>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                        Logout
                    </button>
                    <Link to="/admin/profile" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Edit Profile
                    </Link>
                    <Link to="/admin/editor" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                        + New Post
                    </Link>
                </div>
            </div>

            <div className="bg-black-300 rounded-2xl border border-black-200 overflow-hidden overflow-x-auto">
                <table className="min-w-[700px] w-full text-left text-white-600">
                    <thead className="bg-black-200 text-white-500 uppercase text-sm">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black-200">
                        {posts.map(post => (
                            <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                                <td className="px-6 py-4">{post.date}</td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <Link to={`/admin/editor/${post.id}`} className="text-blue-400 hover:text-blue-300">Edit</Link>
                                    <button onClick={() => { if (window.confirm('Delete this post?')) deletePost(post.id) }} className="text-red-400 hover:text-red-300">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-white-500">No posts found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminDashboard;
