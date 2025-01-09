// pages/leave/leave_modify.js
Page({
  data: {
    record: {},
    leave_type_options: ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假'],
    typeIndex: 0,
    startDate: '选择日期',
    startTime: '选择时间',
    endDate: '选择日期',
    endTime: '选择时间',
    statusOptions: ['未审核', '已通过', '未通过'],
    statusIndex: 0,
  },

  onLoad: function (options) {
    if (options.record) {
      const record = JSON.parse(options.record);
      const typeIndex = this.data.leave_type_options.indexOf(record.leave_type);
      const statusIndex = this.data.statusOptions.indexOf(record.leave_status);
      this.setData({
        record: record,
        typeIndex: typeIndex,
        statusIndex: statusIndex,
        startDate: record.leave_start_time.split(' ')[0],
        startTime: record.leave_start_time.split(' ')[1],
        endDate: record.leave_end_time.split(' ')[0],
        endTime: record.leave_end_time.split(' ')[1],
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

  statusChange: function (e) {
    this.setData({
      statusIndex: e.detail.value,
      'record.leave_status': this.data.statusOptions[e.detail.value],
    });
  },

  applySubmit: function () {
    const that = this;
    const record = {
      leave_id: this.data.record.leave_id,
      leave_reason: this.data.record.leave_reason,
      leave_type: this.data.record.leave_type,
      leave_start_time: this.data.startDate + ' ' + this.data.startTime,
      leave_end_time: this.data.endDate + ' ' + this.data.endTime,
      leave_status: this.data.record.leave_status,
    };
    wx.request({
      url: 'http://localhost:8080/api/leaveApproval/modifyLeaveRecord',
      method: 'POST',
      data: record,
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