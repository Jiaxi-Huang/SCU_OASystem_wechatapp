import dateTimePicker  from './../../utils/datetimePicker.js'
import util from './../../utils/util.js';
Page({
  data: {
    objectId:"",
    receiverId:"",
    receiverType:"",
    messageType:"",
    messageContent:"",
    uploadimgs:[], //上传图片列表
    editable: false, //是否可编辑,
    uploadAttachmentId:[]
  },
  onLoad: function () {
    // 初始化日期时间选择器
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
  inputMessageType:function(e){
    this.setData({
      messageType:e.detail.value
    });
  },
  inputMessageContent:function(e){
    this.setData({
      messageContent:e.detail.value
    });
  },
  checkInput:function(e){
    var ok = true;
    if(this.data.objectId==undefined ||this.data.receiverType==undefined||this.data.receiverId==undefined||this.data.messageType==undefined
      ||this.data.messageContent==undefined){
        wx.showToast({
          title:"请输入用户消息",
          icon:"none",
        })
        ok = false;
      }
      return ok;
  },
  chooseImage:function() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if(res.tapIndex == 0){
            _this.chooseWxImage('album')
          }else if(res.tapIndex == 1){
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage:function(type){
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        });
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'img',
          url: 'http://localhost:8080/TeachDemo_war_exploded/project_todo_servlet_action?action=upload_record',
          header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest" },
          success: function(res){
            console.log(JSON.stringify(res.data));
            var data = JSON.parse(res.data);
            _this.data.uploadAttachmentId.push(data.attachment_id);
            console.log(_this.data.uploadAttachmentId);
          },
          fail:function(res){
            console.log(JSON.stringify(res));
          },
          complete: function(res){
            console.log(JSON.stringify(res));
          }
        })
      }
    })
  },
  editImage:function(){
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg:function(e){
    console.log(e.currentTarget.dataset.index);
    const imgs = this.data.uploadimgs
    // Array.prototype.remove = function(i){
    //   const l = this.length;
    //   if(l==1){
    //     return []
    //   }else if(i>1){
    //     return [].concat(this.splice(0,i),this.splice(i+1,l-1))
    //   }
    // }
    this.setData({
      uploadimgs: imgs.remove(e.currentTarget.dataset.index)
    })
  },
  sumbitAddRecord:function(){
    if(this.checkInput()){
      console.log(this.data.uploadAttachmentId);
      wx.request({
        url: 'http://localhost:8080/TeachDemo_war_exploded/project_todo_servlet_action?action=add_todo_record',
        //data这里要带上三个参数：
        //1.前端构造好的sql语句；
        //2.所要操作的数据库名称，比如：test，等等；
        //3.动作的id，比如这里是update_record，写在data里也可以，写在url上也可以
        data: {"object_id":this.data.objectId,"receiver_id":this.data.receiverId,"receiver_type":this.data.receiverType,"message_type":this.data.messageType
        ,"message_content":this.data.messageContent,"attachment_ids":this.data.uploadAttachmentId},
        header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest" },
        success: function (res) {
          wx.showToast({
            title: '已经添加完毕！',
            icon: "none",
            duration: 2000,
            success: function (res) {
              setTimeout(function () {
                //要延时执行的代码
                //xxxxxxxx
                wx.navigateBack({delta:1});
              }, 2000) //延迟时间
            }
          })
        },
        fail: function (res) {
        }
      })
    }
  }
})