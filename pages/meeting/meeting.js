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
        item.status = i? i==1? "预约": "已完成" : "今天";
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
    wx.navigateTo({
      url: 'meeting_add',
    });
  },
  onCreateRecord:function () {
    wx.navigateTo({
      url: 'meeting_crt',
    });
  },
})