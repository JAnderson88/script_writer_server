const bcrypt = require('bcryptjs');
const storage = require('./sessionStorage.json');
const fs = require('fs');

module.exports = () => {
  async function getSalt() {
    return bcrypt.genSalt(10);
  }

  function generateKey() {
    let key = "";
    const choiceString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
    for (let i = 0; i < 80; i++) {
      const index = Math.floor(Math.random() * 80);
      key += choiceString[index];
    }
    return key;
  }

  async function generateSesionKey() {
    return bcrypt.hash(generateKey(), await getSalt());
  }

  return {
    addSession: async userId => {
      const sessionKey = await generateSesionKey();
      storage[sessionKey] = userId;
      console.log(storage);
      const newJSON = JSON.stringify(storage, null, 2);
      fs.writeFile('./Modules/SessionStorage/sessionStorage.json', newJSON, err => {
        if (err) console.log(err);
      });
      return sessionKey;
    },
    getSession: sessionKey => {
      return storage[sessionKey];
    },
    checkIfKeyExists: key => {
      if(key in storage) return true
      return false
    },
    deleteSession: (sessionKey, callback) => {
      const user = storage[sessionKey];
      const temp = {};
      console.log(storage)
      Object.keys(storage).forEach(key => {
        if (storage[key] !== user) {
          temp[key] = storage[key];
        }
      });
      fs.writeFile('./Modules/SessionStorage/sessionStorage.json', JSON.stringify(temp), err => {
        if (err) callback(err);
      });
    }
  }
};