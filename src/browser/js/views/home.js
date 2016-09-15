'use strict';

const api = require('../util/api');
const _ = require('underscore');

const platformIcons = [
  'atari_lynx',
  'nintendo_gameboy_advance',
  'nintendo_gameboy_color',
  'sega_game_gear',
  'nintendo_gameboy',
  'sega_master_system',
  'neo_geo_cd',
  'nintendo_entertainment_system_nes',
  'super_nintendo_snes',
  'turbografx_16'
];

/* eslint-disable no-new */
/* eslint-disable no-undef */
let app = {

  el: '.retroapp',

  data: {
    random: {},
    query: '',
    filter: '',
    found: {},
    info: {},
    platform: {},
    games: [],
    platforms: platformIcons,
    consoles: [],
    showResult: false,
    showFound: false,
    showPlatform: false,
    showError: false
  },

  created: function () {
    api.platforms((err, result) => {
      if (err) {
        console.log(err.stack);
      } else {
        this.consoles = _.difference(result, this.platforms);
      }
    });
  },

  methods: {

    roll: function () {
      this.purge();
      this.clear();

      api.random(this.active(), (err, result) => {
        if (err) {
          console.log(err.stack);
        } else {
          this.random = result;
          this.showResult = true;
          this.gdb(result);
        }
      });
    },

    search: function () {
      this.purge();
      if (this.query) {
        api.search(this.query, this.active(), (err, result) => {
          if (err) {
            console.log(err.stack);
          } else {
            this.found = result;
            this.showFound = true;
          }
        });
      }
    },

    library: function () {
      const title = this.random.platform;
      this.purge();
      this.platform.title = title;

      api.games(this.platform.title, (err, result) => {
        if (err) {
          console.log(err.stack);
        } else {
          this.games = result;
          this.showPlatform = true;
        }
      });

      api.platform(this.platform.tgdb_id, (err, result) => {
        if (err) {
          console.log(err.stack);
        } else {
          this.platform = result;
          this.platform.title = title;
          this.platform.url = `http://thegamesdb.net/platform/${title}`;

          const boxart = _.findWhere(result.images, {type: 'boxart'}) ||
            _.findWhere(result.images, {type: 'fanart'}) ||
            _.findWhere(result.images, {type: 'consoleart'});

          if (boxart) {
            this.platform.boxart = 'http://thegamesdb.net/banners/_platformviewcache' + boxart.url;
          }

          $('.materialboxed').materialbox();
        }
      });
    },

    findInfo: function (event) {
      const _target = $(event.target);
      const _key = _target.data('key') || _target.parent().data('key');
      this.random = {platform: _key};
      this.library();
    },

    gameInfo: function (event) {
      const _game = {title: $(event.target).text().trim(), platform: this.platform.title};
      this._general(_game);
    },

    foundGameInfo: function (event) {
      const _target = $(event.target);
      const _key = _target.siblings('.collection-header').first().data('key');
      const _game = {title: _target.text().trim(), platform: _key};
      this._general(_game);
    },

    _general: function (_game) {
      this.purge();
      this.random = _game;
      this.showResult = true;
      this.gdb(_game);
    },

    gdb: function (game) {
      api.info(game.tgdb_id, (err, result) => {
        if (err) {
          console.log(err.stack);
        } else if (result && result.title === this.random.title) {
          this.info = result;
          this.info.url = `http://thegamesdb.net/game/${result.id}`;

          const boxart = _.findWhere(result.images, {type: 'boxart', side: 'front'}) ||
            _.findWhere(result.images, {type: 'clearlogo'}) ||
            _.findWhere(result.images, {type: 'screenshot'});
          if (boxart) {
            this.info.boxart = 'http://thegamesdb.net/banners/_gameviewcache' + boxart.url;
          }

          if (this.info.releaseDate) {
            this.info.releaseDate = (new Date(this.info.releaseDate)).toLocaleDateString();
          }

          $('.materialboxed').materialbox();
        } else {
          this.showError = true;
          Materialize.toast('Error fetching game info!', 3000);
        }
      });
    },

    reset: function () {
      $('.platform, .platform-dry').removeClass('active');
    },

    select: function (event) {
      const _target = $(event.target);
      if ($(event.target).hasClass('card-panel')) {
        _target.toggleClass('active');
      } else {
        _target.parent('.card-panel').toggleClass('active');
      }
    },

    active: function () {
      return $('.platform.active, .platform-dry.active').find('div').map(function () {
        return $(this).data('name');
      }).get();
    },

    purge: function () {
      this.random = {};
      this.found = {};
      this.info = {};
      this.games = [];
      this.platform = {};
      this.showFound = false;
      this.showResult = false;
      this.showPlatform = false;
      this.showError = false;
    },

    clear: function () {
      this.query = '';
    },

    url: function (plat) {
      return `/consoles/${plat}.png`;
    },

    clean: function (str) {
      if (str) {
        return str.replace(/_/g, ' ');
      }
    }
  }
};

module.exports = app;
