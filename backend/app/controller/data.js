'use strict';

module.exports = app => {
  class DataFetcherController extends app.Controller {
    async getBasicInfo() {
      const ctx = this.ctx;
      const { cookie } = ctx.query;

      const data = await ctx.service.dataActions.getBasicInfo(cookie);
      ctx.body = data;
    }

    async getDailyExpRec() {
      const ctx = this.ctx;
      const { cookie, accountId } = ctx.query;

      const data = await ctx.service.dataActions.getDailyExpRec(cookie, accountId);
      ctx.body = data;
    }

    async getRecords() {
      const ctx = this.ctx;
      const { cookie, accountId, startDate, endDate } = ctx.query;

      const data = await ctx.service.dataActions.getRecords(cookie, accountId, startDate, endDate);
      ctx.body = data;
    }
  }
  return DataFetcherController;
};
