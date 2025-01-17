const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(filePath);
const rl = readline.createInterface({ input, output });

const exit = () => {
  output.write('Have a nice day!\n');
  rl.close();
  ws.end();
};

const writeData = (text) => {
  if (text.trim() === 'exit') {
    exit();

    return;
  }

  ws.write(`${text}\n`);
};

rl.question('Hello! Please, enter some text and press Enter:\n', (text) => {
  writeData(text);
});

rl.on('line', (text) => {
  writeData(text);
});

rl.on('SIGINT', () => {
  exit();
});
