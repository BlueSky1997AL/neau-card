'use strict';

module.exports = app => {
  class DataFetcherController extends app.Controller {
    async getBasicInfo() {
      const ctx = this.ctx;
      const cookie = ctx.query.cookie;

      const data = await ctx.service.dataActions.getBasicInfo(cookie);
      return data;
    }

    async getDailyExpRec() {
      const ctx = this.ctx;
      const cookie = ctx.query.cookie;

      const data = await ctx.service.dataActions.getDailyExpRec(cookie);
      return data;
    }
  }
  return DataFetcherController;
};
