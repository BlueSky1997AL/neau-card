'use strict';

const fs = require('fs');
const path = require('path');

module.exports = app => {
  class HomePageController extends app.Controller {

    async homePage() {
      const data = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
      this.ctx.body = data;
    }

  }
  return HomePageController;
};
