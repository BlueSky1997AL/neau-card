'use strict';

const cheerio = require('cheerio');

module.exports = app => {
  class LoginActions extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.config = this.ctx.app.config.login;
      this.serverUrl = this.config.serverUrl;
    }

    /**
     * Request module
     * @param {String} target - API target
     * @param {Object} options - Request options
     * @return {Object} Response content
     */
    async request(target, options) {
      const opts = Object.assign({
        // Enable when needed
        // enableProxy: true,
        // proxy: 'http://cyf.feit.me:6000',
        timeout: [ '30s', '30s' ],
      }, options);

      const result = await this.ctx.curl(`${this.serverUrl}${target}`, opts);
      return result;
    }

    /**
     * Get cookie of the website
     * @return {String} cookie date
     */
    async getCookie() {
      const data = await this.request('homeLogin.action', {
        method: 'GET',
        dataType: 'text',
      });
      const cookie = data.headers['set-cookie'][0].split(';')[0];

      return cookie;
    }

    /**
     * Get captcha of the login action
     * @param {String} cookie - Cookie from card.neau.edu.cn
     * @return {Buffer} Base64 image buffer
     */
    async getCaptcha(cookie) {
      const data = await this.request('getCheckpic.action', {
        method: 'GET',
        headers: { cookie },
      });
      const result = data.data;

      return result;
    }

    /**
     * Login Actions simulation
     * @param {String} stuId - Username of the user
     * @param {String} psw - Password of the user
     * @param {String} captcha - Verify code
     * @param {String} cookie - Cookie from the website
     * @return {Object} An object included login status and message
     */
    async login(stuId, psw, captcha, cookie) {
      const data = await this.request('loginstudent.action', {
        method: 'POST',
        dataType: 'text',
        headers: { cookie },
        data: {
          name: stuId,
          userType: 1,
          passwd: psw,
          loginType: 2,
          rand: captcha,
          'imageField.x': 0,
          'imageField.y': 0,
        },
      });

      if (data.data.includes('校园卡查询系统-持卡人查询界面')) {
        return { status: 'success', msg: '登陆成功' };
      }

      const $ = cheerio.load(data.data);
      return { status: 'fail', msg: $('.biaotou').text() };
    }
  }
  return LoginActions;
};
