'use strict';

const Vue = require('vue');
const home = require('./views/home');

/* eslint-disable no-new */
/* eslint-disable no-undef */
$(document).ready(function () {
  new Vue(home);

  $('.modal-trigger').leanModal();
});
