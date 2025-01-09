// pages/reimbursement/reimbursement_modify.js
Page({
  data: {
    record: {},
    statusOptions: ['未审核', '已通过', '未通过'],
    statusIndex: 0,
  },

  onLoad: function (options) {
    if (options.record) {
      const record = JSON.parse(options.record);
      const statusIndex = this.data.statusOptions.indexOf(record.status);
      this.setData({
        record: record,
        statusIndex: statusIndex,
      });
    }
  },

  inputChange: function (e) {
    const field = e.target.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`record.${field}`]: value,
    });
  },

  statusChange: function (e) {
    const index = e.detail.value;
    this.setData({
      statusIndex: index,
      'record.status': this.data.statusOptions[index],
    });
  },

  applySubmit: function () {
    const that = this;
    wx.request({
      url: 'http://localhost:8080/api/reimbursement/modifyReimbursementRecord',
      method: 'POST',
      data: this.data.record,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '修改成功',
          });
          wx.navigateBack();
        }
      },
    });
  },
});