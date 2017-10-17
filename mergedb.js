const pokemon = require("./app/assets/db/pokemon.json");
const desc = require("./app/assets/db/pokemon_desc.json");
const fs = require('fs');

console.log(pokemon.length);
console.log(desc.length);

pokemon.forEach(pok => {
  const possibleDescs = desc.filter(d => {
    if (d.id !== pok.id) return false;
    if (d.language_id !== 9) return false;

    return true;
  });


  if (possibleDescs.length === 0) console.log("problem with " + JSON.stringify(pok));
  else pok.description = possibleDescs[0].flavor_text;
});


fs.writeFile("db.json", JSON.stringify(pokemon), (err) => {
  if (err) console.log(err)
});
