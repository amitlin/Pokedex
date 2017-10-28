var Promise = require("bluebird");
const Vue = require("vue");
const axios = require("axios");
const _ = require("lodash");


// components
const pokelist = require('./components/pokelist/component');
const pokemenu = require('./components/pokeMenu/component');


let app = new Vue({
  el: "#app",
  components: {
    pokelist,
    pokemenu
  },
  data: {
    db: undefined,
    loading: true,
    searchPokemon: "",
    suggestedPokemons: [],
    selectedPokemon: "",
    renderPokemon: false,
  },
  watch: {
    // We use' 'watch' for this because 'computed' and 'methods' expect an immediate return,
    // while what we are doing here is an async operation (debounce) with no immediate return
    searchPokemon: function(pokename) {
      if (this.loading) return;

      pokename = pokename.toLowerCase();
      this.suggestPokemons();
    }
  },

  methods: {
    // this is ran 500ms after the last keyboard input
    suggestPokemons: _.debounce(function() {
      if (this.searchPokemon === "") {
        this.clearSelectedPokemon();
        return;
      }

      this.suggestedPokemons = _.filter(this.db, o => o.identifier.startsWith(this.searchPokemon));

      if (this.suggestedPokemons.length === 0) {
        this.clearSelectedPokemon();
        return;
      }

      this.selectedPokemon = this.suggestedPokemons[0];
      this.renderPokemon = true;
    }, 500),

    clearSelectedPokemon: function() {
      this.suggestedPokemons = [];
      this.selectedPokemon = "";
      this.renderPokemon = false;
    },
  },

  created: async function() {
    const response = await axios.get("assets/db.json");

    // After db download finished
    this.db = response.data;
    this.loading = false;
  }
});
