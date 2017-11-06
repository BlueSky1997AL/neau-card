'use strict';

module.exports = app => {
  app.get('/', 'home.index');

  app.get('/getCookie', 'login.getCookie');
  app.get('/getCaptcha', 'login.getCaptcha');
  app.get('/login', 'login.login');
};
