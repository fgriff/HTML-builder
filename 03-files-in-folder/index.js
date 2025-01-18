const path = require('path');
const fs = require('fs/promises');
const { stat } = require('fs');
const { stdout } = require('process');

const folderPath = path.join(__dirname, 'secret-folder');

const getFilesInfo = async () => {
  try {
    const filesList = await fs.readdir(folderPath, { withFileTypes: true });

    filesList.forEach((file) => {
      const filePath = path.join(folderPath, file.name);

      stat(filePath, (err, stats) => {
        if (err) {
          stdout.write('File not found\n');

          return;
        }

        if (stats.isFile()) {
          const fileName = path.parse(filePath).name;
          const fileExt = path.extname(file.name).slice(1);
          stdout.write(`${fileName} - ${fileExt} - ${stats.size} bytes\n`);
        }
      });
    });
  } catch (error) {
    stdout.write(error.message);
  }
};

getFilesInfo();
