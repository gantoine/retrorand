'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./controllers/routes');
const morgan = require('morgan');
const helmet = require('helmet');
const rollbar = require('rollbar');

let app = express();

// Configure view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure middleware
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: false}));

// Configure rollbar
app.use(rollbar.errorHandler('122ff73002ba4a39ba23e2f13b9994a4'));

app.use(helmet({
  frameguard: {
    action: 'allow-from',
    domain: 'https://www.youtube.com'
  }
}));

// Static file serving happens everywhere but in production
// if (process.env.NODE_ENV !== 'production')
let staticPath = path.join(__dirname, '..', '..', 'public');
let consolePath = path.join(staticPath, 'images', 'consoles');
app.use('/static', express.static(staticPath));
app.use('/consoles', express.static(consolePath));

// Mount application routes
routes(app);

// Export Express webapp instance
module.exports = app;
