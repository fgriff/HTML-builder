const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const os = require('os');

const filePath = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(filePath);
const rl = readline.createInterface({ input, output });

const exit = () => {
  output.write(`Have a nice day!${os.EOL}`);
  rl.close();
  ws.end();
};

const writeData = (text) => {
  if (text.trim() === 'exit') {
    exit();

    return;
  }

  ws.write(`${text}${os.EOL}`);
};

rl.question(
  `Hello! Please, enter some text and press Enter:${os.EOL}`,
  (text) => {
    writeData(text);
  },
);

rl.on('line', (text) => {
  writeData(text);
});

rl.on('SIGINT', () => {
  exit();
});
