// pages/leave/leave_info.js
Page({
  data: {
    record: {},
  },

  onLoad: function (options) {
    if (options.record) {
      this.setData({
        record: JSON.parse(options.record),
      });
    }
  },

  applySubmit: function () {
    wx.navigateBack();
  },
});