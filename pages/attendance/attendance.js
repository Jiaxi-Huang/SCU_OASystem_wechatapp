Page({
    data: {
      attendanceRecords: [], // 考勤记录
    },
  
    onLoad() {
      const accessToken = wx.getStorageSync('accessToken');
      console.log('AccessToken:', accessToken); // 打印 accessToken
      this.fetchAttendanceRecords();
    },
  
    // 获取考勤记录
    fetchAttendanceRecords() {
      const that = this;
      const accessToken = wx.getStorageSync('accessToken');
      wx.request({
        url: `http://localhost:8080/api/attendance/personalAttendance?accessToken=${accessToken}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json', // 设置请求头
        },
        success: function (res) {
          console.log('Response:', res.data); // 打印后端返回的数据
          if (res.statusCode === 200 && res.data && res.data.status === 0) {
            const records = res.data.data || []; // 确保 records 是数组
            that.setData({
              attendanceRecords: records,
            });
          } else {
            wx.showToast({
              title: '获取考勤记录失败',
              icon: 'none',
            });
          }
        },
        fail: function (err) {
          console.error('请求失败:', err); // 打印完整的错误信息
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none',
          });
        },
      });
    },
  
    // 新增考勤记录
    onAddRecord() {
      wx.navigateTo({
        url: '/pages/attendance/attendance_add', // 跳转到新增页面
      });
    },
  
    // 修改考勤记录
    onModifyRecord(e) {
      const recordId = e.currentTarget.dataset.record.id;
      wx.navigateTo({
        url: `/pages/attendance/attendance_modify?id=${recordId}`, // 跳转到修改页面，并传递记录ID
      });
    },
  
    // 删除考勤记录
    onDeleteRecord(e) {
      const recordId = e.currentTarget.dataset.record.id;
      const that = this;
      wx.showModal({
        title: '提示',
        content: '确认要删除该考勤记录吗？',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: `http://localhost:8080/api/attendance/delAttendance?id=${recordId}`,
              method: 'POST',
              header: {
                'Content-Type': 'application/json', // 设置请求头
              },
              success(res) {
                if (res.statusCode === 200 && res.data.status === 0) {
                  wx.showToast({
                    title: '删除成功',
                  });
                  that.fetchAttendanceRecords(); // 刷新考勤记录
                } else {
                  wx.showToast({
                    title: '删除失败',
                    icon: 'none',
                  });
                }
              },
              fail(err) {
                console.error('删除考勤记录失败:', err); // 打印完整的错误信息
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                });
              },
            });
          }
        },
      });
    },
  });