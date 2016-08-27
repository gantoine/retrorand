const retro = require('retro-game-names');

exports.all = (request, response) => {
  response.send(retro.all);
};
