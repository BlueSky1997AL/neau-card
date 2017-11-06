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
      const cookie = ctx.query.cookie;
      const captchaBuffer = await ctx.service.loginActions.getCaptcha(cookie);
      ctx.body = captchaBuffer;
    }

    async login() {
      const ctx = this.ctx;
      const cookie = ctx.query.cookie;
      const stuId = ctx.query.username;
      const psw = ctx.query.password;
      const captcha = ctx.query.chkCode;

      const result = await ctx.service.loginActions.login(stuId, psw, captcha, cookie);
      ctx.body = result;
    }
  }
  return LoginController;
};
