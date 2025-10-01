const express = require('express');
const mysql = require('mysql2/promise');
const jayson = require('jayson');
const nodemailer = require('nodemailer');
const logger = require('./config/logger');

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

// Create a new blog post
app.post('/posts', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        logger.http(`POST /posts - Creating new post: "${title}" by ${author}`);
        
        if (!title || !content || !author) {
            logger.warn('POST /posts - Missing required fields');
            return res.status(400).json({
                error: "Petición inválida",
                details: "Los campos title, content y author son requeridos"
            });
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

        const [newPost] = await pool.execute('SELECT * FROM posts WHERE id = ?', [result.insertId]);
        logger.info(`POST /posts - Post created successfully with ID ${result.insertId}`);
        res.json(newPost[0]);
    } catch (error) {
        logger.error(`POST /posts - Error creating post: ${error.message}`);
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message
        });
    }
});

// List all blog posts
app.get('/posts', async (req, res) => {
    try {
        logger.http('GET /posts - Retrieving all posts');
        const [rows] = await pool.execute('SELECT * FROM posts');
        logger.debug(`GET /posts - Retrieved ${rows.length} posts`);
        res.json(rows);
    } catch (error) {
        logger.error(`GET /posts - Error retrieving posts: ${error.message}`);
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message
        });
    }
});

// Get a specific post by ID
app.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        logger.http(`GET /posts/${id} - Retrieving post`);
        
        const [rows] = await pool.execute('SELECT * FROM posts WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            logger.warn(`GET /posts/${id} - Post not found`);
            return res.status(404).json({
                error: "Post no encontrado"
            });
        }
        
        logger.debug(`GET /posts/${id} - Post retrieved successfully`);

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message
        });
    }
});

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
        logger.info('Database initialized successfully');
    } catch (error) {
        logger.error(`Error initializing database (attempts left: ${retries}): ${error.message}`);
        if (retries > 0) {
            logger.info('Retrying in 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return initializeDatabase(retries - 1);
        }
        logger.error('Max retries reached. Exiting...');
        process.exit(1);
    }
}

// Start server
initializeDatabase().then(() => {
    app.listen(3000, () => {
        logger.info('JSON-RPC server running on port 3000');
    });
});