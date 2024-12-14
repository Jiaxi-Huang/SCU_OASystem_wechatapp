Page({
  data: {
    id:0,
    objectId:"",
    receiverId:"",
    receiverType:"",
  },
  onLoad: function (option) {
    var record = JSON.parse(option.record);
    console.log(record);
    this.setData({
      objectid:record.objectid,
      id:record.id,
      receiverType : record.receiverType,
    });
  },
  inputId:function(e){
    this.setData({
      id:e.detail.value
    });
  },
  inputReceiverType:function(e){
    this.setData({
      receiverType:e.detail.value
    });
  },
  inputReceiverId:function(e){
    this.setData({
      receiverId:e.detail.value
    });
  },
  inputObjectId:function(e){
    this.setData({
      objectId:e.detail.value
    });
  },
  sumbitModifyRecord:function(){
    wx.request({
      url: 'http://localhost:8080/TeachDemo_war_exploded/project_todo_servlet_action?action=modify_todo_record',
      //data这里要带上三个参数：
      //1.前端构造好的sql语句；
      //2.所要操作的数据库名称，比如：test，等等；
      //3.动作的id，比如这里是update_record，写在data里也可以，写在url上也可以
      data: {"id":this.data.id,"object_id":this.data.objectId,"receiver_id":this.data.receiverId,"receiver_type":this.data.receiverType},
      header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest" },
      success: function (res) {
        wx.navigateTo({
          url: 'list',
        })
      }
    })
  }
})