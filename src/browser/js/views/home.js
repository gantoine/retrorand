'use strict';

const api = require('../util/api');
const _ = require('underscore');

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
        this.info.url = 'http://thegamesdb.net/game/' + result.id;
        const boxart = _.findWhere(result.images, {type: 'boxart', side: 'front'}) ||
          _.findWhere(result.images, {type: 'clearlogo'}) ||
          _.findWhere(result.images, {type: 'screenshot'});
        this.info.boxart = 'http://thegamesdb.net/banners/_gameviewcache/' + boxart.url;
      });
    }

  }
};

module.exports = app;
