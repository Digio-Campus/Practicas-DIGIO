const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});


app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Hora actual de la base de datos: ${result.rows[0].now}`);
    } catch (e) {
        res.status(500).send('Error al conectar con la base de datos');
    }
});

app.listen(3000, () => console.log('Servidor en el puerto 3000'));