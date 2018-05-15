const { Client } = require('pg');

const db = new Client({
  connectionString: process.env.DB_URL || 'postgresql://localhost:5432/postgres'
});

module.exports = {
  db,
  getAlbums
};
async function getAlbums() {
  const { rows: albums } = await db.query('SELECT * FROM albums');

  return albums;
}