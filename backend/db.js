// --- backend/db.js ---
const fs = require('fs');
const DB_FILE = './db.json';

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

module.exports = { readDB, writeDB };