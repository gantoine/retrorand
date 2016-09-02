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
      this.purge();
      api.random((err, result) => {
        if (err) {
          console.log(err.stack);
        }
        this.random = result;
      });
    },

    search: function () {
      this.purge();
      api.search(this.query, (err, result) => {
        if (err) {
          console.log(err.stack);
        }
        this.found = result;
      });
    },

    clean: function (str) {
      return str.replace(/_/g, ' ');
    },

    purge: function () {
      this.random = {};
      this.found = {};
    },

    clear: function () {
      this.query = '';
    }

  }
};

module.exports = app;
