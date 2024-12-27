var dateTimePicker = require('../../utils/datetimePicker.js');

Page({
  data: {
    industryarr:[],
    industryindex:0,
    statusarr:[],
    statusindex:0,
    jobarr:[],
    jobindex:0,
    uploadimgs:[], //上传图片列表
    editable: false, //是否可编辑
    uploadAttachmentId:[],
    // todo record
    record: null,
    // date time picker
    dateTimeStr: null,
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },
  onLoad: function () {
       // 获取完整的年月日 时分秒，以及默认显示的数组
       var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
       // 精确到分的处理，将数组的秒去掉
       obj.dateTimeArray.pop();
       obj.dateTime.pop();
  
       this.setData({
         dateTime: obj.dateTime,
         dateTimeArray: obj.dateTimeArray,
       });
       this.presetDateTime();
  },
  applySubmit:function(){
    let that = this;
    let record = that.data.record;    
    wx.getStorage({
      key: 'accessToken', 
      success: function(res) {
        record.accessToken = res.data;
        record.mtin_fin =  0;
        wx.request({
          url: 'http://localhost:8080/api/meetings/createMeeting',
          data: record,
          method: 'POST',
          success:function(res) {
            let pages = getCurrentPages(); //获取小程序页面栈
            pages[pages.length -2].goBackUpdateInfo(); //使用上个页面的实例对象的方法
            wx.navigateBack();
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
    // wx.showModal({
    //   cancelColor: "cancelColor",
    //   title: '提示',
    //   content: '确认要修改该记录吗',
    //   complete: (res) => {
    //     if (res.confirm) {
    //       wx.request({
    //         url: 'http://localhost:8080/api/todolist/modifyRec',
    //         method: 'POST',
    //         data: record,
    //         success:function(res) {
    //           wx.navigateTo({
    //             url: 'todo'
    //           });
    //         },
    //         fail:function(res) {
    //           console.log("Modify失败");
    //         }
    //       })
    //    }
    //   }
    // })
  },
  inputChange: function (e) {
    const field = e.target.dataset.field;  
    const value = e.detail.value;
    this.setData({
      [`record.${field}`]: value
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
      "record.mtin_st": dateTimeStr
    });
  },
  presetDateTime(){
    var dateTimeStr = this.getCurrentDateTime();
    console.log(dateTimeStr);
    this.setData({
      "record.mtin_st": dateTimeStr
    });
  },
  getCurrentDateTime:function () {
    // var str =  this.data.dateTimeArray[0][this.data.dateTime[0]]+"-"+this.data.dateTimeArray[1][this.data.dateTime[1]]+"-"+this.data.dateTimeArray[2][this.data.dateTime[2]]+" "+this.data.dateTimeArray[3][this.data.dateTime[3]]+":"+this.data.dateTimeArray[4][this.data.dateTime[4]]+"-"+this.data.dateTimeArray[5][this.data.dateTime[5]];
    var str =  this.data.dateTimeArray[0][this.data.dateTime[0]]+"-"+this.data.dateTimeArray[1][this.data.dateTime[1]]+"-"+this.data.dateTimeArray[2][this.data.dateTime[2]]+" "+this.data.dateTimeArray[3][this.data.dateTime[3]]+":"+this.data.dateTimeArray[4][this.data.dateTime[4]];
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

})
