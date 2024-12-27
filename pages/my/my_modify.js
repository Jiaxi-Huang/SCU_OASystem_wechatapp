// user_modify.js
Page({
  data: {
    username: '',
    intro: ''
  },

  onLoad(options) {
    // 解析传入的参数并设置到data中
    this.setData({
      username: decodeURIComponent(options.userName || ''),
      intro: decodeURIComponent(options.userIntro || ''),
    });
  },

  formSubmit() {
    // 这里可以添加验证逻辑
    wx.showModal({
      title: '提示',
      content: '确认要修改该记录吗？',
      success: (res) => {
        if (res.confirm) {
        // 发送更新请求到服务器
        wx.request({
          url: 'http://localhost:8080/api/setting/wechatInfo',
          method: 'POST',
          data: {
            accessToken: wx.getStorageSync('accessToken'),
            username: this.data.username,
            intro: this.data.intro
          },
          success: res => {
            if (res.data.status === 0) {
              wx.showToast({
                title: '更新成功'
              });
              setTimeout(() => {
                // 使用 wx.reLaunch 或 wx.redirectTo 重新加载页面
                wx.reLaunch({
                  url: '/pages/my/my'
                });
              }, 1000);
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'error'
              });
            }
          },
          fail: err => {
            console.error(err);
            wx.showToast({
              title: '更新失败，请重试',
              icon: 'error'
            });
          }
        });
      }
      }
    })
  },
    // 输入框变化事件
    inputChange(e) {
      const { field } = e.currentTarget.dataset;
      this.setData({
        [field]: e.detail.value
      });
    }
});