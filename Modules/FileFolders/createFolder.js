const fs = require('fs');
const folderExists = require('./folderExists');
// const createFolder = require('../FileFolders/createFolder');

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

module.exports = async (path, extension, options = {}) => {
  const folder = await folderExists(path);
  if(!folder) await createFolder(path);
  console.log(`${path}/${extension}`);
  await createFolder(`${path}/${extension}`);
  return `${path}/${extension}`;
}