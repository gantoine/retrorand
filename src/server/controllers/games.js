const retro = require('retro-game-names');

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

exports.random = (request, response) => {
  const result = retro.random(request.query);
  response.send(result);
};

exports.find = (request, response) => {
  const result = retro.find(request.query);
  response.send(result);
};
