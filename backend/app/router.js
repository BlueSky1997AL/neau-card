'use strict';

module.exports = app => {
  app.get('/api/cookie', 'login.getCookie');
  app.get('/api/captcha', 'login.getCaptcha');
  app.get('/api/login', 'login.login');
  app.get('/api/cet', 'login.cet');
  app.get('/api/payForCET', 'login.payForCET');

  app.get('/api/basicInfo', 'data.getBasicInfo');
  app.get('/api/dailyRecords', 'data.getDailyExpRec');
  app.get('/api/records', 'data.getRecords');

  app.get('/api/usrInfo', 'login.getUsrInfo');

  app.get('/api/widget/info', 'widget.getWidgetInfo');

  app.get('/', 'home.homePage');
};
