const retro = require('retro-game-names');
const thegamesdb = require('thegamesdb');
const _ = require('underscore');

var platforms = [];

thegamesdb.getPlatformsList().then(savePlatforms);

function savePlatforms(platList) {
  platforms = platList;
}

exports.home = (request, response) => {
  response.render('pages/home', {
    env: process.env.NODE_ENV
  });
};

exports.about = (request, response) => {
  response.render('pages/about', {
    env: process.env.NODE_ENV
  });
};

exports.platforms = (request, response) => {
  response.send(retro.platforms());
};

exports.random = (request, response) => {
  const result = retro.random(request.query);
  response.send(result);
};

exports.find = (request, response) => {
  const result = retro.find(request.query);
  response.send(result);
};

exports.info = (request, response) => {
  const game = request.query.game;
  const plat = _.findWhere(platforms, {alias: game.platform.replace(/_/g, '-')});
  if (plat) {
    thegamesdb.getGamesList({name: game.title, platform: plat.name}).then(fetchInfo.bind(response));
  }
};

exports.games = (request, response) => {
  response.send(retro.games(request.query.platform));
};

exports.platform = (request, response) => {
  const plat = _.findWhere(platforms, {alias: request.query.title.replace(/_/g, '-')});
  thegamesdb.getPlatform({id: plat.id}).then(sendPlatform.bind(response));
};

function fetchInfo(gamesList) {
  thegamesdb.getGame({id: _.first(gamesList).id}).then(sendInfo.bind(this));
}

function sendInfo(game) {
  this.send(game);
}

function sendPlatform(platform) {
  this.send(platform);
}
