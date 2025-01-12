Page({
    data: {
        attendanceRecords: [], // 所有考勤记录
        filteredRecords: [], // 过滤后的考勤记录
        selectedDate: '', // 选择的日期
        isAdminOrManager: false, // 是否是管理员或经理
    },

    onLoad() {
        // 初始化日期为今天
        const today = this.formatDate(new Date());
        console.log('初始化日期:', today); // 打印初始化日期
        this.setData({
            selectedDate: today,
        });

        // 获取用户角色信息
        this.fetchUserRole();

        // 加载考勤记录
        this.fetchAttendanceRecords();
    },

    // 获取用户角色信息
    fetchUserRole() {
        const that = this;
        const accessToken = wx.getStorageSync('accessToken');
        wx.request({
            url: 'http://localhost:8080/api/auth/user/userInfo',
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            data: {
                accessToken: accessToken,
            },
            success: function (res) {
                console.log('用户信息接口返回:', res.data);
                if (res.statusCode === 200 && res.data && res.data.status === 0) {
                    const roleName = res.data.data.roleName;
                    that.setData({
                        isAdminOrManager: roleName === 'admin' || roleName === 'manager',
                    });
                } else {
                    wx.showToast({
                        title: '获取用户信息失败',
                        icon: 'none',
                    });
                }
            },
            fail: function (err) {
                console.error('获取用户信息失败:', err);
                wx.showToast({
                    title: '网络错误，请重试',
                    icon: 'none',
                });
            },
        });
    },

    // 上班打卡
    onPunchIn() {
        const that = this;
        const accessToken = wx.getStorageSync('accessToken');

        // 直接使用默认地址“成都”
        const location = '成都';

        // 调用上班打卡接口
        wx.request({
            url: 'http://localhost:8080/api/attendance/checkInAttendance',
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
            },
            data: {
                accessToken: accessToken, // 将 accessToken 放到请求体中
                location: location, // 直接传递默认地址
            },
            success: function (res) {
                console.log('上班打卡接口返回:', res.data);
                if (res.statusCode === 200 && res.data && (res.data.status === 0 || res.data.status === -1)) {
                    wx.showToast({
                        title: res.data.status === 0 ? '上班打卡成功' : '上班打卡失败',
                        icon: res.data.status === 0 ? 'success' : 'none',
                    });
                    that.fetchAttendanceRecords(); // 刷新考勤记录
                } else {
                    wx.showToast({
                        title: '上班打卡失败',
                        icon: 'none',
                    });
                }
            },
            fail: function (err) {
                console.error('上班打卡失败:', err);
                wx.showToast({
                    title: '网络错误，请重试',
                    icon: 'none',
                });
            },
        });
    },

    // 下班打卡
    onPunchOut() {
        const that = this;
        const accessToken = wx.getStorageSync('accessToken');

        // 直接使用默认地址“成都”
        const location = '成都';

        // 调用下班打卡接口
        wx.request({
            url: 'http://localhost:8080/api/attendance/checkOutAttendance',
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
            },
            data: {
                accessToken: accessToken, // 将 accessToken 放到请求体中
                location: location, // 直接传递默认地址
            },
            success: function (res) {
                console.log('下班打卡接口返回:', res.data);
                if (res.statusCode === 200 && res.data && (res.data.status === 0 || res.data.status === -1 || res.data.status === -2)) {
                    wx.showToast({
                        title: res.data.status === 0 ? '下班打卡成功' : '下班打卡失败',
                        icon: res.data.status === 0 ? 'success' : 'none',
                    });
                    that.fetchAttendanceRecords(); // 刷新考勤记录
                } else {
                    wx.showToast({
                        title: '下班打卡失败',
                        icon: 'none',
                    });
                }
            },
            fail: function (err) {
                console.error('下班打卡失败:', err);
                wx.showToast({
                    title: '网络错误，请重试',
                    icon: 'none',
                });
            },
        });
    },

    // 获取考勤记录
    fetchAttendanceRecords() {
        const that = this;
        const accessToken = wx.getStorageSync('accessToken');

        // 调用获取考勤记录接口
        wx.request({
            url: `http://localhost:8080/api/attendance/personalAttendance?accessToken=${accessToken}`, // 将 accessToken 放到 URL query 参数中
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
            },
            success: function (res) {
                console.log('后端返回:', res.data);
                if (res.statusCode === 200 && res.data && res.data.status === 0) {
                    const records = res.data.data || [];
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
                console.error('请求失败:', err);
                wx.showToast({
                    title: '网络错误，请重试',
                    icon: 'none',
                });
            },
        });
    },

    // 日期选择器事件
    onDateChange(e) {
        const selectedDate = e.detail.value; // 获取选择的日期
        this.setData({
            selectedDate: selectedDate,
        });

        // 根据选择的日期过滤考勤记录
        this.filterRecordsByDate(selectedDate);
    },

    // 根据日期过滤考勤记录
    filterRecordsByDate(date) {
        const { attendanceRecords } = this.data;

        // 将选择的日期格式化为 YYYY-MM-DD
        const formattedDate = this.formatDate(date);

        const filteredRecords = attendanceRecords.filter((record) => {
            // 将记录日期格式化为 YYYY-MM-DD
            const recordDate = this.formatDate(record.attendanceDate.split('T')[0]); // 截取日期部分
            return recordDate === formattedDate;
        });

        console.log('过滤后的记录:', filteredRecords);
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
            url: '/pages/attendance/attendance_add',
        });
    },

    // 修改考勤记录
    onModifyRecord(e) {
        const record = e.currentTarget.dataset.record;
        console.log('传递的数据:', record);
        wx.navigateTo({
            url: `/pages/attendance/attendance_modify?record=${JSON.stringify(record)}`,
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
                            'Content-Type': 'application/json',
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
                            console.error('删除考勤记录失败:', err);
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