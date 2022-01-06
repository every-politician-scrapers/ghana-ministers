const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = (id, position, startdate, enddate) => {
  qualifier = {
    P580: meta.cabinet.start,
  }

  if(startdate) qualifier['P580']  = startdate
  if(enddate)   qualifier['P582']  = enddate

  return {
    id,
    claims: {
      P39: {
        value: position,
        qualifiers: qualifier,
      }
    }
  }
}
