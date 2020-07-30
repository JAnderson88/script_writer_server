const bcrypt = require('bcryptjs');
const storage = require('./sessionStorage.json');
const fs = require('fs');

// class SessionStorage {
//   constructor() {
//     this.storage = {}
//     this.salt = this.generateSalt();
//   }

//   generateSalt() {
//     return bcrypt.genSalt(10);
//   }

//   async generateKey() {
//     const key = "";
//     const choiceString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
//     for (let i = 0; i < 80; i++) {
//       const index = Math.floor(Math.random() * 80);
//       key += choiceString[index]
//     }
//     return key;
//   }

//   async generateSesionKey() {
//     return bcrypt.hash(this.generateKey(), this.salt);
//   }

//   addSession(userID) {
//     this.storage[this.generateSesionKey()] = userID;
//   }

//   getSession(sessionKey){
//     return this.storage[sessionKey];
//   }
// }

// module.exports = SessionStorage;

module.exports = () => {
  async function getSalt() {
    return bcrypt.genSalt(10);
  }

  function generateKey() {
    let key = "";
    const choiceString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
    for (let i = 0; i < 80; i++) {
      const index = Math.floor(Math.random() * 80);
      key += choiceString[index]
    }
    return key;
  }

  async function generateSesionKey() {
    return bcrypt.hash(generateKey(), await getSalt())
  }

  return {
    addSession: async userId => {
      const sessionKey = await generateSesionKey();
      storage[sessionKey] = userId;
      console.log(storage);
      const newJSON = JSON.stringify(storage, null, 2)
      fs.writeFile('./Modules/SessionStorage/sessionStorage.json', newJSON, err => {
        if(err) console.log(err);
      });
      return sessionKey;
    },
    getSession: sessionKey => {
      return storage[sessionKey];
    },
    deleteSession: sessionKey => {
      console.log(storage);
      console.log(sessionKey);
      delete storage[sessionKey];
      console.log(storage);
      const newJSON = JSON.stringify(storage, null, 2);
      fs.writeFile('./Modules/SessionStorage/sessionStorage.json', newJSON, err => {
        if(err) console.log(err);
      });
    }
  }
}