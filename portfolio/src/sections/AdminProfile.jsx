import React, { useEffect, useState, useCallback } from 'react';
import { useBlog } from '../context/BlogContext';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const AdminProfile = () => {
    const { profile, updateProfile, loading } = useBlog();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        image: '',
        socialLinks: []
    });

    // Cropper State
    const [tempImg, setTempImg] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setTempImg(reader.result);
                setIsCropping(true);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(tempImg, croppedAreaPixels);
            setFormData(prev => ({ ...prev, image: croppedImage }));
            setIsCropping(false);
            setTempImg(null);
        } catch (e) {
            console.error(e);
            alert('Failed to crop image');
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        setTempImg(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...formData.socialLinks];
        newLinks[index][field] = value;
        setFormData({ ...formData, socialLinks: newLinks });
    };

    const addLink = () => {
        setFormData({
            ...formData,
            socialLinks: [...formData.socialLinks, { platform: 'github', url: '' }]
        });
    };

    const removeLink = (index) => {
        const newLinks = formData.socialLinks.filter((_, i) => i !== index);
        setFormData({ ...formData, socialLinks: newLinks });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile(formData);
        alert('Profile updated!');
        navigate('/admin');
    };

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <section className="c-space my-20 max-w-4xl mx-auto px-5 relative">
            <h2 className="head-text mb-8">Edit Profile</h2>

            {/* Cropper Modal */}
            {isCropping && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-lg h-96 bg-black-200 rounded-xl overflow-hidden mb-4 border border-black-100">
                        <Cropper
                            image={tempImg}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="w-full max-w-lg flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-white text-sm">Zoom</span>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={handleSaveCrop} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                Crop & Save
                            </button>
                            <button onClick={handleCancelCrop} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white-500 mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-black-300 border border-black-200 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-white-500 mb-2">Job Title</label>
                        <input
                            type="text"
                            className="w-full bg-black-300 border border-black-200 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-white-500 mb-2">Profile Picture</label>
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-black-100 hover:border-white-500'}`}>
                        <input {...getInputProps()} />
                        {formData.image ? (
                            <div className="flex items-center justify-center gap-4">
                                <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-full object-cover border border-black-200" />
                                <span className="text-blue-400 text-sm">Click or Drag to replace</span>
                            </div>
                        ) : (
                            <p className="text-white-600">Drag & drop profile image here</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-white-500 mb-2">Bio</label>
                    <textarea
                        className="w-full bg-black-300 border border-black-200 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 h-32"
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-white-500">Connected IDs (Social Links)</label>
                        <button type="button" onClick={addLink} className="text-sm text-blue-400 hover:text-blue-300">+ Add Link</button>
                    </div>

                    <div className="space-y-4">
                        {formData.socialLinks.map((link, index) => (
                            <div key={index} className="flex gap-4">
                                <select
                                    className="bg-black-300 border border-black-200 rounded-lg p-3 text-white w-32"
                                    value={link.platform}
                                    onChange={e => handleLinkChange(index, 'platform', e.target.value)}
                                >
                                    <option value="github">GitHub</option>
                                    <option value="twitter">Twitter</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="website">Website</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="URL"
                                    className="flex-1 bg-black-300 border border-black-200 rounded-lg p-3 text-white"
                                    value={link.url}
                                    onChange={e => handleLinkChange(index, 'url', e.target.value)}
                                />
                                <button type="button" onClick={() => removeLink(index)} className="text-red-400 hover:text-red-300 px-2">
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold">
                        Save Profile
                    </button>
                    <button type="button" onClick={() => navigate('/admin')} className="bg-black-200 hover:bg-black-100 text-white px-8 py-3 rounded-lg transition-colors">
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AdminProfile;
