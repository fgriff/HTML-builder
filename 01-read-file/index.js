const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const rs = fs.createReadStream(filePath, { encoding: 'utf8' });

rs.on('data', (chunk) => {
  stdout.write(chunk.trim());
});

rs.on('error', (err) => {
  if (err.code === 'ENOENT') {
    stdout.write('File not found');
  }
});
