'use strict';

const cheerio = require('cheerio');

module.exports = app => {
  class LoginActions extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.config = this.ctx.app.config.login;
      this.serverUrl = this.config.serverUrl;
      this.curlOpts = this.ctx.app.config.curlOpts;
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

    /**
     * 根据 token 获取用户信息请求转发
     * @param {String} token - 需要查询信息的token
     * @return {Object} 查询结果
     */
    async getUsrInfo(token) {
      const info = await this.ctx.curl('https://jwc.xiaonei.io/student/get', {
        method: 'GET',
        dataType: 'json',
        headers: {
          authorization: 'aid ' + token,
        },
      });
      return info.data;
    }

    /**
     * 获取用户的四六级缴费信息
     * @param {String} cookie 用户登陆成功的 Cookie 字符串
     * @return {Object} 用户缴费信息, 缴费id
     */
    async cet(cookie) {
      try {
        // 获取用户四六级缴费信息 HTML 数据
        const info = await this.request('stusljfeelist.action', {
          method: 'GET',
          dataType: 'text',
          headers: { cookie },
        });

        const $ = cheerio.load(info.data);

        // 解析学生信息
        const infoArr = [];
        $('#tables tr[class="listbg"] td').each((i, e) => {
          infoArr.push($(e).text());
        });
        const stuInfo = {
          stuId: infoArr[0],
          name: infoArr[1],
          class: infoArr[2],
          gender: infoArr[3],
          idNo: infoArr[4],
          lang: infoArr[5],
          category: infoArr[6],
          fee: infoArr[7],
          status: infoArr[8].trim(),
        };

        let linkId = null;
        // 获取缴费操作的 id 信息
        if (stuInfo.status === '未缴费') {
          linkId = $('#tables tr[class="listbg"] a').attr('href').split('id=')[1];
        }

        return { stuInfo, linkId };
      } catch (error) {
        console.log(error);
        return {
          stuInfo: null,
          linkId: null,
        };
      }
    }

    /**
     * 四六级缴费请求
     * @param {String} cookie 登陆成功的 Cookie 信息
     * @param {String} id 操作 ID 值
     * @param {String} passwd 用户登陆密码
     * @return {Object} 操作响应信息
     */
    async payForCET(cookie, id, passwd) {
      try {
        const data0 = await this.request('sljfeeload.action', {
          method: 'GET',
          dataType: 'text',
          headers: { cookie },
          data: { id },
        });

        const $0 = cheerio.load(data0.data);

        const data1 = await this.request('sljJiaofeido.action', {
          method: 'POST',
          dataType: 'text',
          headers: { cookie },
          data: {
            id,
            merc: $0('input[name="merc"]').val(),
            sno: $0('input[name="sno"]').val(),
            name: $0('input[name="name"]').val(),
            idno: $0('input[name="idno"]').val(),
            yz: $0('input[name="yz"]').val(),
            jib: $0('input[name="jib"]').val(),
            bmf: $0('input[name="bmf"]').val(),
            passwd,
          },
        });

        const $1 = cheerio.load(data1.data);

        return { msg: $1('p[class="biaotou"]').text() };
      } catch (error) {
        return { msg: '操作失败，请重试或联系开发人员以解决此问题' };
      }
    }
  }
  return LoginActions;
};
