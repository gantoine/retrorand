'use strict';

module.exports = {

  random(active, callback) {
    /* eslint-disable no-undef */
    $.ajax({
      url: '/random',
      data: _setData({}, active)
    }).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  },

  search(query, active, callback) {
    /* eslint-disable no-undef */
    $.ajax({
      data: _setData({title: query, ignoreCase: true}, active),
      url: '/find'
    }).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  },

  platforms(callback) {
    $.ajax({
      url: '/platforms'
    }).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  },

  info(id, callback) {
    /* eslint-disable no-undef */
    $.ajax({
      data: {id: id},
      url: '/info'
    }).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  },

  games(platform, callback) {
    $.ajax({
      data: {platform: platform},
      url: '/games'
    }).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  },

  platform(platform, callback) {
    $.ajax({
      data: {platform: platform},
      url: '/platform'
    }).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, error) {
      callback(error);
    });
  }

};

function _setData(data, active) {
  if (active.length === 1) {
    data.platform = active[0];
  } else if (active.length > 1) {
    data.platforms = active;
  }
  return data;
}
