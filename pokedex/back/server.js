// back/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor funcionando con Express y MySQL (pokedex)');
});

// GET /equipo -> devuelve todos los registros de la tabla equipo
app.get('/equipo', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM equipo ORDER BY id ASC');
    res.json(rows); // [{id, nombre, imagen}, ...] o [] si está vacía
  } catch (err) {
    console.error('Error GET /equipo:', err);
    res.status(500).json({ error: 'Error al obtener equipo' });
  }
});

app.post('/equipo', async (req, res) => {
    const { equipo } = req.body;

    if (!Array.isArray(equipo)) {
        return res.status(400).json({ error: "Formato de equipo inválido" });
    }

    try {
        // borrar equipo anterior
        await pool.query("DELETE FROM equipo");

        // guardar nuevo equipo
        for (const pokemon of equipo) {
            await pool.query(
                "INSERT INTO equipo (id, nombre, imagen) VALUES (?, ?, ?)",
                [pokemon.id, pokemon.nombre, pokemon.imagen]
            );
        }

        res.json({ message: "Equipo guardado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// DELETE /equipo -> borra todo el equipo
app.delete('/equipo', async (req, res) => {
  try {
    await pool.query('DELETE FROM equipo');
    res.json({ message: 'Equipo borrado' });
  } catch (err) {
    console.error('Error DELETE /equipo:', err);
    res.status(500).json({ error: 'Error al borrar equipo' });
  }
});

app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
});
