Page({
  data: {
    userName: '',
    userDepartment: '', // 存储部门的key
    userRole: '',       // 存储职能的key
    departmentIndex: null, // 当前选择的部门索引
    roleIndex: null,       // 当前选择的职能索引
    departmentOptions: [],
    roleOptions: []
  },

  onLoad: function () {
    this.fetchData();
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
    this.setData({
      departmentOptions: departments,
      roleOptions: roles,
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
    const { userName, userDepartment, userRole } = this.data;

  if (!userName.trim()||!userDepartment.trim()||!userRole.trim()) {
    wx.showToast({
      title: '表单不能为空',
      icon: 'none'
    });
    return;
  }
    wx.request({
      url: 'http://localhost:8080/api/admin/user/add',
      method: 'POST',
      data: {
        userName: this.data.userName,
        userDepartment: this.data.userDepartment,
        userRole: this.data.userRole,
        accessToken: wx.getStorageSync('accessToken')
      },
      success: (response) => {
        wx.showToast({
          title: '添加成功',
        })
        wx.reLaunch({
          url: './user',
        });
      },
      fail: (error) => {
        console.error("添加失败:", error);
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