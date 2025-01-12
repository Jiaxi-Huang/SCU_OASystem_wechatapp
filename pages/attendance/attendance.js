Page({
    data: {
      attendanceRecords: [], // 所有考勤记录
      filteredRecords: [], // 过滤后的考勤记录
      selectedDate: '', // 选择的日期
    },
  
    onLoad() {
      // 初始化日期为今天
      const today = new Date().toISOString().split('T')[0];
      this.setData({
        selectedDate: today,
      });
      // 加载考勤记录
      this.fetchAttendanceRecords();
    },
  
    // 监听日期选择
    onDateChange(e) {
      const selectedDate = e.detail.value;
      this.setData({
        selectedDate: selectedDate,
      });
      // 过滤考勤记录
      this.filterRecordsByDate(selectedDate);
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
          console.log('后端返回:', res.data); // 打印后端返回的数据
          if (res.statusCode === 200 && res.data && res.data.status === 0) {
            const records = res.data.data || []; // 确保 records 是数组
            that.setData({
              attendanceRecords: records,
            });
            // 初始化时过滤今天的记录
            that.filterRecordsByDate(that.data.selectedDate);
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
  
    // 根据日期过滤考勤记录
    filterRecordsByDate(date) {
      const { attendanceRecords } = this.data;
  
      // 将选择的日期格式化为 YYYY-MM-DD
      const formattedDate = this.formatDate(date);
  
      const filteredRecords = attendanceRecords.filter((record) => {
        // 将记录日期格式化为 YYYY-MM-DD
        const recordDate = this.formatDate(record.attendanceDate);
        console.log('recordDate:', recordDate, 'formattedDate:', formattedDate); // 调试输出
        return recordDate === formattedDate;
      });
  
      console.log('过滤后的记录:', filteredRecords); // 打印过滤后的记录
      this.setData({
        filteredRecords: filteredRecords,
      });
    },
  
    // 格式化日期为 YYYY-MM-DD
    formatDate(date) {
      if (!date) return '';
  
      // 如果日期是时间戳，先转换为日期对象
      const dateObj = new Date(date);
  
      // 如果 dateObj 是无效的日期对象，直接返回空字符串
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date:', date);
        return '';
      }
  
      // 格式化为 YYYY-MM-DD
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
  
      return `${year}-${month}-${day}`;
    },
  
    // 新增考勤记录
    onAddRecord() {
      wx.navigateTo({
        url: '/pages/attendance/attendance_add', // 跳转到新增页面
      });
    },
  
    // 修改考勤记录
    onModifyRecord(e) {
        const record = e.currentTarget.dataset.record; // 获取完整的考勤记录数据
        console.log('传递的数据:', record); // 打印传递的数据
        wx.navigateTo({
          url: `/pages/attendance/attendance_modify?record=${JSON.stringify(record)}`, // 将记录数据转为字符串传递
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