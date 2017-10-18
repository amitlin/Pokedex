var Promise = require("bluebird");
const Vue = require("vue");
const axios = require("axios");
const _ = require("lodash");

let app = new Vue({
  el: "#app",
  data: {
    db: undefined,
    loadingData: true,
    pokename: "",
    searchPokemon: undefined,
    suggestedPokemons: undefined
  },
  watch: {
    searchPokemon: function(pokename) {
      if (this.loadingData) return;
      if (pokename === undefined || pokename === null || pokename === "") return;

      this.suggestPokemons();
    }
  },
  methods: {
    // this is ran a second after the last input
    suggestPokemons: _.debounce(function() {
      this.suggestedPokemons = _.filter(this.db, o => o.identifier.startsWith(this.searchPokemon));
    }, 500)
  },

  created: async function() {
    const response = await axios.get("assets/db/formattedDB.json");

    // After db download finished
    this.db = response.data;
    this.loadingData = false;
  }
})
