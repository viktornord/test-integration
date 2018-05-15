const { Client } = require('pg');

const db = new Client({
  host: 'localhost',
  database: 'postgres',
  port: 5432,
});

module.exports = {
  db,
  getAlbums
};
async function getAlbums() {
  const { rows: albums } = await db.query('SELECT * FROM albums');

  return albums;
}