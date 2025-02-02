// --- backend/app.js ---

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { readDB, writeDB } = require('./db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas CRUD
app.get('/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.post('/users', (req, res) => {
  const db = readDB();
  const { user, dni, phone, email } = req.body;

  if (db.users.some(u => u.dni === dni)) {
    return res.status(400).json({ error: 'Usuario con este DNI ya existe' });
  }

  db.users.push({ id: db.users.length + 1, user, dni, phone, email });

  writeDB(db);
  res.status(201).json({ message: 'Usuario creado' });

});

app.get('/users/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);

  console.log('Consulta ID: ', id); 

  const userIndex = db.users.findIndex(u => u.id === id);

  if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
  } else {
    res.status(200).json(db.users[userIndex]);
  }

});

app.put('/users/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const { user, dni, phone, email } = req.body;
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    db.users[userIndex] = { id, user, dni, phone, email };

    writeDB(db);

    res.json({ message: 'Usuario modificado' });

  });

app.delete('/users/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);

  db.users = db.users.filter(u => u.id !== id);

  writeDB(db);

  res.json({ message: 'Usuario eliminado' });

});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno en el servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});