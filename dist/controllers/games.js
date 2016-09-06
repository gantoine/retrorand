'use strict';

var retro = require('retro-game-names');
var thegamesdb = require('thegamesdb');
var _ = require('underscore');

var platforms = [];

thegamesdb.getPlatformsList().then(savePlatforms);

function savePlatforms(platList) {
  platforms = platList;
}

exports.home = function (request, response) {
  response.render('pages/home', {
    env: process.env.NODE_ENV
  });
};

exports.about = function (request, response) {
  response.render('pages/about', {
    env: process.env.NODE_ENV
  });
};

exports.platforms = function (request, response) {
  response.send(retro.platforms());
};

exports.random = function (request, response) {
  var result = retro.random(request.query);
  response.send(result);
};

exports.find = function (request, response) {
  var result = retro.find(request.query);
  response.send(result);
};

exports.info = function (request, response) {
  var game = request.query.game;
  var plat = _.findWhere(platforms, { alias: game.platform.replace(/_/g, '-') });
  if (plat) {
    thegamesdb.getGamesList({ name: game.title, platform: plat.name }).then(fetchInfo.bind(response));
  }
};

exports.games = function (request, response) {
  response.send(retro.games(request.query.platform));
};

exports.platform = function (request, response) {
  var plat = _.findWhere(platforms, { alias: request.query.title.replace(/_/g, '-') });
  thegamesdb.getPlatform({ id: plat.id }).then(sendPlatform.bind(response));
};

function fetchInfo(gamesList) {
  thegamesdb.getGame({ id: _.first(gamesList).id }).then(sendInfo.bind(this));
}

function sendInfo(game) {
  this.send(game);
}

function sendPlatform(platform) {
  this.send(platform);
}