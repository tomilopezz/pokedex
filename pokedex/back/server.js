// back/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Servidor funcionando con Express y MySQL (pokedex)');
});


app.get('/equipo', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM equipo ORDER BY id ASC');
    res.json(rows);
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
     
        await pool.query("DELETE FROM equipo");

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



app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
});

