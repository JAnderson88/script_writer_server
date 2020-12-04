module.exports = (colorArray) => {
  for(let i=0; i<12; i++){
    let exists = false;
    for (let j=0; j<12; j++){
      if (i === parseInt(colorArray[j])){
        exists = true;
        break;
      }
    }
    if (exists) continue;
    return i.toString();
  }
}