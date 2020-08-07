const fs = require('fs');

module.exports = async (path) => {
    return new Promise(resolve => {
      fs.access(path, fs.F_OK, (err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }