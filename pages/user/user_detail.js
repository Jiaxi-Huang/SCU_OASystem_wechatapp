Page({
  data: {
    userId:null,
    userName:'',
    userDepartment:'',
    userRole:'',
    userEmail:'',
    userPhone:'',
    userAvatar:'',
    userIntro:'',
    departmentMap: {
      IT: '研发部',
      Market: '市场部',
      HR: '人事部'
    },
    roleMap: {
      admin: '管理员',
      manager: '部门经理',
      worker: '员工'
    }
  },
  onLoad: function (options) { //加载数据渲染页面
    this.parseJSON(options);
    this.fetchUserInfo();
  },
  onShow() {
    // 确保每次显示页面时都加载最新的本地存储数据
    this.fetchUserInfo();
  },
  parseJSON:function(options){
    this.setData({ userId: options.id });
  },
  fetchUserInfo:function(){  //输入搜索文字
    wx.request({
      url: 'http://localhost:8080/api/admin/user/detail',
      method: 'POST',
      data:{
        accessToken:wx.getStorageSync('accessToken'),
        userId:this.data.userId
      },
      success: res=>{
        if(res.data.status == 0){
          this.setData({
            userName:res.data.data.userName,
            userDepartment:res.data.data.userDepartment,
            userRole:res.data.data.roleName,
            userEmail:res.data.data.userEmail,
            userPhone:res.data.data.userPhone,
            userAvatar:res.data.data.userAvatar,
            userIntro:res.data.data.userIntro,
          })
        }
        else{
          wx.showToast({
            title: res.data.message,
          })
        }
      },
      fail: res=>{
        wx.showToast({
          title: res.data.message,
        })
        console.log(res.data.message)
      }
    })
  },

  navigateToModifyPage: function () {
    const { userId, userName, userDepartment, userRole } = this.data;
    wx.navigateTo({
      url: `./user_modify?userId=${encodeURIComponent(userId)}&userName=${encodeURIComponent(userName)}&userDepartment=${encodeURIComponent(userDepartment)}&userRole=${encodeURIComponent(userRole)}`,
    })
  },
  deleteUser: function () {
    const { userId } = this.data;
    wx.showModal({
      title: '提示',
      content: '确认要修改该记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'http://localhost:8080/api/admin/user/delete',
            method: 'POST',
            data:{
              accessToken:wx.getStorageSync('accessToken'),
              userId:userId
            },
            success: res=>{
              if(res.data.status == 0){
                wx.reLaunch({
                  url: './user',
                })
              }
              else{
                wx.showToast({
                  title: res.data.message,
                })
              }
            }
          }); 
        }
      }
    });
  }
})