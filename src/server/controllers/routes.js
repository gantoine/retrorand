const games = require('./games');

// Define handlers for application routes
module.exports = app => {
  app.get('/', games.home);
  app.get('/about', games.about);
  app.get('/random', games.random);
  app.get('/find', games.find);
  app.get('/info', games.info);
};
