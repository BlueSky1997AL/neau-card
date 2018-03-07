'use strict';

module.exports = app => {
  class LoginActions extends app.Service {

    /**
     * 根据给定用户Token, 取得Widget显示所需要的信息
     * @param {String} token - 微信用户Token
     * @return {Object} Widget显示所需相关信息
     */
    async getWidgetInfo(token) {

      const ctx = this.ctx;

      // 获取用户的学号
      const usrInfo = await ctx.curl('https://jwc.xiaonei.io/student/get', {
        method: 'GET',
        dataType: 'json',
        headers: {
          authorization: 'aid ' + token,
        },
      });
      const stuId = usrInfo.data.stuId;

      // 数据库查询用户余额
      const userInfo = await ctx.model.User.findOne({ stuId });
      const balance = userInfo.balance;
      const updateAt = userInfo.updatedAt;

      // 计算得查询日期 (七日/单日)
      const now = new Date();
      const nowDate = now.getDate();
      const nowMonth = now.getMonth();
      const nowYear = now.getFullYear();
      const sevenDaysAgo = new Date(nowYear, nowMonth, nowDate - 6);
      const aDayAgo = new Date(nowYear, nowMonth, nowDate - 0);

      // 取得七日流水，根据流水信息取得一周开销
      const weeklyRecords = await ctx.model.Record.find({
        stuId,
        tradeDate: {
          $gte: sevenDaysAgo,
          $lt: now,
        },
      });
      let weeklyCost = 0;
      weeklyRecords.forEach(e => {
        weeklyCost -= parseFloat(e.cost);
      });

      // 获取今日流水信息
      const dailyRecords = await ctx.model.Record.find({
        stuId,
        tradeDate: {
          $gte: aDayAgo,
          $lt: now,
        },
      });

      // 返回数据
      const result = { balance, updateAt, weeklyCost, dailyRecords };
      console.log(result);

      return result;

    }

  }
  return LoginActions;
};
