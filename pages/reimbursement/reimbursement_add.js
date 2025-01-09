// pages/reimbursement/reimbursement_add.js
Page({
  data: {
    record: {
      amount: '',
      description: '',
    },
  },

  inputChange: function (e) {
    const field = e.target.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`record.${field}`]: value,
    });
  },

  applySubmit: function () {
    const that = this;
    wx.request({
      url: 'http://localhost:8080/api/reimbursement/addReimbursementRecord',
      method: 'POST',
      data: {
        accessToken: wx.getStorageSync('accessToken'),
        amount: this.data.record.amount,
        description: this.data.record.description,
      },
      success: function (res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '提交成功',
          });
          wx.navigateBack();
        }
      },
    });
  },
});