Page({
  data: {
    industryarr:[],
    industryindex:0,
    statusarr:[],
    statusindex:0,
    jobarr:[],
    jobindex:0,
    hasfinancing: false,  //是否已融资
    isorg: false,  //是否是机构
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
          console.log('modify的 record:', this.data.record); 
        });
      } catch (error) {
        console.error('modify JSON 解析失败:', error);
      }
    } else {
      console.error('modify 没有提供有效的 record 参数');
    }
  },
  fetchData: function(){
    this.setData({
      industryarr:["请选择","移动互联网","手机游戏","互联网金融","O2O","智能硬件","SNS社交","旅游","影视剧","生活服务","电子商务","教育培训","运动和健康","休闲娱乐","现代农业","文化创意","节能环保","新能源","生物医药","IT软件","硬件","其他"],
      statusarr:["请选择","初创时期","市场扩展期","已经盈利"],
      jobarr:["请选择","创始人","联合创始人","产品","技术","营销","运营","设计","行政","其他"]
    })
  },
  bindPickerChange: function(e){ //下拉选择
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    // this.setData(Object.assign({},this.data,{name:eindex}))
    switch(name) {
      case 'industry':
        this.setData({
          industryindex: eindex
        })
        break;
      case 'status':
        this.setData({
          statusindex: eindex
        })
        break;
      case 'job':
        this.setData({
          jobindex: eindex
        })
        break;
      default:
        return
    }
  },
  setFinance:function(e){ //选择融资
    this.setData({
      hasfinancing:e.detail.value=="已融资"?true:false
    })
  },
  setIsorg:function(e){ //选择投资主体
    this.setData({
      isorg:e.detail.value=="机构"?true:false
    })
  },
  applySubmit:function(){
    let that = this;
    let record = that.data.record;
    delete record.imageUrl;
    console.log("上传的todo record");
    console.log(record);
    console.log(record.id);
    wx.showModal({
      cancelColor: "cancelColor",
      title: '提示',
      content: '确认要修改该记录吗',
      complete: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'http://localhost:8080/api/file/modifyFile',
            method: 'POST',
            data:{
              acsTkn: wx.getStorageSync('accessToken'),
              dirId:record.dirId,
              id:record.id,
              fileName:record.fileName
            },
            success:function(res) {
              console.log(res.data)
              
            },
            fail:function(res) {
              console.log("Modify失败");
            }
          })
          wx.request({
            url: 'http://localhost:8080/api/file/remarkFile',
            method: 'POST',
            data:{
              acsTkn: wx.getStorageSync('accessToken'),
              beforeDirId:record.dirId,
              ids:[record.id],
              remark:record.remark
            },
            success:function(res) {
              let pages = getCurrentPages(); //获取小程序页面栈
              pages[pages.length -2].goBackUpdateInfo(); //使用上个页面的实例对象的方法
              wx.navigateBack();
              if(res.data.status===-1){
                console.log("status1")
                wx.showToast({
                  title: '等级权限不够 无法修改！',
                  icon: 'none',
                  duration: 2000//持续的时间
                })
              }
              if(res.data.status===0){
                console.log("status0")
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000//持续的时间
                })
              }
            },
            fail:function(res) {
              console.log("Modify失败");
            }
          })
       }
      }
    })
    
  },
  inputChange: function (e) {
    const field = e.target.dataset.field;  
    const value = e.detail.value;
    this.setData({
      [`record.${field}`]: value
    });
  },
  
})
