const fs = require('fs');
const exists = require('./exists');

async function createFolder(path){
  return new Promise(resolve => {
    fs.mkdir(path, err => {
      if (err) {
        console.log(err);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

async function createFile(path, data) {
  return new Promise(resolve => {
    fs.writeFile(path, data, err => {
      if (err) {
        console.log(err);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

module.exports = async (path, extension, options = {}) => {
  const folder = await exists(path);
  if(!folder) await createFolder(path)
  if(options.type === 'folder') await createFolder(`${path}/${extension}`);
  if(options.type === 'file') {
    const entry = (options.data) ? options.data : {}
    await createFile(`${path}/${extension}`, JSON.stringify(entry));
  }
  return `${path}/${extension}`;
}