'use strict';

module.exports = app => {
  app.get('/cookie', 'login.getCookie');
  app.get('/captcha', 'login.getCaptcha');
  app.get('/login', 'login.login');

  app.get('/basicInfo', 'data.getBasicInfo');
  app.get('/dailyRecords', 'data.getDailyExpRec');
};
