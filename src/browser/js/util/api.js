'use strict';

module.exports = {

  random(callback) {
    /* eslint-disable no-undef */
    $.ajax({
      url: '/random'
    }).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  },

  search(query, callback) {
    /* eslint-disable no-undef */
    $.ajax({
      data: {title: query},
      url: '/find'
    }).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  }

};
