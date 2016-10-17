const retro = require('retro-game-names');
const thegamesdb = require('thegamesdb');

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

exports.games = (request, response) => {
  response.send(retro.info(request.query.platform));
};

exports.info = (request, response) => {
  thegamesdb.getGame({id: request.query.id}).then(sendInfo.bind(response));
};

exports.platform = (request, response) => {
  const plat = retro.info(request.query.platform);
  thegamesdb.getPlatform({id: plat.tgdb_id}).then(sendPlatform.bind(response));
};

function sendInfo(game) {
  this.send(game);
}

function sendPlatform(platform) {
  this.send(platform);
}
