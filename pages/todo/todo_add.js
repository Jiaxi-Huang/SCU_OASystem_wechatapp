var dateTimePicker = require('../../utils/datetimePicker.js');

Page({
  data: {
    industryarr:[],
    industryindex:0,
    statusarr:[],
    statusindex:0,
    jobarr:[],
    jobindex:0,
    type:"",
    time:"",
    de_id:"",
    uploadimgs:[], //上传图片列表
    editable: false, //是否可编辑
    uploadAttachmentId:[],
    dateTimeArray: [],
    dateTime: null,
    dateTimeArray1: [],
    dateTime1: null,
    dateTimeStr: null,
  },
  onLoad: function () {
       // 获取完整的年月日 时分秒，以及默认显示的数组
       var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
       var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
       // 精确到分的处理，将数组的秒去掉
       var lastArray = obj1.dateTimeArray.pop();
       var lastTime = obj1.dateTime.pop();
   
       this.setData({
         dateTime: obj.dateTime,
         dateTimeArray: obj.dateTimeArray,
         dateTimeArray1: obj1.dateTimeArray,
         dateTime1: obj1.dateTime
       });
  },
  applySubmit:function(){
    if (!this.checkInput()) {
      return;
    }
    let that = this;
    console.log(that.data.type);
    console.log(that.data.time);
    console.log(that.data.de_id);
    wx.showModal({
      cancelColor: "cancelColor",
      title: '提示',
      content: '确认要添加该记录吗',
      complete: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'http://localhost:8890/WeChatDemo_war_exploded/device_file_servlet_action?action=add_device_record',
            data:{
              "device_id":that.data.de_id,
              "device_type":that.data.type,
              "gps_time":that.data.time,
              "attachment_ids":that.data.uploadAttachmentId,
            },
            success:function(res) {
              wx.showToast({
                title: '成功添加',
                duration:1000,
                success:function (res) {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: 'todo_list'
                    }, 1000);
                  })
                }
              })
             
            },
            fail:function(res) {
              console.log("Add失败");
            }
          })
       }
      }
    })
  },
  inputType:function (e) {
    this.setData({
      type:e.detail.value
    });
  },
  inputDeId:function (e) {
    this.setData({
      de_id:e.detail.value
    });
  },
  inputGps:function (e) {
    this.setData({
      time:e.detail.value
    });
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
          url: 'http://localhost:8890/WeChatDemo_war_exploded/device_file_servlet_action?action=upload_file',
          header:{"content-type":"application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest"},
          success:function (res) {
            console.log(JSON.stringify(res.data));
            var data = JSON.parse(res.data);
            _this.data.uploadAttachmentId.push(data.attachment_id);
            console.log(_this.data.uploadAttachmentId);
          },
          fail:function (res) {
            console.log(JSON.stringify(res));
          },
          complete:function (res) {
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
  checkInput: function () {
    let that = this;
    var ok = true;
    if (that.data.de_id === undefined || that.de_id === null || that.data.de_id === "") {
      ok = false;
      console.log("de_id");
      console.log(that.data.de_id);
    }
    if (that.data.type === undefined ||that.data.type === null || that.data.type === "") {
      ok = false;
      console.log("type");
    }
    if (that.data.time === undefined || that.data.time === null || that.data.time === "") {
      ok = false;
      console.log("time");
    }
  
    if (!ok) {
      wx.showToast({
        title: '有漏填项',
        icon:"none",
      });
    }
    return ok;
  },
  changeDate(e){
    this.setData({ date:e.detail.value});
  },
  changeTime(e){
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e){
    this.setData({ dateTime: e.detail.value });
    var dateTimeStr = this.getCurrentDateTime();
    this.setData({
      time:dateTimeStr,
    });
  },
  getCurrentDateTime:function () {
    var str =  this.data.dateTimeArray[0][this.data.dateTime[0]]+"-"+this.data.dateTimeArray[1][this.data.dateTime[1]]+"-"+this.data.dateTimeArray[2][this.data.dateTime[2]]+" "+this.data.dateTimeArray[3][this.data.dateTime[3]]+"-"+this.data.dateTimeArray[4][this.data.dateTime[4]]+"-"+this.data.dateTimeArray[5][this.data.dateTime[5]];
    return str;
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e){
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

})
