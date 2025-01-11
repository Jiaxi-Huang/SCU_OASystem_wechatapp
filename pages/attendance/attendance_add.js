Page({
    data: {
      attendanceDate: '', // 日期
      checkInTime: '', // 上班时间
      checkOutTime: '', // 下班时间
      status: '正常', // 状态
      statusOptions: ['正常', '迟到', '早退', '缺勤'], // 状态选项
    },
  
    // 监听日期选择
    onDateChange(e) {
      this.setData({
        attendanceDate: e.detail.value,
      });
    },
  
    // 监听上班时间选择
    onCheckInTimeChange(e) {
      this.setData({
        checkInTime: e.detail.value,
      });
    },
  
    // 监听下班时间选择
    onCheckOutTimeChange(e) {
      this.setData({
        checkOutTime: e.detail.value,
      });
    },
  
    // 监听状态选择
    onStatusChange(e) {
      this.setData({
        status: this.data.statusOptions[e.detail.value],
      });
    },
  
    // 提交表单
    onSubmit() {
      const { attendanceDate, checkInTime, checkOutTime, status } = this.data;
  
      // 表单验证
      if (!attendanceDate || !checkInTime || !checkOutTime || !status) {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none',
        });
        return;
      }
  
      // 构造请求参数
      const requestData = {
        attendanceDate,
        checkInTime,
        checkOutTime,
        status,
      };
  
      // 获取 accessToken
      const accessToken = wx.getStorageSync('accessToken');
  
      // 提交数据到后端
      wx.request({
        url: 'http://localhost:8080/api/attendance/addAttendance',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // 如果需要 token
        },
        data: requestData,
        success: (res) => {
          console.log('后端返回:', res.data); // 打印后端返回的数据
          if (res.statusCode === 200 && res.data.status === 0) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
            });
            wx.navigateBack(); // 返回上一页
          } else {
            wx.showToast({
              title: res.data.message || '添加失败',
              icon: 'none',
            });
          }
        },
        fail: (err) => {
          console.error('提交失败:', err);
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none',
          });
        },
      });
    },
  });