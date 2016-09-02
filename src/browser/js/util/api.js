'use strict';

module.exports = {
  // Fetch todos from server
  random(callback) {
    /* eslint-disable no-undef */
    $.ajax('/random').done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  }
};
