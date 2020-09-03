const fs = require('fs');
const exists = require('./exists');
const { options } = require('../../API/Treatment/editTreatment');

async function updateFile(path, data){
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

module.exports = async (path, data) => {
  const file = await exists(path);
  if(file) {
    const status = await updateFile(path, data);
    return status;
  }
  return false;
}