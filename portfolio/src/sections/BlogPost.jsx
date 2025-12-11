import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import GithubSlugger from 'github-slugger';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useBlog } from '../context/BlogContext';

const SocialIcon = ({ platform }) => {
    const commonClasses = "w-5 h-5 fill-current";
    switch (platform) {
        case 'github': return (
            <svg className={commonClasses} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
        );
        case 'twitter': return (
            <svg className={commonClasses} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        );
        case 'linkedin': return (
            <svg className={commonClasses} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        );
        case 'instagram': return (
            <svg className={commonClasses} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        );
        default: return <img src="/assets/arrow-up.png" alt="Link" className="w-4 h-4 ml-1" />;
    }
};

const AuthorProfile = () => {
    const { profile } = useBlog();

    if (!profile) return null;

    return (
        <div className="bg-black-300 rounded-xl p-6 border border-black-200">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-600">
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover object-top" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">{profile.name}</h3>
                    <p className="text-white-500 text-sm">{profile.title}</p>
                </div>
            </div>
            <div className="text-white-600 text-sm mb-4 whitespace-pre-line">
                {profile.bio}
            </div>
            <div className="flex gap-3">
                {profile.socialLinks && profile.socialLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="text-white-500 hover:text-white transition-colors">
                        <SocialIcon platform={link.platform} />
                    </a>
                ))}
            </div>
        </div>
    );
};

const TableOfContents = ({ content }) => {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        const slugger = new GithubSlugger();
        const lines = content?.split('\n') || [];
        const extracted = lines
            .filter(line => line.match(/^#{2,3}\s/))
            .map(line => {
                const level = line.trim().startsWith('###') ? 3 : 2;
                const text = line.replace(/^#+\s+/, '');
                const id = slugger.slug(text);
                return { level, text, id };
            });
        setHeadings(extracted);
    }, [content]);

    if (headings.length === 0) return null;

    return (
        <div className="bg-black-300 rounded-xl p-5 border border-black-200">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider border-b border-black-200 pb-2">Table of Contents</h4>
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <ul className="space-y-3 text-sm">
                    {headings.map((heading, index) => (
                        <li key={index} className={`${heading.level === 3 ? 'pl-4 border-l border-black-200 ml-1' : ''}`}>
                            <a href={`#${heading.id}`} className={`block hover:text-blue-400 transition-colors ${heading.level === 3 ? 'text-white-600 font-normal' : 'text-white-500 font-medium'}`}>
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

const TimelineTOC = ({ content }) => {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        const slugger = new GithubSlugger();
        const lines = content?.split('\n') || [];
        const extracted = lines
            .filter(line => line.match(/^#{2}\s/))
            .map(line => {
                const level = 2;
                const text = line.replace(/^#+\s+/, '');
                const id = slugger.slug(text);
                return { level, text, id };
            });
        setHeadings(extracted);
    }, [content]);

    if (headings.length === 0) return null;

    return (
        <div className="bg-black-300 rounded-xl p-5 border border-black-200 mb-8">
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-wider">Table of Contents</h4>
            <div className="relative ml-2">
                <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-black-200"></div>
                <ul className="space-y-6 relative">
                    {headings.map((heading, index) => (
                        <li key={index} className="pl-8 relative">
                            <div className={`absolute left-[1px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-black-300 z-10 ${heading.level === 3 ? 'bg-black-200' : 'bg-blue-500'}`}></div>
                            <a href={`#${heading.id}`} className={`block hover:text-blue-400 transition-colors text-sm ${heading.level === 3 ? 'text-white-600' : 'text-white-500 font-medium'}`}>
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const BlogPost = () => {
    const { id } = useParams();
    const { fetchPost, profile } = useBlog();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            const p = await fetchPost(id);
            setPost(p);
            setLoading(false);
        };
        loadPost();
    }, [id, fetchPost]);

    if (loading) return <div className="text-white text-center mt-20">Loading Post...</div>;
    if (!post) return <div className="text-white text-center mt-20">Post not found</div>;

    return (
        <section className="c-space my-20 w-full px-4 max-w-7xl mx-auto">
            <Link to="/blog" className="text-blue-400 hover:text-blue-300 mb-8 inline-flex items-center gap-2">
                <span>&larr;</span> Back to Blog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
                <article className="w-full max-w-4xl mx-auto">
                    {post.image && (
                        <div className="w-full h-64 md:h-[500px] rounded-2xl overflow-hidden mb-2 lg:mb-8 border border-black-200">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Mobile Mini Header */}
                    {profile && (
                        <div className="flex items-center gap-2 mt-0 mb-4 lg:hidden">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 shrink-0">
                                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm leading-none">{profile.name}</h3>
                                <p className="text-white-500 text-[10px] leading-tight">{profile.title}</p>
                            </div>
                        </div>
                    )}

                    <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags ? post.tags.split(',').filter(t => t.trim()).map((tag, index) => (
                            <span key={index} className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                                {tag.trim()}
                            </span>
                        )) : (
                            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                                Technical
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>

                    <div className="flex items-center text-white-500 mb-10 text-sm border-b border-black-200 pb-8">
                        <span className="mr-4">{post.date}</span>
                        <span className="mr-4">•</span>
                        <span>{post.readTime}</span>
                    </div>


                    <div className="prose prose-invert prose-lg max-w-none text-white-700
                prose-headings:scroll-mt-0
                prose-h2:text-white prose-h2:font-bold prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-2 prose-h2:mb-4
                prose-h3:text-white prose-h3:font-semibold prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-2 prose-h3:mb-2
                prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-img:rounded-xl prose-img:border prose-img:border-black-200 prose-img:w-full
                prose-code:text-blue-300 prose-code:bg-black-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            ">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSlug]}
                            urlTransform={(value) => value}
                            components={{
                                // Custom renderer for blockquotes
                                blockquote: ({ node, children, ...props }) => (
                                    <blockquote {...props} className="border-l-4 border-l-blue-500 bg-blue-900/20 pl-4 py-2 my-4 text-white-600 rounded-r-lg">
                                        {children}
                                    </blockquote>
                                ),
                                // Custom renderer for images
                                img: ({ node, src, alt, ...props }) => (
                                    <figure className="my-6">
                                        <img src={src} alt={alt} className="w-full rounded-xl border border-black-200" {...props} />
                                        {alt && <figcaption className="text-center text-white-500 text-sm mt-2">{alt}</figcaption>}
                                    </figure>
                                ),
                                // Custom renderer for code blocks
                                code: ({ node, inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{
                                                background: '#1a1a1a',
                                                border: '1px solid #333',
                                                borderRadius: '0.5rem',
                                                padding: '1.5rem',
                                            }}
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={`${className} bg-black-300 text-blue-300 px-1.5 py-0.5 rounded font-mono text-sm`} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {post.content || post.excerpt}
                        </ReactMarkdown>
                    </div>

                    {/* Mobile Bottom Boxes */}
                    <div className="lg:hidden space-y-12 mt-12 mb-20">
                        <TimelineTOC content={post.content} />
                        <AuthorProfile />
                    </div>
                </article>

                <aside className="space-y-8 hidden lg:block">
                    <AuthorProfile />
                    <div className="lg:sticky lg:top-24">
                        <TableOfContents content={post.content} />
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default BlogPost;
