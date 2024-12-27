Page({
  data: {
    record: {},
  },
  onLoad: function () {
    var record;
    if (this.options.record) {
      try {
        record = JSON.parse(this.options.record);
        this.setData({
          record: record
        }, () => {
          // console.log('modify的 record:', this.data.record); 
        });
      } catch (error) {
        console.error('modify JSON 解析失败:', error);
      }
    } else {
      console.error('modify 没有提供有效的 record 参数');
    }
  },
  applySubmit:function(){
    const record = { mtin_id: this.data.record.mtin_id};
    wx.getStorage({
      key: 'accessToken', 
      success: function(res) {
        record.accessToken = res.data;
        wx.request({
          url: 'http://localhost:8080/api/meetings/addMeetingPersonally',
          data: record,
          method: 'POST',
          success:function(res) {
            let pages = getCurrentPages(); //获取小程序页面栈
            let beforePage = pages[pages.length -2];
            beforePage.showAddSuccess(); //使用上个页面的实例对象的方法
            wx.showToast({
              title: "添加成功！",
              icon: 'success',
              duration: 1000, // 设置适当的显示时长
              success: function () {
                // Toast 显示完成后再执行页面跳转
                setTimeout(function () {
                  beforePage.goBackUpdateInfo();
                  wx.navigateBack();
                }, 1000); // 延迟 2秒跳转，确保 Toast 显示
              }
            });
          },
          fail:function(res) {
              
          }
        })
      },
      fail: function(err) {
        // 如果获取失败，这里会执行
        console.error('获取accessToken失败:', err);
      }
    });
  },  
  goBack:function(){
    wx.navigateBack();
  },  
})
