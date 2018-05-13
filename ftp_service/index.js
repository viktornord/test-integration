const net = require('net');
const fs = require('fs');
const path = require('path');
const server = net.createServer();

server.on('connection', client => {
  console.log('somebody is connected');
  // client.on('data', f => {
  //   console.log(x.toString());
  // });
  fs.createReadStream(path.resolve('./files/albums.csv')).pipe(client);
});

server.listen(3000, 'localhost');