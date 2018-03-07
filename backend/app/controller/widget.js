'use strict';

module.exports = app => {
  class WidgetAPIsController extends app.Controller {

    async getWidgetInfo() {
      const ctx = this.ctx;
      const { token } = ctx.query;

      const result = await ctx.service.widgetActions.getWidgetInfo(token);
      ctx.body = result;
    }

  }
  return WidgetAPIsController;
};
