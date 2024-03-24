// Importa los módulos necesarios.
const fs = require('fs');
const path = require('path');

// Define la carpeta de imágenes y las extensiones de archivo válidas.
const imgFolder = './public/img';
const validExtensions = new Set(['.avif', '.webp', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg']);

// Función para codificar la ruta del archivo.
function encodePath(filePath) {
  return filePath.split('/').map(encodeURIComponent).join('/');
}

/**
 * Recorre un directorio y devuelve una lista de archivos válidos.
 *
 * @param {string} dir - Directorio a recorrer.
 * @param {Array} [fileList=[]] - Lista de archivos encontrados (opcional).
 * @returns {Array} - Lista de archivos válidos encontrados.
 */
function getFiles(dir, fileList = []) {
  // Lee los archivos del directorio.
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Si el archivo es un directorio, llama a la función de forma recursiva.
    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      // Si el archivo tiene una extensión válida, lo añade a la lista.
      if (validExtensions.has(path.extname(file).toLowerCase())) {
        const relativePath = filePath.replace(/^public\//, '');
        fileList.push(encodePath(relativePath));
      }
    }
  });

  // Devuelve la lista de archivos.
  return fileList;
}

// Obtiene la lista de URLs a cachear.
const urlsToCache = getFiles(imgFolder);

// Escribe la lista de URLs a cachear en un archivo JavaScript.
fs.writeFileSync('./public/urlsToCache.js', `self.__precacheManifest = ${JSON.stringify(urlsToCache.map(url => url.startsWith('/') ? url : '/' + url))};`);
