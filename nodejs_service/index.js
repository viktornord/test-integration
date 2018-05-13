const net = require('net');
const os = require('os');
const { Writable } = require('stream');
const fs = require('fs');
const connection = net.createConnection({ port: 3000 });
connection.on('connect', () => {
  // connection.write('USER admin');
  // connection.write('PASS admin');
  // connection.write('RETR albums.csv');
});
class ChunksToLines extends Writable {
  constructor(options) {
    super(options);
    this.line = '';
  }

  write(chunk) {
    const lines = [];
    const [currentLine, ...restLines] = chunk.toString().split(os.EOL);
    lines.push(`${this.line}${currentLine}`);
    if (restLines.length > 0) {
      // reset current line to be a last of rest lines
      this.line = restLines.pop() || '';
      // grab all rest lines except the last one excluded above
      restLines.length > 0 && lines.push(...restLines);
    }
  }
}

connection.pipe(new ChunksToLines());

