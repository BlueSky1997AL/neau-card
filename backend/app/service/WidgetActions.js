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

      try {
        // 获取用户的学号
        const usrInfo = await ctx.curl('https://jwc.xiaonei.io/student/get', {
          method: 'GET',
          dataType: 'json',
          headers: {
            authorization: 'aid ' + token,
          },
        });
        const stuId = usrInfo.data.stuId;

        // 如果查询得到结果, 继续执行代码
        if (stuId) {

          // 数据库查询用户余额
          const userInfo = await ctx.model.User.findOne({ stuId });

          // 如果数据库中用户信息存在, 继续执行代码
          if (userInfo) {
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
            const result = { status: true, balance, updateAt, weeklyCost, dailyRecords };

            return result;

          }

          return {
            status: false,
            balance: 0,
            updateAt: null,
            weeklyCost: 0,
            dailyRecords: [],
          };

        }

        return {
          status: false,
          balance: 0,
          updateAt: null,
          weeklyCost: 0,
          dailyRecords: [],
        };

      } catch (err) {
        return {
          status: false,
          balance: 0,
          updateAt: null,
          weeklyCost: 0,
          dailyRecords: [],
        };
      }

    }

  }
  return LoginActions;
};
