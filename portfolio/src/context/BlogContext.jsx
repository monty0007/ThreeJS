import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@libsql/client';
import { testPost } from '../utils/testPostData';
import { featurePost } from '../utils/featurePost';
import { blogPosts as initialPosts } from '../constants'; // Re-adding this import as it was used in code

const db = createClient({
    url: import.meta.env.VITE_TURSO_DB_URL,
    authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});
const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize DB table if not exists
    const initDB = async () => {
        if (!db) return;
        try {
            // Posts Table
            await db.execute(`
        CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    date TEXT,
    image TEXT,
    readTime TEXT
)
    `);

            // Profile Table
            await db.execute(`
        CREATE TABLE IF NOT EXISTS profile(
        id INTEGER PRIMARY KEY DEFAULT 1,
        name TEXT,
        title TEXT,
        bio TEXT,
        image TEXT,
        socialLinks TEXT
    )
    `);

            // Ensure tags column exists (Migration)
            try {
                await db.execute("ALTER TABLE posts ADD COLUMN tags TEXT");
                console.log("Added tags column to posts table");
            } catch (e) {
                // Column likely already exists, ignore
            }

            // Feature Test Post Check
            const testCheck = await db.execute({ // Changed turso to db
                sql: 'SELECT id FROM posts WHERE title = ?',
                args: [testPost.title]
            });

            // Seed initial data if empty
            if (testCheck.rows.length === 0) { // Using testCheck as the condition
                // Insert Test Post 1
                await db.execute({
                    sql: "INSERT INTO posts (title, excerpt, content, image, date, readTime, tags) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    args: [testPost.title, testPost.excerpt, testPost.content, testPost.image, testPost.date, testPost.readTime, 'Technical'],
                });

                // Insert Feature Showcase Post
                await db.execute({
                    sql: "INSERT INTO posts (title, excerpt, content, image, date, readTime, tags) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    args: [featurePost.title, featurePost.excerpt, featurePost.content, featurePost.image, featurePost.date, featurePost.readTime, 'Tutorial'],
                });

                console.log('Seeded initial blog posts');
            }

            // Seed Profile if empty
            const profileCheck = await db.execute('SELECT COUNT(*) as count FROM profile'); // Changed turso to db
            if (profileCheck.rows[0].count === 0) {
                await db.execute({ // Changed turso to db
                    sql: 'INSERT INTO profile (id, name, title, bio, image, socialLinks) VALUES (1, ?, ?, ?, ?, ?)',
                    args: [
                        'Manish Yadav',
                        'GenAI Engineer',
                        'Building Agentic AI solutions & Power Platform apps. Currently exploring Blockchain technology.\n\n🏆 Winner: Midnight Summit Hackathon, London',
                        '/assets/profile.png',
                        JSON.stringify([
                            { platform: 'github', url: 'https://github.com/monty0007' },
                            { platform: 'twitter', url: 'https://twitter.com' },
                            { platform: 'linkedin', url: 'https://linkedin.com' }
                        ])
                    ]
                });
            }

            // Check if empty posts, seed constants
            const rs = await db.execute('SELECT COUNT(*) as count FROM posts');
            if (rs.rows[0].count === 0) {
                for (const post of initialPosts) {
                    await db.execute({
                        sql: 'INSERT INTO posts (title, excerpt, content, date, image, readTime) VALUES (?, ?, ?, ?, ?, ?)',
                        args: [post.title, post.excerpt, post.content || '', post.date, post.image, post.readTime]
                    });
                }
            }
        } catch (e) {
            console.error("Failed to init DB:", e);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        if (!db) {
            setPosts(initialPosts);
            setLoading(false);
            return;
        }

        try {
            const postsRs = await db.execute('SELECT * FROM posts ORDER BY id DESC');
            setPosts(postsRs.rows);

            const profileRs = await db.execute('SELECT * FROM profile WHERE id = 1');
            if (profileRs.rows.length > 0) {
                const p = profileRs.rows[0];
                setProfile({
                    ...p,
                    socialLinks: JSON.parse(p.socialLinks || '[]')
                });
            }
        } catch (e) {
            console.error("Fetch error:", e);
            setPosts(initialPosts);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initDB().then(() => fetchData());
    }, []);

    const updateProfile = async (data) => {
        if (!db) return;
        try {
            await db.execute({
                sql: 'UPDATE profile SET name = ?, title = ?, bio = ?, image = ?, socialLinks = ? WHERE id = 1',
                args: [data.name, data.title, data.bio, data.image, JSON.stringify(data.socialLinks)]
            });
            await fetchData();
        } catch (e) {
            console.error("Update Profile Error:", e);
        }
    };

    const addPost = async (post) => {
        if (!db) return;
        try {
            await db.execute({
                sql: 'INSERT INTO posts (title, excerpt, content, date, image, readTime, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
                args: [post.title, post.excerpt, post.content, new Date().toLocaleDateString(), post.image, '5 min read', post.tags || 'General']
            });
            await fetchData();
        } catch (e) {
            console.error("Add error:", e);
            alert("Failed to add post");
        }
    };

    const updatePost = async (id, post) => {
        if (!db) return;
        try {
            await db.execute({
                sql: 'UPDATE posts SET title = ?, excerpt = ?, content = ?, image = ?, tags = ? WHERE id = ?',
                args: [post.title, post.excerpt, post.content, post.image, post.tags, id]
            });
            await fetchData();
        } catch (e) {
            console.error("Update error:", e);
        }
    };

    const deletePost = async (id) => {
        if (!db) return;
        try {
            await db.execute({
                sql: 'DELETE FROM posts WHERE id = ?',
                args: [id]
            });
            await fetchData();
        } catch (e) {
            console.error("Delete error:", e);
        }
    };

    const getPost = (id) => {
        return posts.find(p => p.id == id);
    };

    return (
        <BlogContext.Provider value={{ posts, profile, loading, addPost, updatePost, deletePost, getPost, updateProfile }}>
            {children}
        </BlogContext.Provider>
    );
};
