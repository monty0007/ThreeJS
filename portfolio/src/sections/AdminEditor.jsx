import React, { useEffect, useState, useCallback } from 'react';
import { useBlog } from '../context/BlogContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { compressImage } from '../utils/compressImage';

const AdminEditor = () => {
    const { id } = useParams();
    const { getPost, addPost, updatePost, fetchPost } = useBlog();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        tags: 'Technical'
    });

    // Store heavy image data separately to keep editor clean
    const [hiddenImages, setHiddenImages] = useState({});

    // Store cursor position for image insertion
    const [cursorPosition, setCursorPosition] = useState(0);

    const updateCursorPosition = (e) => {
        setCursorPosition(e.target.selectionStart);
    };

    const [tagInput, setTagInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const TAG_OPTIONS = ['Technical', 'Tutorial', 'Blockchain', 'JavaScript', 'React', 'HTML', 'CSS', 'ThreeJS', 'GenAI'];

    // Helper to separate text from image definitions
    const parseContent = (fullText) => {
        if (!fullText) return { text: '', images: {} };

        const images = {};
        // Regex to find reference definitions like [id]: data:image/...
        // Matches start of line, bracket ID, colon, whitespace, data uri
        const regex = /^\[([^\]]+)\]:\s*(data:image\/[^ \n\r]+)/gm;

        const cleanText = fullText.replace(regex, (match, id, data) => {
            images[id] = data;
            return ''; // Remove from visible text
        }).trim();

        return { text: cleanText, images };
    };

    // Helper to combine text and images for saving
    const reassembleContent = (text, images) => {
        let final = text.trim();
        const imageIds = Object.keys(images);

        if (imageIds.length > 0) {
            final += '\n\n'; // Spacing
            imageIds.forEach(id => {
                // Check if the image is actually used in the text (optional optimization, but safely add all)
                if (text.includes(`][${id}]`)) {
                    final += `[${id}]: ${images[id]}\n`;
                }
            });
        }
        return final;
    };

    useEffect(() => {
        const loadPost = async () => {
            if (id) {
                const post = await fetchPost(id);
                if (post) {
                    const { text, images } = parseContent(post.content || '');
                    setHiddenImages(images);

                    setFormData({
                        title: post.title,
                        excerpt: post.excerpt,
                        content: text,
                        image: post.image || '',
                        tags: post.tags || 'Technical'
                    });
                }
            }
        };
        loadPost();
    }, [id, fetchPost]);

    const onDropCover = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                const compressed = await compressImage(file, 1200, 0.8);
                setFormData(prev => ({ ...prev, image: compressed }));
            } catch (error) {
                console.error('Compression failed:', error);
                alert('Failed to process cover image.');
            }
        }
    }, []);

    const onDropInline = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                const compressed = await compressImage(file, 800, 0.8);
                const fileId = `img_${Date.now()}`; // Unique reference ID
                const referenceLink = `\n![${file.name}][${fileId}]`; // Short reference

                // Store data hidden, show only link
                setHiddenImages(prev => ({ ...prev, [fileId]: compressed }));

                setFormData(prev => {
                    const current = prev.content || '';
                    const before = current.substring(0, cursorPosition);
                    const after = current.substring(cursorPosition);
                    return {
                        ...prev,
                        content: before + referenceLink + after
                    };
                });
            } catch (error) {
                console.error('Compression failed:', error);
                alert('Failed to process image.');
            }
        }
    }, [cursorPosition]);

    // ... Dropzone config ... (Skipping simple lines to reduce diff size, assuming context holds)

    // Dropzone for Cover Image
    const {
        getRootProps: getCoverProps,
        getInputProps: getCoverInputProps,
        isDragActive: isCoverActive
    } = useDropzone({
        onDrop: onDropCover,
        accept: { 'image/*': [] },
        multiple: false
    });

    // Dropzone for Inline Images
    const {
        getRootProps: getInlineProps,
        getInputProps: getInlineInputProps,
        isDragActive: isInlineActive
    } = useDropzone({
        onDrop: onDropInline,
        accept: { 'image/*': [] },
        multiple: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalContent = reassembleContent(formData.content, hiddenImages);
            const payload = { ...formData, content: finalContent };

            if (id) {
                await updatePost(id, payload);
            } else {
                await addPost(payload);
            }
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Failed to save post. Image might be too large for the database limit.');
        }
    };

    return (
        <section className="c-space my-20 max-w-4xl mx-auto px-5">
            <h2 className="head-text mb-8">{id ? 'Edit Post' : 'Create New Post'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-white-500 mb-2">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-black-300 border border-black-200 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-white-500 mb-2">Cover Image</label>

                    <div {...getCoverProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isCoverActive ? 'border-blue-500 bg-blue-500/10' : 'border-black-100 hover:border-white-500'}`}>
                        <input {...getCoverInputProps()} />
                        {formData.image ? (
                            <div className="relative h-48 w-full">
                                <img src={formData.image} alt="Cover Preview" className="h-full w-full object-cover rounded-md" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                    <span className="text-white font-medium">Click or Drag to replace</span>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8">
                                <p className="text-white-600">Drag & drop a cover image here, or click to select</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-white-500 mb-2">Category / Tags</label>

                    {/* Selected Tags Area */}
                    <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-2 bg-black-300 border border-black-200 rounded-lg">
                        {formData.tags.split(',').filter(t => t.trim()).map((tag, index) => (
                            <span key={index} className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2">
                                {tag.trim()}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentTags = formData.tags.split(',').filter(t => t.trim());
                                        const newTags = currentTags.filter((_, i) => i !== index);
                                        setFormData({ ...formData, tags: newTags.join(',') });
                                    }}
                                    className="hover:text-red-300 font-bold"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                        {(!formData.tags || formData.tags.trim() === '') && (
                            <span className="text-white-600 text-sm italic py-1">No tags selected</span>
                        )}
                    </div>

                    {/* Tag Input & Suggestions */}
                    <div className="space-y-4 relative">
                        <div className="flex gap-2 relative">
                            <input
                                type="text"
                                placeholder="Type to search or add custom tag..."
                                className="flex-1 bg-black-200 border border-black-100 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                                value={tagInput}
                                onChange={(e) => {
                                    setTagInput(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const newTag = tagInput.trim();
                                        if (newTag) {
                                            const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                                            if (!currentTags.includes(newTag)) {
                                                setFormData({ ...formData, tags: [...currentTags, newTag].join(',') });
                                            }
                                            setTagInput('');
                                            setShowSuggestions(false);
                                        }
                                    }
                                }}
                            />
                            {/* Autocomplete Dropdown */}
                            {showSuggestions && tagInput && (
                                <div className="absolute top-full text-left left-0 w-full bg-black-200 border border-black-100 rounded-lg mt-1 shadow-xl z-50 max-h-48 overflow-y-auto">
                                    {TAG_OPTIONS.filter(opt => opt.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(opt)).map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            className="w-full text-left px-4 py-2 text-sm text-white-700 hover:bg-black-300 hover:text-white transition-colors border-b border-black-100 last:border-0"
                                            onClick={() => {
                                                const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                                                if (!currentTags.includes(tag)) {
                                                    setFormData({ ...formData, tags: [...currentTags, tag].join(',') });
                                                }
                                                setTagInput('');
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                    {TAG_OPTIONS.filter(opt => opt.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(opt)).length === 0 && (
                                        <div className="px-4 py-2 text-sm text-white-500 italic">
                                            Press Enter to add "{tagInput}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-xs text-white-600 mb-2">Popular Tags:</p>
                            <div className="flex flex-wrap gap-2">
                                {TAG_OPTIONS.filter(opt => !formData.tags.includes(opt)).map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                                            if (!currentTags.includes(tag)) {
                                                setFormData({ ...formData, tags: [...currentTags, tag].join(',') });
                                            }
                                        }}
                                        className="bg-black-200 text-white-500 hover:bg-blue-500/20 hover:text-blue-400 text-xs px-3 py-1.5 rounded-full border border-black-100 transition-colors"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-white-500 mb-2">Excerpt (Short Description)</label>
                    <textarea
                        required
                        className="w-full bg-black-300 border border-black-200 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 h-24"
                        value={formData.excerpt}
                        onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-white-500 mb-2">Content (Markdown supported)</label>
                    <div className="bg-black-200 p-5 rounded-lg mb-4 text-sm text-white-600 border border-black-100">
                        <div className="flex justify-between items-center mb-3">
                            <strong className="text-white font-semibold text-base">Markdown Cheatsheet</strong>
                            <span className="text-xs text-white-500">Support CommonMark</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <p className="text-white-500 font-medium border-b border-black-100 pb-1 mb-2">Structure</p>
                                <div className="flex items-center gap-2">
                                    <code className="bg-black-300 px-1.5 py-0.5 rounded text-blue-400">## Title</code>
                                    <span>Major Section (H2)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="bg-black-300 px-1.5 py-0.5 rounded text-blue-400">### Subtitle</code>
                                    <span>Subsection (H3)</span>
                                </div>
                                <div className="text-xs text-white-500 italic mt-1">
                                    * Use H2 for main topics. H1 is used for the post title automatically.
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-white-500 font-medium border-b border-black-100 pb-1 mb-2">Formatting</p>
                                <div className="flex items-center gap-2">
                                    <code className="bg-black-300 px-1.5 py-0.5 rounded text-yellow-400">**Bold**</code>
                                    <span>Bold Text</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="bg-black-300 px-1.5 py-0.5 rounded text-yellow-400">*Italic*</code>
                                    <span>Italic Text</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="bg-black-300 px-1.5 py-0.5 rounded text-green-400">&gt; text</code>
                                    <span>Blue Note / Callout Box</span>
                                </div>
                                <div className="text-xs text-white-500 italic mt-1">
                                    * Start line with &gt; to make a highlighted note.
                                </div>
                            </div>
                        </div>

                        <div {...getInlineProps()} className={`border-2 border-dashed border-gray-700 rounded p-4 text-center cursor-pointer transition-colors ${isInlineActive ? 'border-blue-400 bg-blue-400/10' : 'hover:border-gray-500 hover:bg-black-300'}`}>
                            <input {...getInlineInputProps()} />
                            <p className="text-sm text-blue-400 font-medium">📷 Drag & Drop image here to insert</p>
                            <p className="text-xs text-white-500 mt-1">Auto-compressed & inserted at cursor</p>
                        </div>
                    </div>

                    <textarea
                        className="w-full bg-black-300 border border-black-200 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 h-96 font-mono"
                        value={formData.content}
                        onChange={e => {
                            setFormData({ ...formData, content: e.target.value });
                            updateCursorPosition(e);
                        }}
                        onSelect={updateCursorPosition}
                        onClick={updateCursorPosition}
                        onKeyUp={updateCursorPosition}
                    />
                </div>

                <div className="flex gap-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold">
                        {id ? 'Update Post' : 'Publish Post'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin')} className="bg-black-200 hover:bg-black-100 text-white px-8 py-3 rounded-lg transition-colors">
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AdminEditor;
