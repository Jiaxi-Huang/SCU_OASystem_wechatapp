Page({
    data: {
      form: {
        userName: '', // 员工名
        attendanceDate: '', // 考勤日期
        checkIn: '', // 上班打卡时间
        checkOut: '', // 下班打卡时间
        inLocation: '', // 上班打卡位置
        outLocation: '', // 下班打卡位置
      },
      locations: [ // 打卡位置选项
        { value: '1', label: '内网ip' },
        { value: '2', label: '成都' },
        { value: '3', label: '上海' },
        { value: '4', label: '北京' },
      ],
      rules: { // 表单验证规则
        userName: [{ required: true, message: '请输入员工名' }],
        attendanceDate: [{ required: true, message: '请选择考勤日期' }],
        checkIn: [{ required: true, message: '请输入上班打卡时间' }],
        checkOut: [{ required: true, message: '请输入下班打卡时间' }],
      },
    },
  
    // 监听员工名输入
    onUserNameInput(e) {
      this.setData({
        'form.userName': e.detail.value,
      });
    },
  
    // 监听考勤日期选择
    onDateChange(e) {
      this.setData({
        'form.attendanceDate': e.detail.value,
      });
    },
  
    // 监听上班打卡时间选择
    onCheckInTimeChange(e) {
      this.setData({
        'form.checkIn': e.detail.value,
      });
    },
  
    // 监听下班打卡时间选择
    onCheckOutTimeChange(e) {
      this.setData({
        'form.checkOut': e.detail.value,
      });
    },
  
    // 监听上班打卡位置选择
    onInLocationChange(e) {
      const index = e.detail.value; // 获取选中的索引
      const selectedLocation = this.data.locations[index].label; // 获取对应的 label
      this.setData({
        'form.inLocation': selectedLocation, // 保存 label
      });
    },
  
    // 监听下班打卡位置选择
    onOutLocationChange(e) {
      const index = e.detail.value; // 获取选中的索引
      const selectedLocation = this.data.locations[index].label; // 获取对应的 label
      this.setData({
        'form.outLocation': selectedLocation, // 保存 label
      });
    },
  
    // 提交表单
    onSubmit() {
      const { form, rules } = this.data;
  
      // 表单验证
      for (const key in rules) {
        if (rules[key][0].required && !form[key]) {
          wx.showToast({
            title: rules[key][0].message,
            icon: 'none',
          });
          return;
        }
      }
  
      // 构造请求参数
      const requestData = {
        userName: form.userName,
        attendanceDate: form.attendanceDate,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        inLocation: form.inLocation,
        outLocation: form.outLocation,
      };
  
      // 提交数据到后端
      wx.request({
        url: 'http://localhost:8080/api/attendance/addAttendance',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data: requestData,
        success: (res) => {
          console.log('后端返回:', res.data); // 打印后端返回的数据
          if (res.statusCode === 200 && res.data.status === 0) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
            });
  
            // 获取上一页的实例
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2]; // 上一页
  
            // 调用上一页的方法重新加载数据
            if (prevPage && prevPage.fetchAttendanceRecords) {
              prevPage.fetchAttendanceRecords();
            }
  
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