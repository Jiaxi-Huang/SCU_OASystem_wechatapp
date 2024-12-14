//获取应用实例
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false,
        code: '',
        sessionkey:'',
        openid : '',
        userInfo: {}
    },
    onLoad: function() {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                          console.log(res)
                            // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                            // 根据自己的需求有其他操作再补充
                            // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                            wx.login({
                                success: res => {
                                    // 获取到用户的 code 之后：res.code
                                    that.setData({
                                      code: res.code
                                    })
                                    console.log("用户的code:" + res.code);
                                    // 可以传给后台，再经过解析获取用户的 openid
                                    // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                                    if(res.code){
                                    wx.request({
                                      // 自行补上自己的 APPID 和 SECRET
                                      url: 'https://api.weixin.qq.com/sns/jscode2session',
                                      data:{
                                        appid:'wx19134a58ea6e86b8',
                                        secret:'ab25867c71a52b7eb977e1323655d768',
                                        js_code:res.code,
                                        grant_type:'authorization_code'
                                      },
                                      success: res => {
                                      // 获取到用户的 openid
                                        that.setData({
                                          sessionkey:res.data.session_key,
                                          openid:res.data.openid
                                        })
                                        console.log("用户的openid:" + that.data.openid)
                                        wx.request({
                                          url:'http://localhost:8080/api/auth/wechat/login',
                                          method:"POST",
                                          data:{
                                            openid:res.data.openid
                                          },
                                          success: res=>{
                                            if(res.data.status === 0){
                                            wx.switchTab({
                                              url: '../index/index',
                                            })
                                            }
                                            else{
                                              wx.showToast({
                                                title: res.data.message,
                                                icon:'error'
                                              })
                                            }
                                          },
                                          fail : res=>{
                                            wx.showToast({
                                              title: res.data.message,
                                              icon:'error'
                                            })
                                          }
                                        })
                                      }
                                    });
                                  }
                                  else{
                                    console.log("登陆失败"+res.errMsg)
                                  }
                                }
                            });
                        }
                    });
                } else {
                    // 用户没有授权
                    // 改变 isHide 的值，显示授权页面
                    that.setData({
                        isHide: true
                    });
                }
            }
        });
    },
    bindGetPhoneNumber(e) {
      let that = this;
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        // 用户同意获取手机号
        const { encryptedData, iv } = e.detail;
        // 将encryptedData和iv发送到后端解密
        this.sendCryptedDataToServer(encryptedData, iv);
      } else {
        console.log('用户拒绝提供手机号');
      }
    },
    sendCryptedDataToServer(encryptedData, iv) {
      var that = this;
      wx.request({
        url: 'http://localhost:8080/api/auth/wechat/bind', // 替换为实际的URL
        method: 'POST',
        data: {
          "openid":that.data.openid,
          "sessionKey":that.data.sessionkey,
          "encryptedData":encryptedData,
          "iv":iv
        },
        success: res=>{
          if(res.data.status === 0){
          wx.switchTab({
            url: '../index/index',
          })
          }
          else{
            wx.showToast({
              title: res.data.message,
              icon:'error'
            })
          }
        },
        fail : res=>{
          wx.showToast({
            title: res.data.message,
            icon:'error'
          })
        }
      });
    }
    
})