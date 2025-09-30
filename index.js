const express = require('express');
const mysql = require('mysql2/promise');
const jayson = require('jayson');
const nodemailer = require('nodemailer');

// Email transport configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    ignoreTLS: true
});

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'example',
    database: process.env.DB_NAME || 'blog',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize express app
const app = express();
app.use(express.json());

// Create JSON-RPC server
const server = new jayson.Server({
    // Create a new blog post
    async createPost(args, callback) {
        try {
            const { title, content, author } = args[0];
            if (!title || !content || !author) {
                return callback({ code: 400, message: 'Title, content, and author are required' });
            }

            const [result] = await pool.execute(
                'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
                [title, content, author]
            );

            // Send notification email
            await transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@blog.local',
                to: 'admin@blog.local',
                subject: `New Post Created: ${title}`,
                text: `A new post has been created:\n\nTitle: ${title}\nAuthor: ${author}\n\nContent:\n${content}`,
                html: `
                    <h1>New Post Created</h1>
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Author:</strong> ${author}</p>
                    <h2>Content:</h2>
                    <p>${content}</p>
                `
            });

            callback(null, {
                id: result.insertId,
                title,
                content,
                author
            });
        } catch (error) {
            callback({ code: 500, message: error.message });
        }
    },

    // List all blog posts
    async listPosts(args, callback) {
        try {
            const [rows] = await pool.execute('SELECT * FROM posts');
            callback(null, rows);
        } catch (error) {
            callback({ code: 500, message: error.message });
        }
    },

    // Get a specific post by ID
    async getPost(args, callback) {
        try {
            const id = args[0];
            if (!id) {
                return callback({ code: 400, message: 'Post ID is required' });
            }

            const [rows] = await pool.execute('SELECT * FROM posts WHERE id = ?', [id]);
            
            if (rows.length === 0) {
                return callback({ code: 404, message: 'Post not found' });
            }

            callback(null, rows[0]);
        } catch (error) {
            callback({ code: 500, message: error.message });
        }
    }
});

// Mount JSON-RPC server on /api endpoint
app.use('/api', server.middleware());

// Initialize database schema
async function initializeDatabase(retries = 5) {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                author VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error(`Error initializing database (attempts left: ${retries}):`, error.message);
        if (retries > 0) {
            console.log('Retrying in 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return initializeDatabase(retries - 1);
        }
        console.error('Max retries reached. Exiting...');
        process.exit(1);
    }
}

// Start server
initializeDatabase().then(() => {
    app.listen(3000, () => {
        console.log('JSON-RPC server running on port 3000');
    });
});