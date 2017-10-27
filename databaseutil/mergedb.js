const fs = require('fs');
const _ = require('lodash');


console.log("Loading base pokemon data");
const pokemon = require("./database tables/JSON/pokemon.json");

console.log("Loading pokemon descriptions");
const descriptions = require("./database tables/JSON/pokemon_descriptions.json");

console.log("Loading pokemon stats");
const stats = require('./database tables/JSON/pokemon_stats.json');

console.log("Loading pokemon types");
const types = require('./database tables/JSON/pokemon_types.json');

console.log("Loading stat names");
const statnames = {
  "HP": 1,
  "Attack": 2,
  "Defense": 3,
  "Special Attack": 4,
  "Special Defense": 5,
  "Speed": 6,
  "Accuracy": 7,
  "Evasion": 8
}
console.log("Loading type names");
const typenames = require('./database tables/JSON/type_names.json');



const formattedDB = [];


pokemon.forEach(pok => {
    let shouldInsert = true;

    // delete unndeeded keys
    delete pok['order'];
    delete pok['species_id'];
    delete pok['base_experience'];
    delete pok['is_default'];
    pok['stats'] = {};
    pok['types'] = [];


    const description = _.find(descriptions, {species_id: pok.id, language_id: 9});
    if (description === undefined) {
      console.log(pok['identifier'] + " has no description, skipping insert");
      shouldInsert = false;
      return;
    }

    pok['description'] = description.flavor_text.replace(/(\n|\f)/g," ");

    _.keys(statnames).forEach(stat => {
      stat_entry = _.find(stats, {pokemon_id: pok.id, stat_id: statnames[stat]});
      if (stat_entry === undefined) {
        console.log(pok['identifier'] + " has no stat '" + stat + "', but pokemon will still be inserted to db");
        return;
      }

      pok['stats'][stat] = stat_entry.base_stat;
    });


    const type_entries = _.filter(types, {pokemon_id: pok.id});
    if (type_entries.length === 0) {
      console.log(pok['identifier'] + " has no pokemon type, skipping insert");
      shouldInsert = false;
      return;
    }

    type_entries.forEach(type => {
      const typename = _.find(typenames, {id: type.type_id});

      if (typename === undefined) {
        console.log(pok['identifier'] + " has a missing type name, but pokemon will still be inserted to db");
        return;
      }

      pok['types'].push(typename.identifier);
    });


    if (pok['types'].length === 0) {
        console.log(pok['identifier'] + " has no types, skipping entry");
        shouldInsert = false;
        return;
    }


    if (shouldInsert) {
      formattedDB.push(pok)
    }

});


fs.writeFile("db.json", JSON.stringify(formattedDB), (err) => {
  if (err) console.log(err)

  console.log("finished");
});
