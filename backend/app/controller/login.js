'use strict';

module.exports = app => {
  class LoginController extends app.Controller {
    async getCookie() {
      const ctx = this.ctx;

      const cookie = await ctx.service.loginActions.getCookie();
      ctx.body = cookie;
    }

    async getCaptcha() {
      const ctx = this.ctx;
      const { cookie } = ctx.query;

      const captchaBuffer = await ctx.service.loginActions.getCaptcha(cookie);
      ctx.body = captchaBuffer;
    }

    async login() {
      const ctx = this.ctx;
      const { cookie, username, password, chkCode } = ctx.query;

      const result = await ctx.service.loginActions.login(username, password, chkCode, cookie);
      ctx.body = result;
    }
  }
  return LoginController;
};