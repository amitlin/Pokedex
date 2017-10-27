var Promise = require("bluebird");
const Vue = require("vue");
const axios = require("axios");
const _ = require("lodash");


// components
const pokelist = require('./components/pokelist/component.js');


let app = new Vue({
  el: "#app",
  components: {
    pokelist
  },
  data: {
    db: undefined,
    loading: true,
    searchPokemon: "",
    suggestedPokemons: [],
    selectedPokemon: {},
    renderPokemon: false
  },
  watch: {
    // We use' 'watch' for this because 'computed' and 'methods' expect an immediate return,
    // while what we are doing here is an async operation (debounce) with no immediate return
    searchPokemon: function(pokename) {
      if (this.loading) return;

      pokename = pokename.toLowerCase();
      console.log(pokename);
      this.suggestPokemons();
    },
    suggestedPokemons: function(pokemonList) {
      if (pokemonList.length === 0) {
        this.selectedPokemon = "";
        return;
      }

      this.selectedPokemon = pokemonList[0];
    },
    selectedPokemon: function(selected) {
      if (!_.isEmpty(selected)) this.renderPokemon = true;
      else this.renderPokemon = false;
    }
  },

  methods: {
    // this is ran 500ms after the last keyboard input
    suggestPokemons: _.debounce(function() {
      if (this.searchPokemon === "") {
        this.suggestedPokemons = [];
        return;
      }

      this.suggestedPokemons = _.filter(this.db, o => o.identifier.startsWith(this.searchPokemon));
    }, 500)
  },

  created: async function() {
    const response = await axios.get("assets/db.json");

    // After db download finished
    this.db = response.data;
    this.loading = false;
  }
})
