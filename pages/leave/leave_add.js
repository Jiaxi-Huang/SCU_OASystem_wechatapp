// pages/leave/leave_add.js
Page({
  data: {
    record: {
      leave_reason: '',
      leave_type: '',
      leave_start_time: '',
      leave_end_time: '',
    },
    leave_type_options: ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假'],
    typeIndex: 0,
    startDate: '选择日期',
    startTime: '选择时间',
    endDate: '选择日期',
    endTime: '选择时间',
  },

  inputChange: function (e) {
    const field = e.target.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`record.${field}`]: value,
    });
  },

  typeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      'record.leave_type': this.data.leave_type_options[e.detail.value],
    });
  },

  startDateChange: function (e) {
    this.setData({
      startDate: e.detail.value,
    });
  },

  startTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value,
    });
  },

  endDateChange: function (e) {
    this.setData({
      endDate: e.detail.value,
    });
  },

  endTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value,
    });
  },

  applySubmit: function () {
    const that = this;
    const record = {
      accessToken: wx.getStorageSync('accessToken'),
      leave_reason: this.data.record.leave_reason,
      leave_type: this.data.record.leave_type,
      leave_start_time: this.data.startDate + ' ' + this.data.startTime,
      leave_end_time: this.data.endDate + ' ' + this.data.endTime,
      leave_status: '未审核',
    };
    wx.request({
      url: 'http://localhost:8080/api/leaveApproval/addLeaveRecord',
      method: 'POST',
      data: record,
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