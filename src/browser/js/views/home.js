'use strict';

const api = require('../util/api');

let app = {

  el: '.retroapp',

  data: {
    random: {},
    query: '',
    found: {},
    info: {}
  },

  methods: {

    roll: function () {
      this.purge();
      api.random((err, result) => {
        if (err) {
          console.log(err.stack);
        }
        this.random = result;
        this.gdb(result);
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
      if (str) {
        return str.replace(/_/g, ' ');
      }
    },

    purge: function () {
      this.random = {};
      this.found = {};
      this.info = {};
    },

    clear: function () {
      this.query = '';
    },

    gdb: function (game) {
      api.info(game, (err, result) => {
        if (err) {
          console.log(err.stack);
        }
        this.info = result;
      });
    }

  }
};

module.exports = app;
