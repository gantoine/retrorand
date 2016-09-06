'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./controllers/routes');
var morgan = require('morgan');
var helmet = require('helmet');

var app = express();

// Configure view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure middleware
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet({
  frameguard: {
    action: 'allow-from',
    domain: 'https://www.youtube.com'
  }
}));

// Static file serving happens everywhere but in production
if (process.env.NODE_ENV !== 'production') {
  var staticPath = path.join(__dirname, '..', '..', 'public');
  var consolePath = path.join(staticPath, 'images', 'consoles');
  app.use('/static', express.static(staticPath));
  app.use('/consoles', express.static(consolePath));
}

// Mount application routes
routes(app);

// Export Express webapp instance
module.exports = app;