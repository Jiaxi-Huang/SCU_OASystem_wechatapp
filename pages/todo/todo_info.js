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
    wx.navigateBack();
  },  
})
