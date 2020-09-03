module.exports = (length) => {
  const choices = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let IDString = '';
  for(let i=0; i<length; i++){
    const random = Math.floor(Math.random() * choices.length);
    IDString += choices.charAt(random);
  }
  return IDString;
}