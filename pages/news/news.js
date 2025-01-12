Page({
    data: {
      pendingTodos: [], // 待办事项
      pendingLeaveApprovals: [], // 请假审批
      pendingReimbursement: [], // 报销
      pendingMeetings: [], // 会议
      timer: null, // 定时器
    },
  
    onLoad() {
      this.getTodos();
      this.getLeaveApprovals();
      this.getReimbursements();
      this.getMeetings();
  
      // 启动定时器，每隔10分钟检查一次
      this.setData({
        timer: setInterval(() => {
          this.checkDeadlines();
        }, 10 * 60 * 1000) // 10分钟
      });
    },
  
    onUnload() {
      // 页面卸载时清除定时器
      if (this.data.timer) {
        clearInterval(this.data.timer);
      }
    },
  
    // 检查即将截止的事项
    checkDeadlines() {
      const now = new Date().getTime();
      const oneHourLater = now + 60 * 60 * 1000; // 1小时后
  
      // 检查待办事项
      this.data.pendingTodos.forEach(todo => {
        const todoDeadline = new Date(todo.todo_ddl).getTime(); // 使用 todo_ddl 作为截止日期
        if (todoDeadline <= oneHourLater && todoDeadline > now) {
          this.showReminder(`待办事项 "${todo.todo_title}" 即将截止`); // 使用 todo_title 作为事项名称
        }
      });
  
      // 检查请假审批
      this.data.pendingLeaveApprovals.forEach(leave => {
        const leaveDeadline = new Date(leave.end_date).getTime(); // 使用 end_date 作为截止日期
        if (leaveDeadline <= oneHourLater && leaveDeadline > now) {
          this.showReminder(`请假审批 "${leave.title}" 即将截止`);
        }
      });
    },
  
    // 显示提醒弹窗
    showReminder(message) {
      wx.showModal({
        title: '即将截止提醒',
        content: message,
        showCancel: false,
        confirmText: '知道了',
        success(res) {
          if (res.confirm) {
            console.log('用户点击了知道了');
          }
        },
      });
    },
  
    // 获取待办事项
    getTodos() {
      const that = this;
      wx.getStorage({
        key: 'accessToken',
        success(res) {
          const accessToken = res.data;
          wx.request({
            url: 'http://localhost:8080/api/todolist/getRec',
            method: 'POST',
            data: { accessToken },
            success(res) {
              if (res.statusCode === 200 && res.data.status === 0) {
                const todos = res.data.data;
                that.setData({
                  pendingTodos: todos.filter(todo => todo.todo_fin === '未完成'),
                });
              }
            },
            fail(err) {
              console.error('获取待办事项失败:', err);
            },
          });
        },
        fail(err) {
          console.error('获取 accessToken 失败:', err);
        },
      });
    },
  
    // 获取请假审批
    getLeaveApprovals() {
      const that = this;
      wx.getStorage({
        key: 'accessToken',
        success(res) {
          const accessToken = res.data;
          wx.request({
            url: 'http://localhost:8080/api/leaveApproval/getMyLeaveRecord',
            method: 'POST',
            data: { accessToken },
            success(res) {
              if (res.statusCode === 200 && res.data.status === 0) {
                const leaveApprovals = res.data.data;
                that.setData({
                  pendingLeaveApprovals: leaveApprovals.filter(leave => leave.leave_status === '待审批'),
                });
              }
            },
            fail(err) {
              console.error('获取请假审批失败:', err);
            },
          });
        },
        fail(err) {
          console.error('获取 accessToken 失败:', err);
        },
      });
    },
  
    // 获取报销
    getReimbursements() {
      const that = this;
      wx.getStorage({
        key: 'accessToken',
        success(res) {
          const accessToken = res.data;
          const role = wx.getStorageSync('role'); // 获取用户角色
          const url = role === 'admin'
            ? 'http://localhost:8080/api/reimbursement/getAdminReimbursementList'
            : 'http://localhost:8080/api/reimbursement/getReimbursementList';
  
          wx.request({
            url,
            method: 'POST',
            data: { accessToken },
            success(res) {
              if (res.statusCode === 200 && res.data.status === 0) {
                const reimbursements = res.data.data;
                that.setData({
                  pendingReimbursement: reimbursements.filter(
                    reimbursement => reimbursement.status === '未审核' || reimbursement.status === '未通过'
                  ),
                });
              }
            },
            fail(err) {
              console.error('获取报销失败:', err);
            },
          });
        },
        fail(err) {
          console.error('获取 accessToken 失败:', err);
        },
      });
    },
  
    // 获取会议
    getMeetings() {
      const that = this;
      wx.getStorage({
        key: 'accessToken',
        success(res) {
          const accessToken = res.data;
          wx.request({
            url: 'http://localhost:8080/api/meetings/getMyMeetings',
            method: 'POST',
            data: { accessToken },
            success(res) {
              if (res.statusCode === 200 && res.data.status === 0) {
                const meetings = res.data.data;
                that.setData({
                  pendingMeetings: meetings.filter(meeting => meeting.mtin_fin === '未完成'),
                });
              }
            },
            fail(err) {
              console.error('获取会议失败:', err);
            },
          });
        },
        fail(err) {
          console.error('获取 accessToken 失败:', err);
        },
      });
    },
  
    // 跳转到待办事项页面
    navigateToTodoList() {
      wx.navigateTo({
        url: '/pages/todo/todo?showUncompleted=1',
      });
    },
  
    // 跳转到请假审批页面
    navigateToLeaveApproval() {
      wx.navigateTo({
        url: '/pages/leave/leave',
      });
    },
  
    // 跳转到报销页面
    navigateToReimbursement() {
      wx.navigateTo({
        url: '/pages/reimbursement/reimbursement',
      });
    },
  
    // 跳转到会议页面
    navigateToMeetings() {
      wx.navigateTo({
        url: '/pages/meeting/meeting',
      });
    },
  });