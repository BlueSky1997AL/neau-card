'use strict';

const cheerio = require('cheerio');

module.exports = app => {
  class LoginActions extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.config = this.ctx.app.config.login;
      this.serverUrl = this.config.serverUrl;
      this.curlOpts = this.config.curlOpts;
    }

    /**
     * Request function
     * @param {String} target - API target
     * @param {Object} options - Request options
     * @return {Object} Response data
     */
    async request(target, options) {
      const opts = Object.assign({}, this.curlOpts, options);

      const data = await this.ctx.curl(`${this.serverUrl}${target}`, opts);
      return data;
    }

    /**
     * Get cookie from the website
     * @return {String} Cookie string
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
     * Get captcha with cookie message
     * @param {String} cookie - Cookie from card.neau.edu.cn
     * @return {Buffer} Base64 image buffer
     */
    async getCaptcha(cookie) {
      const data = await this.request('getCheckpic.action', {
        method: 'GET',
        headers: { cookie },
      });

      return data.data;
    }

    /**
     * Login simulation
     * @param {String} stuId - Username
     * @param {String} psw - Password
     * @param {String} captcha - Verify code
     * @param {String} cookie - Cookie
     * @return {Object} An object including login status and messages
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
      return { status: 'failure', msg: $('.biaotou').text() };
    }
  }
  return LoginActions;
};
