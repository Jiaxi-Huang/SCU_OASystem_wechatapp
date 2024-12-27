Page({
  data: {
    userId:null,
    userName: '',
    userDepartment: '', // 存储部门的key
    userRole: '',       // 存储职能的key
    departmentIndex: 0, // 当前选择的部门索引
    roleIndex: 0,       // 当前选择的职能索引
    departmentOptions: [],
    roleOptions: []
  },

  onLoad: function (options) {
    this.parseOptions(options);
    this.fetchData();
  },

  parseOptions: function (options) {
    this.setData({
      userId: decodeURIComponent(options.userId || ''),
      userName: decodeURIComponent(options.userName || ''),
      userDepartment: decodeURIComponent(options.userDepartment || ''),
      userRole: decodeURIComponent(options.userRole || '')
    });
  },

  fetchData: function () {
    const departments = [
      { key: 'IT', value: '研发部' },
      { key: 'Market', value: '市场部' },
      { key: 'HR', value: '人事部' }
    ];
    const roles = [
      { key: 'admin', value: '管理员' },
      { key: 'manager', value: '部门经理' },
      { key: 'worker', value: '员工' }
    ];
    let departmentIndex = 0;
    let roleIndex = 0;
    // 设置默认选中的索引
    departments.forEach((item, index) => {
      if (item.key === this.data.userDepartment) {
        departmentIndex = index;
      }
    });

    roles.forEach((item, index) => {
      if (item.key === this.data.userRole) {
        roleIndex = index;
      }
    });

    this.setData({
      departmentOptions: departments,
      roleOptions: roles,
      departmentIndex: departmentIndex,
      roleIndex: roleIndex
    });
  },

  // 绑定部门选择变化事件
  bindDepartmentChange(e) {
    const index = e.detail.value;
    const selectedDepartment = this.data.departmentOptions[index];
    this.setData({
      userDepartment: selectedDepartment.key,
      departmentIndex: index
    });
  },

  // 绑定职能选择变化事件
  bindRoleChange(e) {
    const index = e.detail.value;
    const selectedRole = this.data.roleOptions[index];
    this.setData({
      userRole: selectedRole.key,
      roleIndex: index
    });
  },

  // 提交表单事件
  applySubmit() {
    wx.showModal({
      title: '提示',
      content: '确认要修改该记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'http://localhost:8080/api/admin/user/update',
            method: 'POST',
            data: {
              userId: this.data.userId,
              userName: this.data.userName,
              userDepartment: this.data.userDepartment,
              userRole: this.data.userRole,
              accessToken: wx.getStorageSync('accessToken')
            },
            success: (response) => {
              wx.showToast({
                title: '修改成功',
              })
              wx.navigateBack();
            },
            fail: (error) => {
              console.error("修改失败:", error);
            }
          });
        }
      }
    });
  },

  // 输入框变化事件
  inputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  }
});