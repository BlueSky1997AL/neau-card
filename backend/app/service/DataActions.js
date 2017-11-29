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
     * HTML parser
     * @param {String} html - HTML data
     * @return {Array} Expense records array
     */
    recordParser(html) {
      const $ = cheerio.load(html);
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
          cost: tmpArr[5],
          balance: tmpArr[6],
        });
      });

      return records;
    }

    /**
     * Get total page number and cost
     * @param {String} html - HTML data
     * @return {Object} An Object including total page number and total cost
     */
    getBrief(html) {
      const $ = cheerio.load(html);

      const content = $($('.bl')[1]).text().split(/共|页|\-|\（/);
      return {
        totalPages: content[4],
        totalCost: content[2],
      };
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

    /**
     * Get expense records with specific date quantum from website
     * @param {String} cookie - Cookie string with successful login status
     * @param {String} accountId - User's account ID
     * @param {String} startDate - Query start date
     * @param {String} endDate - Query end date
     * @return {Array} Expense records array
     */
    async getRecords(cookie, accountId, startDate, endDate) {
      // get continue string
      const data0 = await this.request('accounthisTrjn.action', {
        method: 'GET',
        dataType: 'text',
        headers: { cookie },
      });

      const $0 = cheerio.load(data0.data);
      const continue0 = $0('#accounthisTrjn').attr('action').split('=')[1];

      // post account ID and trade type
      const data1 = await this.request(`accounthisTrjn.action?__continue=${continue0}`, {
        method: 'POST',
        dataType: 'text',
        headers: { cookie },
        data: {
          account: accountId,
          inputObject: 'all',
        },
      });

      const $1 = cheerio.load(data1.data);
      const continue1 = $1('#accounthisTrjn').attr('action').split('=')[1];

      // post query date quantum
      const data2 = await this.request(`accounthisTrjn.action?__continue=${continue1}`, {
        method: 'POST',
        dataType: 'text',
        headers: { cookie },
        data: {
          inputStartDate: startDate,
          inputEndDate: endDate,
        },
      });

      const $2 = cheerio.load(data2.data);
      const continue2 = $2('form').attr('action').split('=')[1];

      // get first page of data
      const data = await this.request(`accounthisTrjn.action?__continue=${continue2}`, {
        method: 'POST',
        dataType: 'text',
        headers: { cookie },
      });

      const records = [];

      const brief = this.getBrief(data.data);
      records.push(...this.recordParser(data.data));

      for (let i = 2; i <= brief.totalPages; i++) {
        const tmpRecords = await this.getDataByPageNum(cookie, startDate, endDate, i);
        records.push(...tmpRecords);
      }

      return records;
    }

    /**
     * Sample description
     * @param {String} cookie - Sample description
     * @param {String} startDate - Sample description
     * @param {String} endDate - Sample description
     * @param {Number} pageNum - Sample description
     * @return {Array} Sample description
     */
    async getDataByPageNum(cookie, startDate, endDate, pageNum) {
      const data = await this.request('accountconsubBrows.action', {
        method: 'POST',
        dataType: 'text',
        headers: { cookie },
        data: {
          inputStartDate: startDate,
          inputEndDate: endDate,
          pageNum,
        },
      });

      const records = this.recordParser(data.data);

      return records;
    }

  }
  return LoginActions;
};
