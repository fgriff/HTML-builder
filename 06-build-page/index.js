const path = require('path');
const fsp = require('fs/promises');
const fs = require('fs');
const { stdout } = require('process');
const os = require('os');

const destFolderPath = path.join(__dirname, 'project-dist');
const srcTemplatePath = path.join(__dirname, 'template.html');
const srcComponentsPath = path.join(__dirname, 'components');
const destIndexPath = path.join(destFolderPath, 'index.html');
const srcStylesPath = path.join(__dirname, 'styles');
const destStylesPath = path.join(destFolderPath, 'style.css');
const srcAssetsPath = path.join(__dirname, 'assets');
const destAssetsPath = path.join(destFolderPath, 'assets');

// ***** Copy assets *****

const copyAssets = async (src, dest) => {
  try {
    await fsp.mkdir(dest, { recursive: true });
    const srcFilesList = await fsp.readdir(src, { withFileTypes: true });

    srcFilesList.forEach((file) => {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isFile()) {
        fsp.copyFile(srcPath, destPath);
      } else {
        copyAssets(srcPath, destPath);
      }
    });
  } catch (error) {
    stdout.write(error.message);
  }
};

// ***** Create HTML *****

const createHtml = async (componentsPath, templatePath, indexPath) => {
  try {
    const srcFilesList = await fsp.readdir(componentsPath, {
      withFileTypes: true,
    });
    let template = await fsp.readFile(templatePath, {
      encoding: 'utf-8',
    });

    await Promise.all(
      srcFilesList.map((file) => {
        if (file.isFile() && path.extname(file.name).slice(1) === 'html') {
          return new Promise((resolve) => {
            const componentPath = path.join(componentsPath, file.name);
            const componentName = path.parse(componentPath).name;

            fsp
              .readFile(componentPath, {
                encoding: 'utf-8',
              })
              .then((result) => {
                template = template.replaceAll(`{{${componentName}}}`, result);
                resolve();
              });
          });
        }
      }),
    );

    await fsp.writeFile(indexPath, template, { flags: 'w' });
  } catch (error) {
    stdout.write(error.message);
  }
};

// ***** Create CSS *****

const createCss = async (srcStyles, destStyles) => {
  try {
    const srcFilesList = await fsp.readdir(srcStyles, {
      withFileTypes: true,
    });

    const ws = fs.createWriteStream(destStyles, { flags: 'w' });

    await Promise.all(
      srcFilesList.map((file) => {
        if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
          return new Promise((resolve) => {
            const srcFilePath = path.join(srcStyles, file.name);
            const rs = fs.createReadStream(srcFilePath);

            rs.on('data', (chunk) => {
              ws.write(`${chunk}${os.EOL}`);
              resolve();
            });
          });
        }
      }),
    );
  } catch (error) {
    stdout.write(error.message);
  }
};

const removeDestDir = async (path) => {
  try {
    await fsp.rm(path, { recursive: true, force: true });
    await fsp.mkdir(path, { recursive: true });
  } catch (error) {
    stdout.write(error.message);
  }
};

const buildPage = async () => {
  await removeDestDir(destFolderPath);
  copyAssets(srcAssetsPath, destAssetsPath);
  createHtml(srcComponentsPath, srcTemplatePath, destIndexPath);
  createCss(srcStylesPath, destStylesPath);
};

buildPage();
