const fs = require('fs');
const path = require('path');

const imgFolder = './public/img';
const validExtensions = new Set(['.avif', '.webp', '.png', '.jpg', '.jpeg', '.gif']);

function encodePath(filePath) {
  return filePath.split('/').map(encodeURIComponent).join('/');
}

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      // Comprueba si la extensión del archivo es una de las válidas
      if (validExtensions.has(path.extname(file).toLowerCase())) {
        const relativePath = filePath.replace(/^public\//, ''); // Asegúrate de que hay un / después de public para evitar errores en la ruta
        fileList.push(encodePath(relativePath));
      }
    }
  });

  return fileList;
}

const urlsToCache = getFiles(imgFolder);

fs.writeFileSync('./public/js/urlsToCache.js', `self.__precacheManifest = ${JSON.stringify(urlsToCache.map(url => url.startsWith('/') ? url : '/' + url))};`);
