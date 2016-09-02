'use strict';

const api = require('../util/api');

let app = {

  el: '.retroapp',

  data: {
    random: {}
  },

  methods: {

    roll: function () {
      api.random((err, result) => {
        if (err) {
          console.log(err.stack);
        }
        this.random = result;
      });
    }

  }
};

module.exports = app;
