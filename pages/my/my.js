Page({
  data: {
    userName:'',
    userDepartment:'',
    userRole:'',
    userEmail:'',
    userPhone:'',
    userAvatar:'',
    userIntro:''
  },
  onLoad: function () { //加载数据渲染页面
    this.fetchUserInfo();
  },
  onShow() {
    // 确保每次显示页面时都加载最新的本地存储数据
    this.fetchUserInfo();
  },
  fetchUserInfo:function(){  //输入搜索文字
    wx.request({
      url: 'http://localhost:8080/api/auth/user/userInfo',
      method: 'POST',
      data:{
        accessToken:wx.getStorageSync('accessToken')
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
            userIntro:res.data.data.userIntro
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
    const { userName, userIntro, userPhone } = this.data;
    wx.navigateTo({
      url: `/pages/my/my_modify?userName=${encodeURIComponent(userName)}&userIntro=${encodeURIComponent(userIntro)}`,
    })
  }
})