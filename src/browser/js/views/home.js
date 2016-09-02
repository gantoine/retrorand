'use strict';

const api = require('../util/api');

let app = {

  el: '.retroapp',

  data: {
    random: {},
    query: '',
    found: {}
  },

  methods: {

    roll: function () {
      api.random((err, result) => {
        if (err) {
          console.log(err.stack);
        }
        this.random = result;
      });
    },

    search: function () {
      api.search(this.query, (err, result) => {
        if (err) {
          console.log(err.stack);
        }
        this.found = result;
      });
    },

    clean: function (str) {
      return str.replace(/_/g, ' ');
    }

  }
};

module.exports = app;
