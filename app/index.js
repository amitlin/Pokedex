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
    suggested: ""
  },
  computed: {
    suggestPokemon: function() {
      if (this.loadingData) return;
      if (this.pokename === "") return;

      const matches = _.filter(this.db, o => o.identifier.includes(this.pokename)).map(o => o.identifier);
      return matches.length !== 0 ? matches : undefined;
    }
  },

  created: async function() {
    const response = await axios.get("assets/db/formattedDB.json");
    this.db = response.data;
    console.log(this.db);
    this.loadingData = false;
  }
})
