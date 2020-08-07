const fs = require('fs');
const folderExists = require('./folderExists');
// const removeFolder = require('../FileFolders/removeFolder');

async function removeFolder(path){
  return new Promise(resolve => {
    fs.rmdir(path, {recursive: true}, err => {
      if(err) {
        console.log(err);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

module.exports = async (path) => {
  console.log(path);
  const folder = await folderExists(path);
  if (folder) await removeFolder(path)
}