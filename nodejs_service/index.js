const fs = require('fs');
const os = require('os');
const { Writable } = require('stream');

const { Client } = require('pg');
const ftp = require('basic-ftp');


const db = new Client({
  host: 'localhost',
  database: 'postgres',
  port: 5432,
});

async function ftpConnect() {
  const client = new ftp.Client();
  await client.connect('localhost', 7002);
  console.log('connected to the ftp service');
  await client.login('foo', 'bar');
  console.log('authorized to the ftp service');
  await client.download(new ChunksToLines(), '/files/albums.csv');
  client.close()
}

db.connect()
  .then(() => console.log('connected to the db service'))
  .then(ftpConnect)
  .catch(console.error);



class ChunksToLines extends Writable {
  constructor(options) {
    super(options);
    this.line = '';
    this.consumedLines = 0;
  }

  async write(chunk) {
    const lines = [];
    const [currentLine, ...restLines] = chunk.toString().split(os.EOL);
    if (this.consumedLines > 0) {
      lines.push(`${this.line}${currentLine}`);
    }
    if (restLines.length > 0) {
      // reset current line to be a last of rest lines
      this.line = restLines.pop() || '';
      // grab all rest lines except the last one excluded above
      restLines.length > 0 && lines.push(...restLines);
      this.consumedLines += restLines.length;
    }
    for (const line of lines) {
      const [name, year, US_peak_chart_post] = line.split(',').map(val => val.trim());
      const query = `INSERT INTO albums VALUES ('${name}', ${year}, '${US_peak_chart_post}')`;
      await db.query(query);
      console.log('>>>> ', query);
    }
    console.log('processed', lines);
  }
}


