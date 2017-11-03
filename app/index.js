var Promise = require("bluebird");
const Vue = require("vue");
const axios = require("axios");
const _ = require("lodash");


// components
const pokeType = require('./components/pokeType/component');


let app = new Vue({
  el: "#app",
  components: {
    pokeType
  },
  data: {
    db: undefined,
    loading: true,
    displayPokemon: false,
    searchPokemon: "",
    searchResults: [],
    selectedPokemon: "",
    displayPokemon: false
  },

  watch: {
    searchPokemon: function(pokemonName) {
      pokemonName = _.trim(pokemonName);

      this.suggestPokemons(pokemonName);
    }
  },

  methods: {
    suggestPokemons: function(pokemonName) {
      if (pokemonName === "") {
        this.searchResults = [];
        return;
      }

      this.searchResults = _.filter(this.db, o => o.identifier.startsWith(pokemonName));
    },

    choosePokemon: function(pokemon) {
      this.searchPokemon = pokemon.identifier;
      this.selectedPokemon = pokemon;
      this.displayPokemon = true;
    }
  },

  created: async function() {
    const response = await axios.get("assets/db.json");

    // After db download finished
    this.db = response.data;
    this.loading = false;
  }
});