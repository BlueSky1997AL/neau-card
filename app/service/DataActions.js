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
     * Judge a string is empty or not
     * @param {String} e - String needed to be evaluate
     * @return {String} String that is not empty
     */
    isEmpty(e) {
      if (e !== '') {
        return e;
      }
    }

    /**
     * Get basic infomation of the user
     * @param {String} cookie - Successfuly loged in cookie string
     * @return {Object} Basic information object
     */
    async getBasicInfo(cookie) {
      const data = await this.request('accountcardUser.action', {
        method: 'GET',
        dataType: 'text',
        headers: { cookie },
      });

      const $ = cheerio.load(data.data);
      const dataArr = [];
      $('.neiwen').each((i, e) => {
        dataArr.push($(e).text().trim());
      });
      const balances = dataArr[dataArr.length - 5].split(/\（|\）|\(|\)/).filter(e => this.isEmpty(e));

      return {
        accountId: dataArr[3],
        stuId: dataArr[8],
        balance: balances[0],
        transBalance: balances[2],
      };
    }

    /**
     * Get daily expense records of the user
     * @param {String} cookie - Successfuly loged in cookie string
     * @param {String} accountId - User's account ID
     * @return {Array} Daily expense records array
     */
    async getDailyExpRec(cookie, accountId) {
      const data = await this.request('accounttodatTrjnObject.action', {
        method: 'POST',
        dataType: 'text',
        headers: {
          Host: 'card.neau.edu.cn',
          Connection: 'keep-alive',
          'Content-Length': 53,
          'Cache-Control': 'max-age=0',
          Origin: 'http://card.neau.edu.cn',
          'Upgrade-Insecure-Requests': 1,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko),Chrome/62.0.3202.75 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          Referer: 'http://card.neau.edu.cn/accounttodayTrjn.action',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          Cookie: cookie,
        },
        data: {
          account: accountId,
          inputobj: 'all',
          Submit: '+%C8%B7+%B6%A8+',
        },
      });

      // parser

      return data;
    }

  }
  return LoginActions;
};
