import React, { useState, useCallback } from 'react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { compressImage } from '../utils/compressImage';

const AdminDashboard = () => {
    const { posts, deletePost, loading, achievements, addAchievement, deleteAchievement, moveAchievement, updateAchievement } = useBlog();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [newAch, setNewAch] = useState({ title: '', location: '', linkedin: '', image: '', award: 'Winner' });
    const [editingId, setEditingId] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                const compressed = await compressImage(file, 800, 0.8);
                setNewAch(prev => ({ ...prev, image: compressed }));
            } catch (error) {
                console.error('Compression failed:', error);
                alert('Failed to process image.');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const handleAddAchievement = async (e) => {
        e.preventDefault();
        if (!newAch.title || !newAch.location) return alert('Title and Location are required');

        if (editingId) {
            await updateAchievement(editingId, newAch);
            setEditingId(null);
        } else {
            const rotations = ['rotate-1', 'rotate-2', 'rotate-3', '-rotate-1', '-rotate-2', '-rotate-3'];
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

            await addAchievement({
                ...newAch,
                image: newAch.image || `https://placehold.co/600x400/1a1a1a/ffffff?text=${encodeURIComponent(newAch.title)}`,
                rotation: randomRotation,
                award: newAch.award || 'Generic'
            });
        }
        setNewAch({ title: '', location: '', linkedin: '', image: '', award: 'Winner' });
    };

    const handleEdit = (ach) => {
        setNewAch({ title: ach.title, location: ach.location, linkedin: ach.linkedin || '', image: ach.image, award: ach.award || 'Generic' });
        setEditingId(ach.id);
        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' }); // Scroll near form
    };

    const cancelEdit = () => {
        setNewAch({ title: '', location: '', linkedin: '', image: '', award: 'Winner' });
        setEditingId(null);
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

            <div className="bg-black-300 rounded-2xl border border-black-200 overflow-hidden overflow-x-auto mb-10">
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

            <div className="mt-20">
                <h2 className="head-text mb-10">Manage Achievements</h2>

                {/* Add/Edit Form */}
                <form onSubmit={handleAddAchievement} className="bg-black-300 p-6 rounded-2xl border border-black-200 mb-10 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white-600">{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h3>
                        {editingId && <button type="button" onClick={cancelEdit} className="text-sm text-red-400 hover:text-red-300">Cancel Edit</button>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <input
                            placeholder="Title (e.g. Won Hackathon)"
                            value={newAch.title}
                            onChange={e => setNewAch({ ...newAch, title: e.target.value })}
                            className="bg-black-200 p-3 rounded-lg border border-black-100 focus:outline-none focus:border-blue-500 placeholder:text-white-500"
                        />
                        <input
                            placeholder="Location (e.g. London)"
                            value={newAch.location}
                            onChange={e => setNewAch({ ...newAch, location: e.target.value })}
                            className="bg-black-200 p-3 rounded-lg border border-black-100 focus:outline-none focus:border-blue-500 placeholder:text-white-500"
                        />
                        <select
                            value={newAch.award}
                            onChange={e => setNewAch({ ...newAch, award: e.target.value })}
                            className="bg-black-200 p-3 rounded-lg border border-black-100 focus:outline-none focus:border-blue-500 text-white"
                        >
                            <option value="None">❌ None</option>
                            <option value="Winner">🏆 Winner</option>
                            <option value="2nd">🥈 2nd Place</option>
                            <option value="3rd">🥉 3rd Place</option>
                            <option value="Generic">🏅 Generic</option>
                        </select>
                        <input
                            placeholder="LinkedIn URL (Optional)"
                            value={newAch.linkedin}
                            onChange={e => setNewAch({ ...newAch, linkedin: e.target.value })}
                            className="bg-black-200 p-3 rounded-lg border border-black-100 focus:outline-none focus:border-blue-500 placeholder:text-white-500"
                        />
                        {/* Image Upload / URL */}
                        <div>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Image URL or Upload ->"
                                    value={newAch.image}
                                    onChange={e => setNewAch({ ...newAch, image: e.target.value })}
                                    className="flex-1 bg-black-200 p-3 rounded-lg border border-black-100 focus:outline-none focus:border-blue-500 placeholder:text-white-500"
                                />
                                <div {...getRootProps()} className={`px-4 flex items-center justify-center border border-black-100 bg-black-200 rounded-lg cursor-pointer hover:bg-black-100 transition-colors ${isDragActive ? 'border-blue-500' : ''}`} title="Upload Image">
                                    <input {...getInputProps()} />
                                    <span className="text-xl">📷</span>
                                </div>
                            </div>
                            {newAch.image && (
                                <div className="mt-2 relative w-fit">
                                    <img src={newAch.image} alt="Preview" className="h-20 object-cover rounded-md border border-white/20" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors w-full md:w-auto">
                            {editingId ? 'Update Achievement' : 'Add Achievement'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="bg-black-200 hover:bg-black-100 text-white px-6 py-2 rounded-lg transition-colors border border-black-100 w-full md:w-auto">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* List */}
                <div className="bg-black-300 rounded-2xl border border-black-200 overflow-hidden overflow-x-auto">
                    <table className="min-w-[700px] w-full text-left text-white-600">
                        <thead className="bg-black-200 text-white-500 uppercase text-sm">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black-200">
                            {achievements.map((ach, index) => (
                                <tr key={ach.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <span className="mr-2 text-xl" title={ach.award}>
                                            {ach.award === 'Winner' ? '🏆' : ach.award === '2nd' ? '🥈' : ach.award === '3rd' ? '🥉' : '🏅'}
                                        </span>
                                        {ach.title}
                                    </td>
                                    <td className="px-6 py-4">{ach.location}</td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                                        <button onClick={() => handleEdit(ach)} className="p-1 rounded hover:bg-white/10 text-blue-400" title="Edit">
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => moveAchievement(ach.id, 'up')}
                                            disabled={index === 0}
                                            className={`p-1 rounded hover:bg-white/10 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'text-blue-400'}`}
                                            title="Move Up"
                                        >
                                            ⬆️
                                        </button>
                                        <button
                                            onClick={() => moveAchievement(ach.id, 'down')}
                                            disabled={index === achievements.length - 1}
                                            className={`p-1 rounded hover:bg-white/10 ${index === achievements.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-blue-400'}`}
                                            title="Move Down"
                                        >
                                            ⬇️
                                        </button>
                                        <div className="w-px h-4 bg-white/20 mx-2"></div>
                                        <button onClick={() => { if (window.confirm('Delete this achievement?')) deleteAchievement(ach.id) }} className="text-red-400 hover:text-red-300">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {achievements.length === 0 && (
                                <tr><td colSpan="3" className="px-6 py-8 text-center text-white-500">No achievements found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
