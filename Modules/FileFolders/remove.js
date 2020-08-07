const fs = require('fs');
const exists = require('./exists');

async function removeFolder(path) {
  return new Promise(resolve => {
    fs.rmdir(path, { recursive: true }, err => {
      if (err) {
        console.log(err);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

async function removeFile(path) {
  return new Promise(resolve => {
    fs.unlink(path, err => {
      if (err) {
        console.log(err);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}


module.exports = async (path, options={}) => {
  console.log(path);
  const item = await exists(path);
  if (item){
    if(options.type === 'folder') await removeFolder(path);
    if(options.type === 'file') await removeFile(path);
  } 
}