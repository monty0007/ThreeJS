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
    const [achievements, setAchievements] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [achievementsLoading, setAchievementsLoading] = useState(true);

    // ... (initDB)

    const fetchData = async () => {
        setLoading(true);
        setAchievementsLoading(true);
        if (!db) {
            setPosts(initialPosts);
            setAchievements([
                { id: 1, title: 'Won Midnight Summit Hackathon', location: 'London', image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Hackathon+London', rotation: 'rotate-2', award: 'Winner' },
                { id: 2, title: 'Won Hackathon', location: 'Microsoft', image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Microsoft+Hackathon', rotation: '-rotate-1', award: 'Winner' }
            ]);
            setLoading(false);
            setAchievementsLoading(false);
            return;
        }

        try {
            // 1. Critical Data (Text - Fast) - Parallel Fetch
            const [postsRs, profileRs] = await Promise.all([
                db.execute('SELECT id, title, excerpt, date, image, readTime, tags FROM posts ORDER BY id DESC'),
                db.execute('SELECT * FROM profile WHERE id = 1')
            ]);

            setPosts(postsRs.rows);

            if (profileRs.rows.length > 0) {
                const p = profileRs.rows[0];
                setProfile({
                    ...p,
                    socialLinks: JSON.parse(p.socialLinks || '[]')
                });
            }
        } catch (e) {
            console.error("Fetch critical error:", e);
            setPosts(initialPosts);
        } finally {
            // Unlock UI immediately
            setLoading(false);
        }

        // 2. Heavy Data (Images - Slow) - Fetch in background after UI is ready
        try {
            const achievementsRs = await db.execute('SELECT * FROM achievements ORDER BY ordering ASC');
            setAchievements(achievementsRs.rows);
        } catch (e) {
            console.error("Fetch achievements error:", e);
        } finally {
            setAchievementsLoading(false);
        }
    };

    // ...

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
    readTime TEXT,
    tags TEXT
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

            // Achievements Table
            await db.execute(`
        CREATE TABLE IF NOT EXISTS achievements(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        location TEXT,
        image TEXT,
        linkedin TEXT,
        rotation TEXT,
        ordering INTEGER,
        award TEXT
    )
    `);

            // Ensure tags column exists (Migration)
            try {
                await db.execute("ALTER TABLE posts ADD COLUMN tags TEXT");
            } catch (e) { }

            // Ensure ordering column exists (Migration)
            try {
                await db.execute("ALTER TABLE achievements ADD COLUMN ordering INTEGER");
                console.log("Added ordering column to achievements table");
            } catch (e) { }

            // Ensure award column exists (Migration)
            try {
                await db.execute("ALTER TABLE achievements ADD COLUMN award TEXT");
                console.log("Added award column to achievements table");
            } catch (e) { }

            // Default ordering if null
            await db.execute("UPDATE achievements SET ordering = id WHERE ordering IS NULL");
            // Default award if null
            await db.execute("UPDATE achievements SET award = 'Generic' WHERE award IS NULL");


            // Feature Test Post Check
            const testCheck = await db.execute({
                sql: 'SELECT id FROM posts WHERE title = ?',
                args: [testPost.title]
            });

            // Seed initial data if empty
            if (testCheck.rows.length === 0) {
                // ... (existing seeding) ...
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
            }

            // Seed Achievements if empty
            const achievementsCheck = await db.execute('SELECT COUNT(*) as count FROM achievements');
            if (achievementsCheck.rows[0].count === 0) {
                const initialAchievements = [
                    { title: 'Won Midnight Summit Hackathon', location: 'London', image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Hackathon+London', rotation: 'rotate-2', award: 'Winner' },
                    { title: 'Won Hackathon', location: 'Microsoft', image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Microsoft+Hackathon', rotation: '-rotate-1', award: 'Winner' },
                    { title: 'Won Ideathon', location: 'Microsoft', image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Microsoft+Ideathon', rotation: 'rotate-3', award: 'Winner' },
                    { title: '2nd Place', location: 'IIT Bombay Hackathon', image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=IIT+Bombay', rotation: '-rotate-2', award: '2nd' },
                    { title: 'Top 10', location: 'Pillai HOC College', image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Pillai+HOC', rotation: 'rotate-1', award: 'Generic' },
                ];
                let order = 1;
                for (const ach of initialAchievements) {
                    await db.execute({
                        sql: 'INSERT INTO achievements (title, location, image, linkedin, rotation, ordering, award) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        args: [ach.title, ach.location, ach.image, '', ach.rotation, order++, ach.award]
                    });
                }
            }

            // Seed Profile if empty
            const profileCheck = await db.execute('SELECT COUNT(*) as count FROM profile');
            if (profileCheck.rows[0].count === 0) {
                // ... (existing profile seed) ...
                await db.execute({
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

            // ... (existing post constants seed) ...
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

    // ... (fetchPost existing) ...
    const fetchPost = async (id) => {
        if (!db) return initialPosts.find(p => p.id == id);
        try {
            const rs = await db.execute({
                sql: 'SELECT * FROM posts WHERE id = ?',
                args: [id]
            });
            if (rs.rows.length > 0) return rs.rows[0];
            return null;
        } catch (e) {
            console.error("Fetch Post Error:", e);
            return null;
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

    const addAchievement = async (data) => {
        if (!db) return;
        try {
            // Get min order to prepend
            const minRs = await db.execute('SELECT MIN(ordering) as minOrder FROM achievements');
            const newOrder = (minRs.rows[0].minOrder || 0) - 1;

            await db.execute({
                sql: 'INSERT INTO achievements (title, location, image, linkedin, rotation, ordering, award) VALUES (?, ?, ?, ?, ?, ?, ?)',
                args: [data.title, data.location, data.image, data.linkedin, data.rotation, newOrder, data.award || 'Generic']
            });
            await fetchData();
        } catch (e) {
            console.error("Add Achievement Error:", e);
        }
    };

    const moveAchievement = async (id, direction) => {
        if (!db) return;
        const currentList = [...achievements];
        const index = currentList.findIndex(a => a.id === id);
        if (index === -1) return;

        let swapTargetIndex = -1;
        if (direction === 'up' && index > 0) swapTargetIndex = index - 1;
        if (direction === 'down' && index < currentList.length - 1) swapTargetIndex = index + 1;

        if (swapTargetIndex !== -1) {
            const itemA = currentList[index];
            const itemB = currentList[swapTargetIndex];

            // Swap ordering values
            const orderA = itemA.ordering;
            const orderB = itemB.ordering;

            try {
                await db.execute({ sql: 'UPDATE achievements SET ordering = ? WHERE id = ?', args: [orderB, itemA.id] });
                await db.execute({ sql: 'UPDATE achievements SET ordering = ? WHERE id = ?', args: [orderA, itemB.id] });
                await fetchData();
            } catch (e) {
                console.error("Move error:", e);
            }
        }
    };

    const deleteAchievement = async (id) => {
        if (!db) return;
        try {
            await db.execute({
                sql: 'DELETE FROM achievements WHERE id = ?',
                args: [id]
            });
            await fetchData();
        } catch (e) {
            console.error("Delete Achievement Error:", e);
        }
    };

    const updateAchievement = async (id, data) => {
        if (!db) return;
        try {
            await db.execute({
                sql: 'UPDATE achievements SET title = ?, location = ?, image = ?, linkedin = ?, award = ? WHERE id = ?',
                args: [data.title, data.location, data.image, data.linkedin, data.award, id]
            });
            await fetchData();
        } catch (e) {
            console.error("Update Achievement Error:", e);
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
        <BlogContext.Provider value={{ posts, achievements, profile, loading, achievementsLoading, addPost, updatePost, deletePost, getPost, fetchPost, updateProfile, addAchievement, deleteAchievement, moveAchievement, updateAchievement }}>
            {children}
        </BlogContext.Provider>
    );
};
