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
     * Judge a string is empty or not
     * @param {String} e - Target string
     * @return {String} String that is not empty
     */
    isEmpty(e) {
      if (e !== '') {
        return e;
      }
    }

    /**
     * Get basic infomation of the user
     * @param {String} cookie - Cookie string with successful login status
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
     * @param {String} cookie - Cookie string with successful login status
     * @param {String} accountId - User's account ID
     * @return {Array} Daily expense records array
     */
    async getDailyExpRec(cookie, accountId) {
      const data = await this.request('accounttodatTrjnObject.action', {
        method: 'POST',
        dataType: 'text',
        headers: { cookie },
        data: {
          account: accountId,
          inputObject: 'all',
        },
      });

      const $ = cheerio.load(data.data);
      const records = [];
      $('[class^="listbg"]').each((i, e) => {
        const tmpArr = [];
        $(e).children('td').each((i, e) => {
          tmpArr.push($(e).text().trim());
        });
        records.push({
          stuId: tmpArr[1],
          tradeDate: tmpArr[0],
          firmName: tmpArr[4],
          transactionType: tmpArr[3],
          cost: tmpArr[6],
          balance: tmpArr[7],
        });
      });

      // database

      return records;
    }

  }
  return LoginActions;
};
