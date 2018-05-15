const restify = require('restify');
const { getAlbums } = require('./db');

const server = restify.createServer();

server.get('/albums', async (req, res, next) => {
  try {
    res.send(await getAlbums());
  } catch (error) {
    next(error);
  }

});

module.exports = function () {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};