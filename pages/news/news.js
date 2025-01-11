Page({
    data: {
      pendingTodos: [], // 待办事项
      pendingLeaveApprovals: [], // 请假审批
      pendingReimbursement: [], // 报销
      pendingMeetings: [], // 会议
    },
  
    onLoad() {
      this.getTodos();
      this.getLeaveApprovals();
      this.getReimbursements();
      this.getMeetings();
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
        url: '/pages/todo/todo',
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