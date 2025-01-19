const path = require('path');
const fs = require('fs/promises');
const { stdout } = require('process');

const srcFolderPath = path.join(__dirname, 'files');
const destFolderPath = path.join(__dirname, 'files-copy');

const copyDir = async (src, dest) => {
  try {
    await fs.mkdir(dest, { recursive: true });

    const destFilesList = await fs.readdir(dest, { withFileTypes: true });

    destFilesList.forEach(async (file) => {
      const destPath = path.join(dest, file.name);
      await fs.unlink(destPath);
    });

    const srcFilesList = await fs.readdir(src, { withFileTypes: true });

    srcFilesList.forEach(async (file) => {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }
    });
  } catch (error) {
    stdout.write(error.message);
  }
};

copyDir(srcFolderPath, destFolderPath);
