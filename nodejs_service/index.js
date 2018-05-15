const fs = require('fs');
const os = require('os');
const { Writable } = require('stream');


const ftp = require('basic-ftp');

async function connect() {
  const client = new ftp.Client();
  try {
    await client.connect('localhost', 7002);
    await client.login('foo', 'bar');
    await client.download(new ChunksToLines(), '/files/albums.csv');
  }
  catch(err) {
    console.log(err)
  }
  client.close()
}

connect();




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
    console.log('+ ', lines.length, 'lines');
  }
}


