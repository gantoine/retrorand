'use strict';

const Vue = require('vue');
const home = require('./views/home');
const rollbar = require('rollbar');

/* eslint-disable no-new */
/* eslint-disable no-undef */
$(document).ready(function () {
  rollbar.init('ef58c5076f0243069e325c8157bdcc44');

  new Vue(home);

  $('.modal-trigger').leanModal();
});
