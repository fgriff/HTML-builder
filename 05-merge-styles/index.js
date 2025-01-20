const path = require('path');
const fsp = require('fs/promises');
const fs = require('fs');
const { stdout } = require('process');
const os = require('os');

const createBundle = async () => {
  try {
    const srcFolderPath = path.join(__dirname, 'styles');
    const destFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
    const ws = fs.createWriteStream(destFilePath, { flags: 'w' });
    const filesList = await fsp.readdir(srcFolderPath, { withFileTypes: true });

    filesList.forEach((file) => {
      if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
        const srcFilePath = path.join(srcFolderPath, file.name);
        const rs = fs.createReadStream(srcFilePath);

        rs.on('data', (chunk) => {
          ws.write(`${chunk}${os.EOL}`);
        });
      }
    });
  } catch (error) {
    stdout.write(error.message);
  }
};

createBundle();
