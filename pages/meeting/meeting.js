Page({
  data: {
    showsearch:false,   //显示搜索按钮
    searchtext:'',  //搜索文字
    filterdata:{},  //筛选条件数据
    showfilter:false, //是否显示下拉筛选
    showfilterindex:null, //显示哪个筛选类目
    sortindex:0,  //一级分类索引
    sortid:null,  //一级分类id
    subsortindex:0, //二级分类索引
    subsortid:null, //二级分类id
    cityindex:0,  //一级城市索引
    cityid:null,  //一级城市id
    subcityindex:0,  //二级城市索引
    subcityid:null, //二级城市id
    servicelist:[], //服务集市列表
    scrolltop:null, //滚动位置
    page: 0,  //分页
    meeting_list:[],
    flitered_list:[],

    isPopupVisible: false,  // 控制弹出框显示
    inputValue: '',         // 存储输入框的值
    message: ''             // 显示查询结果消息
  },
  onLoad: function () { //加载数据渲染页面
    // this.fetchServiceData();
    this.fetchFilterData();
    // console.log("getTodoRecord");
    this.getTodoRecord();
  },
  refresh:function(){ //获取筛选条件
    this.setData({
      flitered_list: this.data.meeting_list,
    })
  },
  fetchFilterData:function(){ //获取筛选条件
    this.setData({
      filterdata:{
        "sort": [
          {"id": 0,
          "title": "今天的会议",
          } ,
          {"id": 2,
          "title": "已完成会议",
          } ,
          {"id": 1,
          "title": "预约的会议",
          } ,
      ],
      }
    })
  },
  fetchServiceData:function(){ 
    let _this = this;
    const key = _this.data.searchtext;
    console.log(key);
    let temp_list = [];
    _this.data.meeting_list.forEach(record => {
      if (record.mtin_title.includes(key)) {
        console.log(record.todo_title + "ok");
        temp_list.push(record);
      }
    });
    _this.setData({
      flitered_list: temp_list
    })
  },
  inputSearch:function(e){  //输入搜索文字
    this.setData({
      showsearch:e.detail.cursor>0,
      searchtext:e.detail.value
    })
  },
  submitSearch:function(){  //提交搜索
    this.fetchServiceData();
  },
  setFilterPanel: function(e){ //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if(d.showfilterindex == i){
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    }else{    
      this.setData({
        showfilter: true,
        showfilterindex:i,
      })
    }
    // console.log(d.showfilterindex);
  },
  setSortIndex:function(e){
    const dataset = e.currentTarget.dataset;
    this.setData({
      showfilter: 0,
    })
    const key = dataset.sortid? dataset.sortid==1? "预约": "已完成" : "今天";
    // console.log(key);
    let temp_list = [];
    let _this = this;
    _this.data.meeting_list.forEach(record => {
      if (record.status === key) {
        temp_list.push(record);
      }
    });
    _this.setData({
      flitered_list: temp_list
    })
  },
  setSubsortIndex:function(e){ //服务类别二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subsortindex:dataset.subsortindex,
      subsortid:dataset.subsortid,
    })
    // console.log('服务类别id：一级--'+this.data.sortid+',二级--'+this.data.subsortid);
  },
  setCityIndex:function(e){ //服务城市一级索引
    const d= this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      cityindex:dataset.cityindex,
      cityid:dataset.cityid,
      subcityindex: d.cityindex==dataset.cityindex ? d.subcityindex:0
    })
    console.log('服务城市id：一级--'+this.data.cityid+',二级--'+this.data.subcityid);
  },
  setSubcityIndex:function(e){ //服务城市二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subcityindex:dataset.subcityindex,
      subcityid:dataset.subcityid,
    })
    console.log('服务城市id：一级--'+this.data.cityid+',二级--'+this.data.subcityid);
  },
  hideFilter: function(){ //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  // 查询按钮点击事件
  onQueryClick() {
    const mtin_id = this.data.inputValue.trim();
    
    if (mtin_id === '') {  // Check if input is empty
      wx.showToast({
        title: '请输入会议ID',
        icon: 'error',
        duration: 1000,
      });
      return;
    }
    const mtin_id_number = Number(mtin_id);  
    if (isNaN(mtin_id_number)) {  // Check if it's a valid number
      wx.showToast({
        title: '会议ID是数字',
        icon: 'error',
        duration: 1000,
      });
      return;
    }

    let all = this.data.meeting_list;
    for (const record of all) {
      if (record.mtin_id == mtin_id) {
        wx.showToast({
          title: '该会议已经添加',
          icon: 'error',
          duration: 2000,
        })
        return;
      }
    }
    wx.request({
      url: 'http://localhost:8080/api/meetings/search_by_mtin_id', 
      method: 'POST',
      data: { data: [mtin_id_number] },
      success: (res) => {
        let data = res.data;
        if (data.status === 0) {
          var record = JSON.stringify(data.data[0]);
          wx.navigateTo({
            url: 'meeting_add?record=' + record,
          });
        } else {
          wx.showToast({
            title: "没有找到对应的会议",
            icon: 'error',
            duration: 2000,
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: "查询失败，请稍后再试",
          icon: 'error',
          duration: 2000,
        })
      }
    });
    
  },
   // 关闭弹出框
   closePopup() {
    this.setData({
      isPopupVisible: false,
      inputValue: '',  // 清空输入框
      message: ''      // 清空查询结果消息
    });
  },
  showAddSuccess:function () {
    this.closePopup();
  },
  scrollHandle:function(e){ //滚动事件
    this.setData({
      scrolltop:e.detail.scrollTop
    })
  },
  goToTop:function(){ //回到顶部
    this.setData({
      scrolltop:0
    })
  },
  scrollLoading:function(){ //滚动加载
    this.fetchServiceData();
  },
  onPullDownRefresh:function(){ //下拉刷新
    this.setData({
      page:0,
      servicelist:[]
    })
    this.fetchServiceData();
    this.fetchFilterData();
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
  },
  getTodoRecord:function() {
    let that = this;
    // console.log("执行到getTodoRecord了");
    wx.getStorage({
      key: 'accessToken', 
      success: function(res) {
        const accessToken = res.data;
        wx.request({
          url: 'http://localhost:8080/api/meetings/getMyMeetings',
          data:{accessToken: accessToken},
          method: 'POST',
          success:function(res) {
            // console.log("records get!");
            that.handleGetTodoResult(res);
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
  handleGetTodoResult:function(res) {
    // console.log("执行到handleGetTodoResult了");
    let that = this;
    // 使用 setData 更新 meeting_list 并确保图片路径正确
    let all = []
    for (var i = 0; i <=2; ++i) {
      let batch = res.data.data[i];
      // console.log(batch);
      batch.map(item => {
        item.url = i? i==1? "/images/biaoxingfill.png": "/images/shizhong.png" : "/images/tishifill.png";
        item.status = i? i==1? "今天": "已完成" : "预约";
        all.push(item);
      })
    }
    that.setData({
      meeting_list: all,
    }, () => {
      that.setData({
        flitered_list: that.data.meeting_list,
      })
    });
  },
  onModifyRecord:function (e)  { //e is "event"
    var record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'meeting_modify?record=' + record,
    });
  },
  onInfo:function (e)  { //e is "event"
    var record = JSON.stringify(e.target.dataset.record);
    wx.navigateTo({
      url: 'meeting_info?record=' + record,
    });
  },
  onShare:function (e)  { //e is "event"
    var record = e.target.dataset.record;
    const content = "[SCU_OA]我分享了一个会议\n标题: " 
    + record.mtin_title + "\n会议ID: " + record.mtin_id + "\n开始时间: " + record.mtin_st;
    wx.setClipboardData({
      data: content, // 要复制的内容
      success: function () {
        // 复制成功后的回调
        wx.showToast({
          title: '会议信息已复制',
          icon: 'success',
          duration: 2000,
        });
      },
      fail: function () {
        // 复制失败的回调
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },
  goBackUpdateInfo:function ()  { //e is "event"
    this.getTodoRecord();
  },
  onDeleteRecord:function (e) {
    var mtin_id = e.target.dataset.mtin_id;
    let that = this;
    wx.getStorage({
      key: 'accessToken', 
      success: function(res) {
        const accessToken = res.data;
        wx.showModal({
          cancelColor: "cancelColor",
          title: '提示',
          content: '确认要删除ID '+ mtin_id + '的记录吗',
          complete: (res) => {
            if (res.confirm) {
              wx.request({
              url: 'http://localhost:8080/api/meetings/deleteMeetingPersonally',
                method: 'POST',
                data:{
                  "mtin_id":mtin_id,
                  "accessToken": accessToken,
                },
                success:function(res) {
                  that.getTodoRecord();
                },
                fail:function(res) {
                  console.log("失败");
                }
              })
           }
          }
        })
      },
      fail: function(err) {
        // 如果获取失败，这里会执行
        console.error('获取accessToken失败:', err);
      }
    });
  },
  onAddRecord:function () {
    this.setData({
      isPopupVisible: true
    });
  },
  onCreateRecord:function () {
    wx.navigateTo({
      url: 'meeting_crt',
    });
  },
})