const path = require('path');
const fs = require('fs/promises');
const { stdout } = require('process');

const srcFolderPath = path.join(__dirname, 'files');
const destFolderPath = path.join(__dirname, 'files-copy');

const copyDir = async (src, dest) => {
  await fs.rm(dest, { recursive: true, force: true });
  await fs.mkdir(dest, { recursive: true });

  try {
    const srcFilesList = await fs.readdir(src, { withFileTypes: true });

    srcFilesList.forEach((file) => {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isFile()) {
        fs.copyFile(srcPath, destPath);
      } else {
        copyDir(srcPath, destPath);
      }
    });
  } catch (error) {
    stdout.write(error.message);
  }
};

copyDir(srcFolderPath, destFolderPath);
